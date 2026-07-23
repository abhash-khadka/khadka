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
    <main className="pt-32 pb-24 px-6 min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <Link href="/portfolio" className="text-sm font-medium transition-colors flex items-center mb-10" style={{ color: "var(--color-accent)" }}>
          <span className="mr-2">←</span> {lang === "ja" ? "作品一覧に戻る" : "Back to portfolio"}
        </Link>
        
        <p className="font-semibold tracking-widest text-xs uppercase mb-4" style={{ color: "var(--color-accent)" }}>
          {project.category}
        </p>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        
        <div className="mb-12 w-full">
          {project.image ? (
            <ImageModal src={project.image} alt={title} />
          ) : (
            <div className="h-[300px] w-full rounded-sm flex items-center justify-center border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <span className="text-4xl font-bold opacity-30" style={{ color: "var(--text-secondary)" }}>{t.portfolioDetail.noImage}</span>
            </div>
          )}
        </div>
        
        {/* Action Links */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-colors shadow-lg"
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
                className="flex items-center justify-center gap-2 border px-8 py-3.5 rounded-full text-sm font-bold transition-colors"
                style={{ background: "transparent", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                {t.portfolioDetail.viewSource}
                <span className="text-lg leading-none">↗</span>
              </a>
            )}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none leading-relaxed mb-12"
          style={{ 
            color: "var(--text-secondary)",
            "--tw-prose-body": "var(--text-secondary)",
            "--tw-prose-headings": "var(--text-primary)",
            "--tw-prose-links": "var(--color-accent)",
            "--tw-prose-bold": "var(--text-primary)",
            "--tw-prose-quotes": "var(--text-secondary)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-code": "var(--color-accent)",
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: overview || "" }}
        />

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
    </main>
  );
}
