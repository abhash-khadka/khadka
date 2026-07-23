"use client";

import Link from "next/link";
import { BlogPost } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Blog({ posts }: { posts: BlogPost[] }) {
  const { lang, t } = useLanguage();

  return (
    <section id="blogs" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <p className="font-medium tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4" style={{ color: "var(--color-accent)" }}>
            {t.blog.tag}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {t.blog.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {posts.map((post) => {
            const title = post[`title_${lang}` as keyof BlogPost] as string || post.title_en;
            const excerpt = post[`excerpt_${lang}` as keyof BlogPost] as string || post.excerpt_en;

            return (
              <Link href={`/blogs/${post.slug || post.id}`} key={post.id} className="rounded-sm overflow-hidden group flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-300 h-full" style={{ background: "var(--bg-card)" }}>
                <div className="h-32 md:h-48 overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: "var(--border-color)" }}>BLOG</span>
                  )}
                </div>
                <div className="p-4 md:p-8 flex flex-col flex-grow">
                  <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-2 md:mb-3" style={{ color: "var(--color-accent)" }}>
                    {post.date}
                  </p>
                  <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-4 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                    {excerpt}
                  </p>
                  <div className="flex items-center text-xs md:text-sm font-medium group-hover:opacity-70 transition-colors mt-auto" style={{ color: "var(--color-accent)" }}>
                    <span>{t.blog.read}</span> <span className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
