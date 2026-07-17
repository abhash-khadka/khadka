"use client";

import Link from "next/link";
import { PortfolioItem } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageModal from "@/components/ImageModal";

export default function PortfolioClient({ project }: { project: PortfolioItem }) {
  const { lang, t } = useLanguage();
  const title = (project[`title_${lang}` as keyof PortfolioItem] as string) || project.title_en;
  const overview = (project[`overview_${lang}` as keyof PortfolioItem] as string) || project.overview_en;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Sticky Sidebar with Clean Image and Title */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r overflow-hidden" style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}>
          
          {/* Title Section */}
          <div className="mb-8">
            <p className="font-semibold tracking-widest text-xs uppercase mb-3 flex items-center gap-2" style={{ color: "var(--color-accent)" }}>
              <span className="w-6 h-px inline-block" style={{ background: "var(--color-accent)" }}></span>
              {project.category}
            </p>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-snug" style={{ color: "var(--text-primary)" }}>
              {title}
            </h1>
          </div>

          {/* Clean Image Section (Frameless) */}
          <div className="w-full flex-1 min-h-[300px] lg:min-h-[400px] overflow-hidden relative mb-8 rounded-sm" style={{ background: "var(--bg-secondary)" }}>
            {project.image ? (
              <ImageModal src={project.image} alt={title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold opacity-30" style={{ color: "var(--text-secondary)" }}>{t.portfolioDetail.noImage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Scrollable Content */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 xl:p-24" style={{ background: "var(--bg-primary)" }}>
          
          {/* Action Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold transition-colors shadow-lg"
                  style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
                >
                  {t.portfolioDetail.visitLive}
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto border px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
                  style={{ background: "transparent", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                >
                  {t.portfolioDetail.viewSource}
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
            </div>
          )}

          {/* Rich Text Overview */}
          <div className="mb-16">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 flex items-center gap-3" style={{ color: "var(--text-secondary)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent)" }}></span>
              {t.portfolioDetail.projectOverview}
            </h2>
            <div
              className="prose prose-lg max-w-none leading-relaxed"
              style={{
                color: "var(--text-secondary)",
                "--tw-prose-body": "var(--text-secondary)",
                "--tw-prose-headings": "var(--text-primary)",
                "--tw-prose-links": "var(--color-accent)",
                "--tw-prose-bold": "var(--text-primary)",
                "--tw-prose-quotes": "var(--text-secondary)",
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: overview || "" }}
            />
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 flex items-center gap-3" style={{ color: "var(--text-secondary)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent)" }}></span>
              {t.portfolioDetail.technologiesUsed}
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="border px-4 py-2 text-sm font-medium rounded-lg shadow-sm"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="border rounded-2xl p-8 shadow-xl relative overflow-hidden mt-12" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            <div className="absolute top-0 right-0 p-6 opacity-5 transform rotate-12 scale-150" style={{ color: "var(--text-primary)" }}>
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
            </div>
            <h3 className="font-bold mb-3 text-xl relative z-10" style={{ color: "var(--text-primary)" }}>{t.portfolioDetail.wantSimilar}</h3>
            <p className="text-sm mb-8 leading-relaxed max-w-sm relative z-10" style={{ color: "var(--text-secondary)" }}>
              {t.portfolioDetail.wantSimilarDesc}
            </p>
            <Link href="/contact" className="relative z-10 inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors shadow-lg" style={{ background: "var(--color-accent)", color: "var(--bg-primary)" }}>
              {t.portfolioDetail.letsTalk}
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
