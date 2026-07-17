"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import { BlogPost } from "@/lib/data";
import TranslateButton from "@/components/TranslateButton";
import { translateText } from "@/lib/actions";

type ActionType = (formData: FormData) => void;

export default function BlogForm({ 
  post, 
  action, 
  isEdit = false 
}: { 
  post?: BlogPost; 
  action: any; // Using any for Server Action passing
  isEdit?: boolean;
}) {
  const [tab, setTab] = useState<"en" | "ja">("en");

  const [title_en, setTitleEn] = useState(post?.title_en || "");
  const [title_ja, setTitleJa] = useState(post?.title_ja || "");
  const [excerpt_en, setExcerptEn] = useState(post?.excerpt_en || "");
  const [excerpt_ja, setExcerptJa] = useState(post?.excerpt_ja || "");
  const [content_en, setContentEn] = useState(post?.content_en || "");
  const [content_ja, setContentJa] = useState(post?.content_ja || "");
  const [date, setDate] = useState(post?.date || "");
  const [imageUrl, setImageUrl] = useState("");
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const handleTranslateAllToJa = async () => {
    setIsTranslatingAll(true);
    try {
      if (title_en && !title_ja) setTitleJa(await translateText(title_en, "English", "Japanese"));
      if (excerpt_en && !excerpt_ja) setExcerptJa(await translateText(excerpt_en, "English", "Japanese"));
      if (content_en && !content_ja) setContentJa(await translateText(content_en, "English", "Japanese"));
      setTab("ja");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleTranslateAllToEn = async () => {
    setIsTranslatingAll(true);
    try {
      if (title_ja && !title_en) setTitleEn(await translateText(title_ja, "Japanese", "English"));
      if (excerpt_ja && !excerpt_en) setExcerptEn(await translateText(excerpt_ja, "Japanese", "English"));
      if (content_ja && !content_en) setContentEn(await translateText(content_ja, "Japanese", "English"));
      setTab("en");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  useEffect(() => {
    if (post) {
      setTitleEn(post.title_en);
      setTitleJa(post.title_ja);
      setExcerptEn(post.excerpt_en);
      setExcerptJa(post.excerpt_ja);
      setContentEn(post.content_en);
      setContentJa(post.content_ja);
      setDate(post.date);
    }
  }, [post]);

  const renderLanguageSection = (lang: "en" | "ja") => {
    const isVisible = tab === lang;
    
    if (lang === "en") {
      return (
        <div className={isVisible ? "block space-y-6" : "hidden"} key={lang}>
          <div className="flex items-end gap-4">
            <Field label="Title (EN)" name="title_en_display" value={title_en} onChange={(e) => setTitleEn(e.target.value)} placeholder="Your post title..." />
            <TranslateButton text={title_en} sourceLanguage="English" targetLanguage="Japanese" onTranslated={setTitleJa} />
          </div>
          <div className="flex items-end gap-4">
            <Field label="Excerpt (EN)" name="excerpt_en_display" value={excerpt_en} onChange={(e) => setExcerptEn(e.target.value)} placeholder="A short description..." textarea rows={3} />
            <TranslateButton text={excerpt_en} sourceLanguage="English" targetLanguage="Japanese" onTranslated={setExcerptJa} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase">Content (EN)</label>
              <TranslateButton text={content_en} sourceLanguage="English" targetLanguage="Japanese" onTranslated={setContentJa} />
            </div>
            <RichTextEditor name="content_en_display" value={content_en} onChange={setContentEn} placeholder="Write the full blog post content here..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={isVisible ? "block space-y-6" : "hidden"} key={lang}>
          <div className="flex items-end gap-4">
            <Field label="Title (JA)" name="title_ja_display" value={title_ja} onChange={(e) => setTitleJa(e.target.value)} placeholder="記事のタイトル..." />
            <TranslateButton text={title_ja} sourceLanguage="Japanese" targetLanguage="English" onTranslated={setTitleEn} />
          </div>
          <div className="flex items-end gap-4">
            <Field label="Excerpt (JA)" name="excerpt_ja_display" value={excerpt_ja} onChange={(e) => setExcerptJa(e.target.value)} placeholder="簡単な説明..." textarea rows={3} />
            <TranslateButton text={excerpt_ja} sourceLanguage="Japanese" targetLanguage="English" onTranslated={setExcerptEn} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase">Content (JA)</label>
              <TranslateButton text={content_ja} sourceLanguage="Japanese" targetLanguage="English" onTranslated={setContentEn} />
            </div>
            <RichTextEditor name="content_ja_display" value={content_ja} onChange={setContentJa} placeholder="ブログの全文をここに書いてください..." />
          </div>
        </div>
      );
    }
  };

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="title_en" value={title_en} />
      <input type="hidden" name="title_ja" value={title_ja} />
      <input type="hidden" name="excerpt_en" value={excerpt_en} />
      <input type="hidden" name="excerpt_ja" value={excerpt_ja} />
      <input type="hidden" name="content_en" value={content_en} />
      <input type="hidden" name="content_ja" value={content_ja} />
      
      {/* Language Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 mb-6">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("en")}
            className={`px-6 py-3 font-semibold tracking-widest text-sm transition-colors ${
              tab === "en" ? "border-b-2 border-[#c9a84c] text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            ENGLISH
          </button>
          <button
            type="button"
            onClick={() => setTab("ja")}
            className={`px-6 py-3 font-semibold tracking-widest text-sm transition-colors ${
              tab === "ja" ? "border-b-2 border-[#c9a84c] text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            JAPANESE (日本語)
          </button>
        </div>
        
        {tab === "en" && (
          <button
            type="button"
            onClick={handleTranslateAllToJa}
            disabled={isTranslatingAll || (!title_en && !excerpt_en && !content_en)}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600 mb-2"
          >
            {isTranslatingAll ? "Translating..." : "Auto-Translate to Japanese"}
          </button>
        )}
        {tab === "ja" && (
          <button
            type="button"
            onClick={handleTranslateAllToEn}
            disabled={isTranslatingAll || (!title_ja && !excerpt_ja && !content_ja)}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600 mb-2"
          >
            {isTranslatingAll ? "Translating..." : "Auto-Translate to English"}
          </button>
        )}
      </div>

      {renderLanguageSection("en")}
      {renderLanguageSection("ja")}

      {/* Shared Fields */}
      <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-6">
        <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-2">
          <span className="text-[#c9a84c]">⬤</span> Shared Settings
        </h2>
        
        {isEdit && <input type="hidden" name="existingSlug" value={post?.slug || ""} />}
        {isEdit && <input type="hidden" name="existingImage" value={post?.image || ""} />}
        
        {isEdit && <Field label="Date (Optional Override)" name="date" value={date} onChange={(e) => setDate(e.target.value)} />}

        <div className="space-y-3">
          <Field label="Cover Image (Leave empty to keep existing)" name="image" type="file" />
          <Field label="Or Provide Cover Image URL" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Status</label>
          <select
            name="published"
            defaultValue={post ? (post.published ? "true" : "false") : "true"}
            className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm"
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </section>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
        >
          {isEdit ? "Save Changes" : "Publish Post"}
        </button>
        <Link
          href="/admin/blogs"
          className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label, name, value, placeholder, textarea = false, rows = 4, type = "text", onChange
}: {
  label: string; name: string; value?: string; placeholder?: string; textarea?: boolean; rows?: number; type?: "text" | "file"; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="flex-grow">
      <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={type === "file" ? undefined : value}
          placeholder={placeholder}
          onChange={onChange}
          accept={type === "file" ? "image/*" : undefined}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#111] file:text-gray-300 hover:file:bg-[#222] file:cursor-pointer"
        />
      )}
    </div>
  );
}
