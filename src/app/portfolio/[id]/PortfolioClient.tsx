"use client";

import Link from "next/link";
import { PortfolioItem } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageModal from "@/components/ImageModal";

export default function PortfolioClient({ project }: { project: PortfolioItem }) {
  const { lang } = useLanguage();
  const title = (project[`title_${lang}` as keyof PortfolioItem] as string) || project.title_en;
  const overview = (project[`overview_${lang}` as keyof PortfolioItem] as string) || project.overview_en;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Sticky Sidebar with Clean Image and Title */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-gray-800 bg-[#0a0a0a] overflow-hidden">
          
          {/* Title Section */}
          <div className="mb-8">
            <p className="text-[#c9a84c] font-semibold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-[#c9a84c] inline-block"></span>
              {project.category}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {title}
            </h1>
          </div>

          {/* Clean Image Section (Frameless) */}
          <div className="w-full flex-1 min-h-[300px] lg:min-h-[400px] overflow-hidden relative mb-8">
            {project.image ? (
              <ImageModal src={project.image} alt={title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-800 text-3xl font-bold opacity-30">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Scrollable Content */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 xl:p-24 bg-[#0a0a0a]">
          
          {/* Action Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                >
                  Visit Live Site
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#111] border border-gray-800 text-white px-8 py-3.5 rounded-full text-sm font-bold hover:border-gray-600 hover:bg-white/5 transition-colors"
                >
                  View Source Code
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
            </div>
          )}

          {/* Rich Text Overview */}
          <div className="mb-16">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c]"></span>
              Project Overview
            </h2>
            <div
              className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-[#c9a84c] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-img:rounded-xl prose-img:border prose-img:border-gray-800"
              dangerouslySetInnerHTML={{ __html: overview || "" }}
            />
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c]"></span>
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="bg-[#111] border border-gray-800 text-gray-300 px-4 py-2 text-sm font-medium rounded-lg shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-gray-800/80 rounded-2xl p-8 shadow-xl relative overflow-hidden mt-12">
            <div className="absolute top-0 right-0 p-6 opacity-5 transform rotate-12 scale-150">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
            </div>
            <h3 className="text-white font-bold mb-3 text-xl relative z-10">Want a similar project?</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm relative z-10">
              I'm currently available for freelance work and would love to help you build your next big idea.
            </p>
            <Link href="/contact" className="relative z-10 inline-flex items-center gap-3 text-[#0a0a0a] bg-[#c9a84c] hover:bg-[#d6b75e] px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors shadow-lg shadow-[#c9a84c]/20">
              Let's Talk
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
