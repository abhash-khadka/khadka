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
  location: string;
  email: string;
  tag_en: string;
  title_en: string;
  subtitle_en: string;
  tag_ja: string;
  title_ja: string;
  subtitle_ja: string;
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
  location: "Hiroshima, Japan",
  email: "info.abhashk@gmail.com",
  tag_en: "Get in touch",
  title_en: "Let's Connect",
  subtitle_en: "Open to internships, freelance work, and collaboration on interesting projects. Have an idea? Let's build it together.",
  tag_ja: "お気軽にどうぞ",
  title_ja: "ご連絡ください",
  subtitle_ja: "インターンシップ、フリーランス、プロジェクトのコラボレーションを受け付けています。アイデアがあればぜひ一緒に作りましょう。",
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

    // Parse Contact
    if (contactDoc.exists()) {
      data.contact = { ...defaultContact, ...contactDoc.data() } as ContactContent;
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
