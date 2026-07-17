"use client";

import Link from "next/link";
import { BlogPost } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogClient({ post }: { post: BlogPost }) {
  const { lang } = useLanguage();
  const title = post[`title_${lang}` as keyof BlogPost] as string || post.title_en;
  const content = post[`content_${lang}` as keyof BlogPost] as string || post.content_en;

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <Link href="/blogs" className="text-sm font-medium transition-colors flex items-center mb-10" style={{ color: "var(--color-accent)" }}>
          <span className="mr-2">←</span> Back to all posts
        </Link>
        
        <p className="font-semibold tracking-widest text-xs uppercase mb-4" style={{ color: "var(--color-accent)" }}>
          {post.date}
        </p>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        
        <div className="h-[400px] md:h-[500px] w-full rounded-sm overflow-hidden mb-12 flex items-center justify-center border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
          {post.image ? (
            <img 
              src={post.image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold opacity-30" style={{ color: "var(--text-secondary)" }}>No Image</span>
          )}
        </div>
        
        <div
          className="prose prose-lg max-w-none leading-relaxed"
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
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </main>
  );
}
