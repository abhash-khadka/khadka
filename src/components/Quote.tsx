"use client";

import { SiteData } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Quote({ data }: { data: SiteData['landing'] }) {
  const { images } = data;
  const { t } = useLanguage();

  return (
    <section id="philosophySection" className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={images?.quoteBg ? { backgroundImage: `url('${images.quoteBg}')` } : {}}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="font-medium tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4" style={{ color: "var(--color-accent)" }}>
          {t.quote.label}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight leading-snug sm:leading-tight" style={{ color: "var(--text-primary)" }}>
          {t.quote.text}
        </h2>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {t.quote.author}
        </p>
      </div>
    </section>
  );
}
