"use server";

import { revalidatePath } from "next/cache";
import { BlogPost, PortfolioItem } from "@/lib/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, storage } from "./firebase";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "000Nepal";
const SESSION_COOKIE = "admin_session";

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: false,
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

// ─── UTILS ────────────────────────────────────────────────────────────────────

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const storageRef = ref(storage, `images/${fileName}`);
  await uploadBytes(storageRef, bytes);
  return await getDownloadURL(storageRef);
}

function generateSlug(title: string, fallbackId: number): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")            // spaces to hyphens
    .replace(/-+/g, "-")             // collapse multiple hyphens
    .replace(/^-+|-+$/g, "")         // trim leading/trailing hyphens
    .substring(0, 80);               // max 80 chars
  // Always return a non-empty string — fall back to timestamp if title is empty/symbols-only
  return slug || fallbackId.toString();
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

export async function createBlogPost(formData: FormData) {
  const id = Date.now();
  const title_en = formData.get("title_en") as string;
  const slug = generateSlug(title_en, id);
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
  const title_en = formData.get("title_en") as string;
  const slug = generateSlug(title_en, id);
  const existingSlug = formData.get("existingSlug") as string;
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

  const oldDocId = existingSlug || id.toString();

  // If the document ID (slug or old numeric ID) changed, delete old and create new
  if (oldDocId !== slug) {
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
  await deleteDoc(doc(db, "blogs", slug || id.toString()));

  revalidatePath("/");
  revalidatePath("/blogs");
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────

export async function createPortfolioItem(formData: FormData) {
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
  await deleteDoc(doc(db, "portfolio", id.toString()));

  revalidatePath("/");
  revalidatePath("/portfolio");
}

// ─── LANDING ─────────────────────────────────────────────────────────────────

export async function updateLandingContent(formData: FormData) {
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
  const id = Date.now();
  const newMessage = {
    id,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
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
  await updateDoc(doc(db, "messages", id.toString()), { read: true });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number) {
  await deleteDoc(doc(db, "messages", id.toString()));
  revalidatePath("/admin/messages");
}

export async function markMessageReplied(id: number) {
  await updateDoc(doc(db, "messages", id.toString()), { replied: true, read: true });
  revalidatePath("/admin/messages");
}

// ─── THEME ───────────────────────────────────────────────────────────────────

export async function updateThemeColors(formData: FormData): Promise<{ success: boolean }> {
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

// ─── TRANSLATION (Google AI Studio) ────────────────────────────────────────

const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_API_KEY || "";
const GOOGLE_AI_STUDIO_MODEL = process.env.GOOGLE_AI_STUDIO_MODEL || "gemini-2.5-flash";
const FALLBACK_GOOGLE_AI_STUDIO_MODELS = process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS ? process.env.GOOGLE_AI_STUDIO_FALLBACK_MODELS.split(",") : ["gemini-2.0-flash-lite", "gemini-2.0-flash"];

function isQuotaOrRateLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /429|quota|rate limit|free tier|too many requests/i.test(message);
}

async function generateTranslationWithModel(apiKey: string, prompt: string, modelName: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return String(response.text()).trim();
}

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  if (!text) return "";
  if (!GOOGLE_AI_STUDIO_API_KEY) {
    console.error("GOOGLE_AI_STUDIO_API_KEY is not set.");
    return "Error: GOOGLE_AI_STUDIO_API_KEY is not set.";
  }
  try {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, without any additional explanation or formatting.

Text to translate:
"${text}"
`;

    const modelsToTry = [GOOGLE_AI_STUDIO_MODEL, ...FALLBACK_GOOGLE_AI_STUDIO_MODELS.filter((model) => model !== GOOGLE_AI_STUDIO_MODEL)];

    let lastError: unknown;
    for (const modelName of modelsToTry) {
      try {
        return await generateTranslationWithModel(GOOGLE_AI_STUDIO_API_KEY, prompt, modelName);
      } catch (error) {
        lastError = error;
        if (!isQuotaOrRateLimitError(error)) {
          throw error;
        }
      }
    }

    throw lastError ?? new Error("Translation failed");
  } catch (error) {
    console.error("Error translating text (Google AI Studio):", error);
    if (error instanceof Error) return `Error: Could not translate. ${error.message}`;
    return `Error: Could not translate.`;
  }
}

export async function updateContactContent(formData: FormData) {
  const contact = {
    location:    (formData.get("location")    as string) || "",
    email:       (formData.get("email")       as string) || "",
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
