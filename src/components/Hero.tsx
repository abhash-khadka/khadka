"use client";

import { SiteData } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero({ data }: { data: SiteData['landing'] }) {
  const { lang, t } = useLanguage();
  const content = data[lang];
  const { hero } = content;
  const { images } = data;

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center pt-20" style={{ background: "var(--bg-primary)" }}>
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={images?.heroBg ? { backgroundImage: `url('${images.heroBg}')` } : {}}
      />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <p className="font-medium tracking-[4px] sm:tracking-[6px] text-[10px] sm:text-xs md:text-sm mb-4 sm:mb-6 uppercase" style={{ color: "var(--color-accent)" }}>
          {hero.tagline}
        </p>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-4 sm:mb-6 drop-shadow-lg" style={{ color: "var(--text-primary)" }}>
          {hero.title}
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl font-light max-w-lg sm:max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {hero.subtitle}
        </p>
        
        <a 
          href="#portfolio"
          className="inline-block border px-8 sm:px-10 py-3.5 sm:py-4 text-[10px] sm:text-xs font-semibold tracking-[2px] sm:tracking-[3px] hover:opacity-80 transition-all duration-500 uppercase"
          style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
        >
          {t.hero.cta}
        </a>
      </div>
    </section>
  );
}
