"use server";

import { revalidatePath } from "next/cache";
import { BlogComment, BlogPost, PortfolioItem } from "@/lib/data";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, storage } from "./firebase";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateSlug, slidingWindowHit } from "./utils";
import {
  getEffectiveAiConfig,
  getAiConfigSummary,
  isQuotaOrRateLimitError,
  DEFAULT_PRIMARY_MODEL,
  DEFAULT_FALLBACK_MODELS,
  type AiConfigSummary,
} from "./ai";

const SESSION_COOKIE = "admin_session";

// Password comes ONLY from the environment. A development-only default keeps
// local `next dev` usable; in production an unset password fails closed
// (login is impossible) instead of exposing a hardcoded credential.
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ??
  (process.env.NODE_ENV !== "production" ? "000Nepal" : undefined);

// ─── AUTH ────────────────────────────────────────────────────────────────────

/**
 * Server-side guard for every mutation action. Page layouts only protect the
 * HTML pages; server actions are standalone endpoints and must check the
 * session cookie themselves.
 */
export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value !== "authenticated") {
    redirect("/admin/login");
  }
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === "authenticated";
}

// ─── RATE LIMITING ───────────────────────────────────────────────────────────
// Simple in-memory sliding-window limiter for the public actions. Note: this
// is per-process, so on serverless hosts it is best-effort (resets on cold
// start). For strict limits, back this with Redis or a WAF.

const rateBuckets = new Map<string, number[]>();

async function rateLimit(action: string, max: number, windowMs: number): Promise<boolean> {
  try {
    const hdrs = await headers();
    const ip = (hdrs.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
    return slidingWindowHit(rateBuckets, `${action}:${ip}`, Date.now(), max, windowMs);
  } catch {
    return true; // fail open if headers are unavailable
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || !file.name || file.size === 0 || typeof file.arrayBuffer !== "function") {
    return null;
  }
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const storageRef = ref(storage, `images/${fileName}`);
    
    // Pass metadata so Firebase knows it's an image, not an octet-stream attachment
    const metadata = {
      contentType: file.type || 'image/jpeg',
    };
    
    await uploadBytes(storageRef, bytes, metadata);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    return null; // Return null instead of crashing the whole action
  }
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

export async function createBlogPost(formData: FormData) {
  await requireAuth();
  const id = Date.now();
  const title_en = formData.get("title_en") as string;

  // Generate a unique slug — setDoc(doc(db, "blogs", slug)) would otherwise
  // silently overwrite an existing post with the same title.
  const baseSlug = generateSlug(title_en, id);
  let slug = baseSlug;
  for (let n = 2; (await getDoc(doc(db, "blogs", slug))).exists(); n++) {
    slug = `${baseSlug}-${n}`;
  }

  const newPost: BlogPost = {
    id,
    slug,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
    title_en,
    title_ja: formData.get("title_ja") as string,
    excerpt_en: formData.get("excerpt_en") as string,
    excerpt_ja: formData.get("excerpt_ja") as string,
    content_en: formData.get("content_en") as string,
    content_ja: formData.get("content_ja") as string,
    image: await uploadImage(formData.get("image") as File | null) || (formData.get("imageUrl") as string) || "",
    published: formData.get("published") === "true",
  };

  await setDoc(doc(db, "blogs", slug), newPost);

  revalidatePath("/");
  revalidatePath("/blogs");
  redirect("/admin/blogs?saved=1");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireAuth();
  const title_en = formData.get("title_en") as string;
  const existingSlug = formData.get("existingSlug") as string;
  const oldDocId = existingSlug || id.toString();

  // Generate a unique slug that doesn't collide with a *different* post
  const baseSlug = generateSlug(title_en, id);
  let slug = baseSlug;
  for (let n = 2; (await getDoc(doc(db, "blogs", slug))).exists() && slug !== oldDocId && n < 100; n++) {
    slug = `${baseSlug}-${n}`;
  }

  const updatedData = {
    title_en,
    title_ja: formData.get("title_ja") as string,
    slug,
    excerpt_en: formData.get("excerpt_en") as string,
    excerpt_ja: formData.get("excerpt_ja") as string,
    content_en: formData.get("content_en") as string,
    content_ja: formData.get("content_ja") as string,
    image: await uploadImage(formData.get("image") as File | null) || (formData.get("imageUrl") as string) || (formData.get("existingImage") as string) || "",
    date: formData.get("date") as string,
    published: formData.get("published") === "true",
  };

  // If the document ID (slug or old numeric ID) changed, delete old and create new
  if (oldDocId !== slug) {
    // Migrate comments to the new slug so existing discussions aren't orphaned
    try {
      const commentSnap = await getDocs(query(collection(db, "comments"), where("blogSlug", "==", oldDocId)));
      await Promise.all(commentSnap.docs.map((d) => updateDoc(d.ref, { blogSlug: slug })));
    } catch (error) {
      console.error("Error migrating comments to new slug:", error);
    }
    await deleteDoc(doc(db, "blogs", oldDocId));
    await setDoc(doc(db, "blogs", slug), { id, ...updatedData });
  } else {
    // Just update the existing document
    await updateDoc(doc(db, "blogs", slug), updatedData);
  }

  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  redirect("/admin/blogs?saved=1");
}

export async function deleteBlogPost(id: number, slug?: string) {
  await requireAuth();
  const docId = slug || id.toString();
  await deleteDoc(doc(db, "blogs", docId));

  // Cascade-delete comments so they can't resurface if the slug is reused
  try {
    const commentSnap = await getDocs(query(collection(db, "comments"), where("blogSlug", "==", docId)));
    await Promise.all(commentSnap.docs.map((d) => deleteDoc(d.ref)));
  } catch (error) {
    console.error("Error deleting comments for post:", error);
  }

  revalidatePath("/");
  revalidatePath("/blogs");
}

// ─── INTERACTIONS ────────────────────────────────────────────────────────

export async function incrementLike(idOrSlug: string, type: 'blog' | 'portfolio' = 'blog') {
  if (!(await rateLimit("like", 30, 60_000))) return; // max 30 likes/min per IP
  try {
    const collectionName = type === 'portfolio' ? 'portfolio' : 'blogs';
    await updateDoc(doc(db, collectionName, idOrSlug), {
      likes: increment(1)
    });
    revalidatePath(`/${collectionName}/${idOrSlug}`);
  } catch (error) {
    console.error("Error incrementing like:", error);
  }
}

export async function addComment(idOrSlug: string, formData: FormData, type: 'blog' | 'portfolio' = 'blog') {
  if (!(await rateLimit("comment", 5, 10 * 60_000))) {
    return { success: false, error: "Too many comments — please try again later." };
  }

  const id = Date.now();
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const content = String(formData.get("content") ?? "").trim().slice(0, 2000);
  const parentIdStr = formData.get("parentId") as string;
  
  if (!name || !content) return { success: false, error: "Missing fields" };

  const newComment: BlogComment = {
    id,
    blogSlug: idOrSlug, // For backwards compatibility, keep naming or just use it as itemId
    type,               // Store type to distinguish if needed
    name,
    content,
    date: new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    approved: false, // requires admin approval
  };

  if (parentIdStr) {
    newComment.parentId = parseInt(parentIdStr);
  }

  try {
    await setDoc(doc(db, "comments", id.toString()), newComment);
    const collectionName = type === 'portfolio' ? 'portfolio' : 'blogs';
    revalidatePath(`/${collectionName}/${idOrSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function approveComment(id: number) {
  await requireAuth();
  await updateDoc(doc(db, "comments", id.toString()), { approved: true });
  revalidatePath("/admin/comments");
  revalidatePath("/blogs"); 
  revalidatePath("/portfolio", "layout");
  revalidatePath("/", "layout"); 
}

export async function deleteComment(id: number) {
  await requireAuth();
  try {
    await deleteDoc(doc(db, "comments", id.toString()));
    revalidatePath("/admin/comments");
    revalidatePath("/blogs");
    revalidatePath("/portfolio", "layout");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────

export async function createPortfolioItem(formData: FormData) {
  await requireAuth();
  const id = Date.now();
  const techString = formData.get("technologies") as string;
  const newItem: PortfolioItem = {
    id,
    title_en: formData.get("title_en") as string,
    title_ja: formData.get("title_ja") as string,
    category: formData.get("category") as string,
    overview_en: formData.get("overview_en") as string,
    overview_ja: formData.get("overview_ja") as string,
    technologies: techString.split(",").map((t) => t.trim()).filter(Boolean),
    image: await uploadImage(formData.get("image") as File | null) || (formData.get("imageUrl") as string) || "",
    liveUrl: formData.get("liveUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
  };

  await setDoc(doc(db, "portfolio", id.toString()), newItem);

  revalidatePath("/");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio?saved=1");
}

export async function updatePortfolioItem(id: number, formData: FormData) {
  await requireAuth();
  const techString = formData.get("technologies") as string;
  const updatedData = {
    title_en: formData.get("title_en") as string,
    title_ja: formData.get("title_ja") as string,
    category: formData.get("category") as string,
    overview_en: formData.get("overview_en") as string,
    overview_ja: formData.get("overview_ja") as string,
    technologies: techString.split(",").map((t) => t.trim()).filter(Boolean),
    image: await uploadImage(formData.get("image") as File | null) || (formData.get("imageUrl") as string) || (formData.get("existingImage") as string) || "",
    liveUrl: formData.get("liveUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
  };

  await updateDoc(doc(db, "portfolio", id.toString()), updatedData);

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${id}`);
  redirect("/admin/portfolio?saved=1");
}

export async function deletePortfolioItem(id: number) {
  await requireAuth();
  await deleteDoc(doc(db, "portfolio", id.toString()));

  revalidatePath("/");
  revalidatePath("/portfolio");
}

// ─── LANDING ─────────────────────────────────────────────────────────────────

export async function updateLandingContent(formData: FormData) {
  await requireAuth();
  const getLangData = (suffix: string) => ({
    hero: {
      tagline: formData.get(`tagline${suffix}`) as string,
      title: formData.get(`title${suffix}`) as string,
      subtitle: formData.get(`subtitle${suffix}`) as string,
      ctaText: formData.get(`ctaText${suffix}`) as string,
    },
    about: {
      tag: formData.get(`tag${suffix}`) as string,
      title: formData.get(`aboutTitle${suffix}`) as string,
      bio1: formData.get(`bio1${suffix}`) as string,
      bio2: formData.get(`bio2${suffix}`) as string,
      bio3: formData.get(`bio3${suffix}`) as string,
      gpa: formData.get(`gpa${suffix}`) as string,
      projects: formData.get(`projectsCount${suffix}`) as string,
      certs: formData.get(`certs${suffix}`) as string,
    }
  });

  const landingData = {
    en: getLangData("_en"),
    ja: getLangData("_ja"),
    images: {
      heroBg: await uploadImage(formData.get("heroBg") as File | null) || (formData.get("heroBgUrl") as string) || (formData.get("existingHeroBg") as string) || "",
      aboutImg: await uploadImage(formData.get("aboutImg") as File | null) || (formData.get("aboutImgUrl") as string) || (formData.get("existingAboutImg") as string) || "",
      quoteBg: await uploadImage(formData.get("quoteBg") as File | null) || (formData.get("quoteBgUrl") as string) || (formData.get("existingQuoteBg") as string) || "",
    }
  };

  await setDoc(doc(db, "site", "landing"), landingData);

  revalidatePath("/");
  redirect("/admin/landing?saved=1");
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function sendMessage(formData: FormData) {
  if (!(await rateLimit("message", 5, 10 * 60_000))) {
    redirect("/contact?error=1");
  }
  const id = Date.now();
  const newMessage = {
    id,
    name: String(formData.get("name") ?? "").trim().slice(0, 100),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    subject: String(formData.get("subject") ?? "").trim().slice(0, 200),
    message: String(formData.get("message") ?? "").trim().slice(0, 5000),
    date: new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    read: false,
    replied: false,
  };

  await setDoc(doc(db, "messages", id.toString()), newMessage);

  redirect("/contact?sent=1");
}

export async function markMessageRead(id: number) {
  await requireAuth();
  await updateDoc(doc(db, "messages", id.toString()), { read: true });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number) {
  await requireAuth();
  await deleteDoc(doc(db, "messages", id.toString()));
  revalidatePath("/admin/messages");
}

export async function markMessageReplied(id: number) {
  await requireAuth();
  await updateDoc(doc(db, "messages", id.toString()), { replied: true, read: true });
  revalidatePath("/admin/messages");
}

// ─── THEME ───────────────────────────────────────────────────────────────────

export async function updateThemeColors(formData: FormData): Promise<{ success: boolean }> {
  await requireAuth();
  const theme = {
    dark: {
      bgPrimary: formData.get("dark_bgPrimary") as string,
      bgSecondary: formData.get("dark_bgSecondary") as string,
      bgCard: formData.get("dark_bgCard") as string,
      bgNav: formData.get("dark_bgNav") as string,
      bgFooter: formData.get("dark_bgFooter") as string,
      accent: formData.get("dark_accent") as string,
      textPrimary: formData.get("dark_textPrimary") as string,
      textSecondary: formData.get("dark_textSecondary") as string,
      borderColor: formData.get("dark_borderColor") as string,
    },
    light: {
      bgPrimary: formData.get("light_bgPrimary") as string,
      bgSecondary: formData.get("light_bgSecondary") as string,
      bgCard: formData.get("light_bgCard") as string,
      bgNav: formData.get("light_bgNav") as string,
      bgFooter: formData.get("light_bgFooter") as string,
      accent: formData.get("light_accent") as string,
      textPrimary: formData.get("light_textPrimary") as string,
      textSecondary: formData.get("light_textSecondary") as string,
      borderColor: formData.get("light_borderColor") as string,
    }
  };
  await setDoc(doc(db, "site", "theme"), theme);
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/blogs");
  revalidatePath("/contact");
  revalidatePath("/about");
  return { success: true };
}

// ─── TRANSLATION (Google AI Studio / Gemini) ───────────────────────────────

async function generateTranslationWithModel(apiKey: string, prompt: string, modelName: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      "You are a professional translator. Translate the text accurately and naturally. Do not include quotes, markdown bold, notes, conversational filler, or explanations. Output ONLY the raw translated text.",
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return String(response.text()).trim();
}

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  await requireAuth(); // admin-only — prevents quota abuse by anonymous callers
  if (!text) return "";

  const { apiKey, primaryModel, fallbackModels } = await getEffectiveAiConfig();

  if (!apiKey) {
    console.error("AI API Key is not configured (neither in Admin Dashboard nor in environment variables).");
    return "Error: AI API Key is not configured. Please configure it in Admin > AI Settings or set GOOGLE_AI_STUDIO_API_KEY.";
  }

  try {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, without any additional explanation or formatting.

Text to translate:
"${text}"
`;

    const modelsToTry = [primaryModel, ...fallbackModels.filter((model) => model !== primaryModel)];

    let lastError: unknown;
    for (const modelName of modelsToTry) {
      try {
        return await generateTranslationWithModel(apiKey, prompt, modelName);
      } catch (error) {
        lastError = error;
        console.warn(`Translation attempt with model ${modelName} failed:`, error instanceof Error ? error.message : error);
        // Continue to next model in the fallback chain (handles 429 quota, 503 high demand, 404 deprecated models)
      }
    }

    throw lastError ?? new Error("Translation failed");
  } catch (error) {
    console.error("Error translating text (Google AI Studio):", error);
    if (error instanceof Error) return `Error: Could not translate. ${error.message}`;
    return `Error: Could not translate.`;
  }
}

export type TestAiResult = {
  success: boolean;
  translatedText?: string;
  modelUsed?: string;
  latencyMs?: number;
  error?: string;
};

export async function testAiTranslationAction(params: {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  customApiKey?: string;
  customModel?: string;
}): Promise<TestAiResult> {
  await requireAuth();
  const startTime = Date.now();
  try {
    const config = await getEffectiveAiConfig();
    const apiKey = params.customApiKey?.trim() || config.apiKey;
    const primaryModel = params.customModel?.trim() || config.primaryModel;

    if (!apiKey) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        error: "No API key found. Please enter a Google AI Studio API key.",
      };
    }

    const prompt = `Translate the following text from ${params.sourceLanguage} to ${params.targetLanguage}. Only return the translated text:

"${params.text}"
`;

    const modelsToTry = [primaryModel, ...config.fallbackModels.filter((m) => m !== primaryModel)];
    let lastError: unknown;

    for (const modelName of modelsToTry) {
      try {
        const translatedText = await generateTranslationWithModel(apiKey, prompt, modelName);
        return {
          success: true,
          translatedText,
          modelUsed: modelName,
          latencyMs: Date.now() - startTime,
        };
      } catch (err) {
        lastError = err;
        console.warn(`Test translation failed on ${modelName}:`, err instanceof Error ? err.message : err);
      }
    }

    throw lastError ?? new Error("Translation failed");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      error: message,
    };
  }
}

export async function getAiSettingsAction(): Promise<AiConfigSummary> {
  await requireAuth();
  return await getAiConfigSummary();
}

export async function updateAiSettingsAction(formData: FormData) {
  await requireAuth();

  const primaryModel = (formData.get("primaryModel") as string)?.trim() || DEFAULT_PRIMARY_MODEL;
  const customModel = (formData.get("customModel") as string)?.trim();
  const effectivePrimaryModel = primaryModel === "custom" && customModel ? customModel : primaryModel;

  const fallbackModelsRaw = (formData.get("fallbackModels") as string) || "";
  const fallbackModels = fallbackModelsRaw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const clearCustomKey = formData.get("clearCustomKey") === "true";
  const newApiKey = (formData.get("apiKey") as string)?.trim();

  // Fetch current doc to preserve apiKey if not changed or cleared
  const aiDocRef = doc(db, "site", "ai");
  const snap = await getDoc(aiDocRef);
  const existingData = snap.exists() ? snap.data() : {};

  let finalApiKey: string = typeof existingData.apiKey === "string" ? existingData.apiKey : "";
  if (clearCustomKey) {
    finalApiKey = "";
  } else if (newApiKey && !newApiKey.includes("••••")) {
    finalApiKey = newApiKey;
  }

  const aiSettings = {
    apiKey: finalApiKey,
    primaryModel: effectivePrimaryModel,
    fallbackModels: fallbackModels.length > 0 ? fallbackModels : DEFAULT_FALLBACK_MODELS,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(aiDocRef, aiSettings);
  revalidatePath("/admin/ai");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateContactContent(formData: FormData) {
  await requireAuth();
  const contact = {
    location_en: (formData.get("location_en") as string) || "",
    email_en:    (formData.get("email_en")    as string) || "",
    tag_en:      (formData.get("tag_en")      as string) || "",
    title_en:    (formData.get("title_en")    as string) || "",
    subtitle_en: (formData.get("subtitle_en") as string) || "",
    name_en:     (formData.get("name_en")     as string) || "",
    emailPlaceholder_en: (formData.get("emailPlaceholder_en") as string) || "",
    subject_en:  (formData.get("subject_en")  as string) || "",
    message_en:  (formData.get("message_en")  as string) || "",
    send_en:     (formData.get("send_en")     as string) || "",
    sent_en:     (formData.get("sent_en")     as string) || "",
    sentSubtitle_en: (formData.get("sentSubtitle_en") as string) || "",
    sendAnother_en: (formData.get("sendAnother_en") as string) || "",
    
    location_ja: (formData.get("location_ja") as string) || "",
    email_ja:    (formData.get("email_ja")    as string) || "",
    tag_ja:      (formData.get("tag_ja")      as string) || "",
    title_ja:    (formData.get("title_ja")    as string) || "",
    subtitle_ja: (formData.get("subtitle_ja") as string) || "",
    name_ja:     (formData.get("name_ja")     as string) || "",
    emailPlaceholder_ja: (formData.get("emailPlaceholder_ja") as string) || "",
    subject_ja:  (formData.get("subject_ja")  as string) || "",
    message_ja:  (formData.get("message_ja")  as string) || "",
    send_ja:     (formData.get("send_ja")     as string) || "",
    sent_ja:     (formData.get("sent_ja")     as string) || "",
    sentSubtitle_ja: (formData.get("sentSubtitle_ja") as string) || "",
    sendAnother_ja: (formData.get("sendAnother_ja") as string) || "",
  };
  await setDoc(doc(db, "site", "contact"), contact);
  revalidatePath("/");
  revalidatePath("/contact");
  redirect("/admin/contact?saved=1");
}

// ─── POPUP ─────────────────────────────────────────────────────────────────

export async function updatePopupContent(formData: FormData) {
  await requireAuth();
  const imageFile = formData.get("image") as File | null;
  const uploadedImage = await uploadImage(imageFile);

  const popup = {
    enabled: formData.get("enabled") === "true",
    title_en: (formData.get("title_en") as string) || "",
    title_ja: (formData.get("title_ja") as string) || "",
    body_en: (formData.get("body_en") as string) || "",
    body_ja: (formData.get("body_ja") as string) || "",
    buttonLabel_en: (formData.get("buttonLabel_en") as string) || "",
    buttonLabel_ja: (formData.get("buttonLabel_ja") as string) || "",
    buttonUrl: (formData.get("buttonUrl") as string) || "",
    image: uploadedImage || (formData.get("existingImage") as string) || "",
  };

  await setDoc(doc(db, "site", "popup"), popup);
  revalidatePath("/");
  redirect("/admin/popup?saved=1");
}

// ─── SEO ───────────────────────────────────────────────────────────────────

export async function updateSeoContent(formData: FormData) {
  await requireAuth();
  const seo = {
    siteName_en: (formData.get("siteName_en") as string) || "",
    siteName_ja: (formData.get("siteName_ja") as string) || "",
    title_en: (formData.get("title_en") as string) || "",
    title_ja: (formData.get("title_ja") as string) || "",
    description_en: (formData.get("description_en") as string) || "",
    description_ja: (formData.get("description_ja") as string) || "",
    keywords_en: (formData.get("keywords_en") as string) || "",
    keywords_ja: (formData.get("keywords_ja") as string) || "",
  };

  await setDoc(doc(db, "site", "seo"), seo);
  revalidatePath("/", "layout");
  redirect("/admin/seo?saved=1");
}
