"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ja";

export const translations = {
  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      about: "About",
      blogs: "Blogs",
      contact: "Contact",
    },
    hero: {
      cta: "View My Work",
    },
    portfolio: {
      tag: "Code. Build. Deploy. Repeat.",
      title: "Portfolio Items",
      noProjects: "No projects found in this category yet.",
      categories: {
        all: "All",
        web: "Web",
        mobile: "Mobile",
        design: "Design",
        ai: "AI",
      }
    },
    blog: {
      tag: "Bytes & Thoughts",
      title: "Blog Posts",
      read: "Read Article",
    },
    contact: {
      tag: "Get in touch",
      title: "Let's Connect",
      subtitle: "Open to internships, freelance work, and collaboration on interesting projects. Have an idea? Let's build it together.",
      location: "Location",
      email: "Email",
      name: "Your Name",
      emailPlaceholder: "Your Email",
      subject: "Subject",
      message: "Your Message",
      send: "Send Message →",
      sent: "Message Sent!",
      sentSubtitle: "Thanks for reaching out. I'll get back to you as soon as possible.",
      sendAnother: "← Send another message",
    },
    about: {
      gpa: "GPA",
      projects: "Projects",
      certs: "Certs",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      portfolio: "ポートフォリオ",
      about: "について",
      blogs: "ブログ",
      contact: "お問い合わせ",
    },
    hero: {
      cta: "作品を見る",
    },
    portfolio: {
      tag: "コード。構築。デプロイ。繰り返す。",
      title: "作品集",
      noProjects: "このカテゴリのプロジェクトはまだありません。",
      categories: {
        all: "すべて",
        web: "ウェブ",
        mobile: "モバイル",
        design: "デザイン",
        ai: "AI",
      }
    },
    blog: {
      tag: "技術と思考",
      title: "ブログ記事",
      read: "記事を読む",
    },
    contact: {
      tag: "お気軽にどうぞ",
      title: "ご連絡ください",
      subtitle: "インターンシップ、フリーランス、プロジェクトのコラボレーションを受け付けています。アイデアがあればぜひ一緒に作りましょう。",
      location: "所在地",
      email: "メール",
      name: "お名前",
      emailPlaceholder: "メールアドレス",
      subject: "件名",
      message: "メッセージ",
      send: "送信する →",
      sent: "送信しました！",
      sentSubtitle: "ご連絡ありがとうございます。できるだけ早くご返信します。",
      sendAnother: "← 別のメッセージを送る",
    },
    about: {
      gpa: "成績",
      projects: "プロジェクト",
      certs: "資格",
    },
    footer: {
      rights: "全著作権所有。",
    },
  },
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved === "en" || saved === "ja") setLangState(saved);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
