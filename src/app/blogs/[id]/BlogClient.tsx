"use client";

import Link from "next/link";
import { BlogPost } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogClient({ post }: { post: BlogPost }) {
  const { lang } = useLanguage();
  const title = post[`title_${lang}` as keyof BlogPost] as string || post.title_en;
  const content = post[`content_${lang}` as keyof BlogPost] as string || post.content_en;

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto max-w-4xl">
        <Link href="/blogs" className="text-accent text-sm font-medium hover:text-white transition-colors flex items-center mb-10">
          <span className="mr-2">←</span> Back to all posts
        </Link>
        
        <p className="text-accent font-semibold tracking-widest text-xs uppercase mb-4">
          {post.date}
        </p>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-10">
          {title}
        </h1>
        
        <div className="h-[400px] md:h-[500px] w-full rounded-sm overflow-hidden mb-12 bg-gray-900 flex items-center justify-center">
          {post.image ? (
            <img 
              src={post.image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-700 text-4xl font-bold">No Image</span>
          )}
        </div>
        
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-a:text-[#c9a84c] prose-strong:text-white prose-code:text-[#c9a84c] prose-blockquote:border-l-[#c9a84c] prose-blockquote:text-gray-400"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </main>
  );
}
