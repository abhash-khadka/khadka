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
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const title = project[`title_${lang}`];
              return (
                <Link href={`/portfolio/${project.id}`} key={project.id} className="group relative overflow-hidden rounded-md cursor-pointer block" style={{ background: "var(--bg-card)" }}>
                  <div 
                    className="h-[200px] md:h-[300px] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100 flex items-center justify-center"
                    style={project.image ? { backgroundImage: `url(${project.image})` } : {}}
                  >
                    {!project.image && <span className="text-xl font-bold" style={{ color: "var(--border-color)" }}>PORTFOLIO</span>}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 md:p-6">
                      <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-accent)" }}>{project.category}</p>
                      <h3 className="text-sm md:text-xl font-bold text-white">{title}</h3>
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
