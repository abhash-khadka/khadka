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
    portfolioDetail: {
      visitLive: "Visit Live Site",
      viewSource: "View Source Code",
      projectOverview: "Project Overview",
      technologiesUsed: "Technologies Used",
      wantSimilar: "Want a similar project?",
      wantSimilarDesc: "I'm currently available for freelance work and would love to help you build your next big idea.",
      letsTalk: "Let's Talk",
      noImage: "No Image",
    },
    blogDetail: {
      backToPosts: "Back to all posts",
      noImage: "No Image",
    },
    quote: {
      label: "My Philosophy",
      text: '"First, solve the problem. Then, write the code."',
      author: "— John Johnson",
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
    portfolioDetail: {
      visitLive: "ライブサイトを見る",
      viewSource: "ソースコードを見る",
      projectOverview: "プロジェクト概要",
      technologiesUsed: "使用技術",
      wantSimilar: "同様のプロジェクトを希望しますか？",
      wantSimilarDesc: "現在フリーランスの仕事を受け付けており、あなたの次の大きなアイデアを実現するお手伝いをしたいと思っています。",
      letsTalk: "話しましょう",
      noImage: "画像なし",
    },
    blogDetail: {
      backToPosts: "記事一覧に戻る",
      noImage: "画像なし",
    },
    quote: {
      label: "私の哲学",
      text: "「まず問題を解決する。そのあとでコードを書く。」",
      author: "— ジョン・ジョンソン",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved === "en" || saved === "ja") setLangState(saved);
    setMounted(true);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  // Use "en" translations during SSR to avoid hydration mismatch.
  // After mount the real stored language kicks in.
  const t = mounted ? translations[lang] : translations.en;

  return (
    <LanguageContext.Provider value={{ lang: mounted ? lang : "en", setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
