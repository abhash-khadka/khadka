"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t" style={{ background: "var(--bg-footer)", borderColor: "var(--border-color)" }}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src="/logo.png" alt="Abhash Logo" className="h-6 w-auto object-contain" />
          <span className="text-lg font-bold tracking-widest" style={{ color: "var(--text-primary)" }}>
            ABHASH
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          &copy; {currentYear} ABHASH. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
