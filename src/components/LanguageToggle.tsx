"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ja" : "en")}
      className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest transition-opacity duration-300 hover:opacity-70"
      style={{ color: "var(--text-primary)" }}
      aria-label="Toggle language"
      title={lang === "en" ? "Switch to Japanese" : "Switch to English"}
    >
      <span className={`transition-opacity duration-300 ${lang === "en" ? "opacity-100" : "opacity-40"}`}>EN</span>
      <span className="opacity-20">/</span>
      <span className={`transition-opacity duration-300 ${lang === "ja" ? "opacity-100" : "opacity-40"}`}>JA</span>
    </button>
  );
}
