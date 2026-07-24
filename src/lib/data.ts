import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { cache } from "react";

export type ThemeColors = {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgNav: string;
  bgFooter: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
};

export type HeroContent = {
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
};

export type AboutContent = {
  tag: string;
  title: string;
  bio1: string;
  bio2: string;
  bio3: string;
  gpa: string;
  projects: string;
  certs: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  date: string;
  image: string;
  published: boolean;
  
  // Translated fields
  title_en: string;
  title_ja: string;
  excerpt_en: string;
  excerpt_ja: string;
  content_en: string;
  content_ja: string;
};

export type PortfolioItem = {
  id: number;
  category: string;
  technologies: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;

  // Translated fields
  title_en: string;
  title_ja: string;
  overview_en: string;
  overview_ja: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replied: boolean;
};

export type LandingLanguageContent = {
  hero: HeroContent;
  about: AboutContent;
};

export type ContactContent = {
  location_en: string;
  email_en: string;
  tag_en: string;
  title_en: string;
  subtitle_en: string;
  name_en: string;
  emailPlaceholder_en: string;
  subject_en: string;
  message_en: string;
  send_en: string;
  sent_en: string;
  sentSubtitle_en: string;
  sendAnother_en: string;
  
  location_ja: string;
  email_ja: string;
  tag_ja: string;
  title_ja: string;
  subtitle_ja: string;
  name_ja: string;
  emailPlaceholder_ja: string;
  subject_ja: string;
  message_ja: string;
  send_ja: string;
  sent_ja: string;
  sentSubtitle_ja: string;
  sendAnother_ja: string;
};

export type SiteData = {
  landing: {
    en: LandingLanguageContent;
    ja: LandingLanguageContent;
    images: {
      heroBg: string;
      aboutImg: string;
      quoteBg: string;
    };
  };
  contact: ContactContent;
  blogs: BlogPost[];
  portfolio: PortfolioItem[];
  theme: ThemeColors;
  lightTheme: ThemeColors;
};

export const defaultTheme: ThemeColors = {
  bgPrimary: "#050505",
  bgSecondary: "#0a0a0a",
  bgCard: "#111111",
  bgNav: "#000000",
  bgFooter: "#000000",
  accent: "#d9a05b",
  textPrimary: "#ffffff",
  textSecondary: "#9ca3af",
  borderColor: "#1f2937",
};

export const defaultLightTheme: ThemeColors = {
  bgPrimary: "#FAFAF9",
  bgSecondary: "#F5F5F4",
  bgCard: "#FFFFFF",
  bgNav: "#FFFFFF",
  bgFooter: "#F8F8F8",
  accent: "#D9A05B",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  borderColor: "#E5E7EB",
};

export const defaultContact: ContactContent = {
  location_en: "Hiroshima, Japan",
  email_en: "info.abhashk@gmail.com",
  tag_en: "Get in touch",
  title_en: "Let's Connect",
  subtitle_en: "Open to internships, freelance work, and collaboration on interesting projects. Have an idea? Let's build it together.",
  name_en: "Your Name",
  emailPlaceholder_en: "Your Email",
  subject_en: "Subject",
  message_en: "Your Message",
  send_en: "Send Message →",
  sent_en: "Message Sent!",
  sentSubtitle_en: "Thanks for reaching out. I'll get back to you as soon as possible.",
  sendAnother_en: "← Send another message",
  
  location_ja: "広島県、日本",
  email_ja: "info.abhashk@gmail.com",
  tag_ja: "お気軽にどうぞ",
  title_ja: "ご連絡ください",
  subtitle_ja: "インターンシップ、フリーランス、プロジェクトのコラボレーションを受け付けています。アイデアがあればぜひ一緒に作りましょう。",
  name_ja: "お名前",
  emailPlaceholder_ja: "メールアドレス",
  subject_ja: "件名",
  message_ja: "メッセージ",
  send_ja: "送信する →",
  sent_ja: "送信しました！",
  sentSubtitle_ja: "ご連絡ありがとうございます。できるだけ早くご返信します。",
  sendAnother_ja: "← 別のメッセージを送る",
};

const defaultLanguageContent: LandingLanguageContent = {
  hero: { tagline: "", title: "", subtitle: "", ctaText: "" },
  about: { tag: "", title: "", bio1: "", bio2: "", bio3: "", gpa: "", projects: "", certs: "" }
};

const defaultLanding = {
  en: defaultLanguageContent,
  ja: defaultLanguageContent,
  images: {
    heroBg: "",
    aboutImg: "",
    quoteBg: "",
  }
};

export const getData = cache(async (): Promise<SiteData> => {
  const data: SiteData = {
    landing: defaultLanding,
    contact: defaultContact,
    blogs: [],
    portfolio: [],
    theme: defaultTheme,
    lightTheme: defaultLightTheme,
  };

  try {
    const [
      landingDoc,
      blogsSnapshot,
      portfolioSnapshot,
      contactDoc,
      themeDoc
    ] = await Promise.all([
      getDoc(doc(db, "site", "landing")),
      getDocs(collection(db, "blogs")),
      getDocs(collection(db, "portfolio")),
      getDoc(doc(db, "site", "contact")),
      getDoc(doc(db, "site", "theme"))
    ]);

    // Parse Landing
    if (landingDoc.exists()) {
      const dbData = landingDoc.data();
      if (!dbData.en && dbData.hero) {
        data.landing = {
          en: { hero: dbData.hero, about: dbData.about },
          ja: { hero: dbData.hero, about: dbData.about },
          images: dbData.images || defaultLanding.images,
        };
      } else {
        data.landing = dbData as SiteData["landing"];
      }
    }

    // Parse Blogs
    blogsSnapshot.forEach((doc) => {
      const p = doc.data();
      if (p.title && !p.title_en) {
        p.title_en = p.title; p.title_ja = p.title;
        p.excerpt_en = p.excerpt; p.excerpt_ja = p.excerpt;
        p.content_en = p.content; p.content_ja = p.content;
      }
      data.blogs.push(p as BlogPost);
    });

    // Parse Portfolio
    portfolioSnapshot.forEach((doc) => {
      const p = doc.data();
      if (p.title && !p.title_en) {
        p.title_en = p.title; p.title_ja = p.title;
        p.overview_en = p.overview; p.overview_ja = p.overview;
      }
      data.portfolio.push(p as PortfolioItem);
    });

    if (contactDoc.exists()) {
      const raw = contactDoc.data() as Record<string, string>;
      // Backward-compat: if old single-language fields exist, carry them over
      if (raw.location && !raw.location_en) raw.location_en = raw.location;
      if (raw.location && !raw.location_ja) raw.location_ja = raw.location;
      if (raw.email && !raw.email_en) raw.email_en = raw.email;
      if (raw.email && !raw.email_ja) raw.email_ja = raw.email;
      data.contact = { ...defaultContact, ...raw } as ContactContent;
    }

    // Parse Theme
    if (themeDoc.exists()) {
      const dbTheme = themeDoc.data();
      if (dbTheme.dark && dbTheme.light) {
        data.theme = { ...defaultTheme, ...dbTheme.dark } as ThemeColors;
        data.lightTheme = { ...defaultLightTheme, ...dbTheme.light } as ThemeColors;
      } else {
        data.theme = { ...defaultTheme, ...dbTheme } as ThemeColors;
      }
    }

    // Sort arrays by id (timestamp) descending
    data.blogs.sort((a, b) => b.id - a.id);
    data.portfolio.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
  }

  return data;
});

export const getMessages = cache(async (): Promise<Message[]> => {
  const messages: Message[] = [];
  try {
    const messagesSnapshot = await getDocs(collection(db, "messages"));
    messagesSnapshot.forEach((doc) => {
      messages.push(doc.data() as Message);
    });
    messages.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching messages from Firestore:", error);
  }
  return messages;
});
