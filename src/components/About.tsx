"use client";

import { SiteData } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About({ data }: { data: SiteData['landing'] }) {
  const { lang, t } = useLanguage();
  const content = data[lang];
  const { about } = content;
  const { images } = data;

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="container mx-auto max-w-7xl">
        {/* Title Section Moved to Top */}
        <div className="mb-10 sm:mb-14 md:mb-16 text-center lg:text-left">
          <p className="font-medium tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4" style={{ color: "var(--color-accent)" }}>
            {about.tag}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight" style={{ color: "var(--text-primary)" }}>
            {about.title}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          {/* Left side Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[250px] md:h-[500px] w-full rounded-sm overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={images?.aboutImg ? { backgroundImage: `url('${images.aboutImg}')` } : {}}
              />
            </div>
          </div>
          
          {/* Right side Content */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-[15px] leading-relaxed mb-8 md:mb-12" style={{ color: "var(--text-secondary)" }}>
              <p>{about.bio1}</p>
              <p>{about.bio2}</p>
              <p>{about.bio3}</p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 border-t pt-6 md:pt-8" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2" style={{ color: "var(--color-accent)" }}>{about.gpa}</p>
                <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase truncate" style={{ color: "var(--text-secondary)" }}>{t.about.gpa}</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2" style={{ color: "var(--color-accent)" }}>{about.projects}</p>
                <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase truncate" style={{ color: "var(--text-secondary)" }}>{t.about.projects}</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2" style={{ color: "var(--color-accent)" }}>{about.certs}</p>
                <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase truncate" style={{ color: "var(--text-secondary)" }}>{t.about.certs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
