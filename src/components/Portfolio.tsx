"use client";

import Link from "next/link";
import { useState } from "react";
import { PortfolioItem } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Portfolio({ projects }: { projects: PortfolioItem[] }) {
  const [filter, setFilter] = useState("all");
  const { lang, t } = useLanguage();

  const categories = Object.entries(t.portfolio.categories).map(([key, label]) => ({ key, label }));

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === filter);

  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-24 lg:py-32 px-3 sm:px-6 lg:px-8" style={{ background: "var(--bg-primary)" }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <p className="font-medium tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4" style={{ color: "var(--color-accent)" }}>
            {t.portfolio.tag}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {t.portfolio.title}
          </h2>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-14 text-xs sm:text-sm tracking-wide">
          {categories.map((category) => (
            <button 
              key={category.key}
              onClick={() => setFilter(category.key)}
              className="pb-1 border-b transition-colors"
              style={filter === category.key
                ? { color: "var(--color-accent)", borderColor: "var(--color-accent)" }
                : { color: "var(--text-secondary)", borderColor: "transparent" }
              }
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const title = project[`title_${lang}` as keyof PortfolioItem] as string || project.title_en;
              // strip HTML for excerpt preview
              const rawOverview = project[`overview_${lang}` as keyof PortfolioItem] as string || project.overview_en || "";
              const excerpt = rawOverview.replace(/<[^>]*>?/gm, '');

              return (
                <Link href={`/portfolio/${project.id}`} key={project.id} className="rounded-sm overflow-hidden group flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-300 h-full" style={{ background: "var(--bg-card)" }}>
                  <div className="h-32 md:h-48 overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: "var(--border-color)" }}>PORTFOLIO</span>
                    )}
                  </div>
                  <div className="p-4 md:p-8 flex flex-col flex-grow">
                    <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-2 md:mb-3" style={{ color: "var(--color-accent)" }}>
                      {project.category}
                    </p>
                    <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-4 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                      {excerpt}
                    </p>
                    <div className="flex items-center text-xs md:text-sm font-medium group-hover:opacity-70 transition-colors mt-auto" style={{ color: "var(--color-accent)" }}>
                      <span>{lang === "ja" ? "詳細を見る" : "View Details"}</span> <span className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12" style={{ color: "var(--text-secondary)" }}>
              {t.portfolio.noProjects}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
