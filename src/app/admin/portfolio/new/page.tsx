"use client";

import { createPortfolioItem } from "@/lib/actions";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import { useState } from "react";
import TranslateButton from "@/components/TranslateButton";

const categories = ["Web", "Mobile", "Design", "AI"];

type Lang = "en" | "ja";

export default function NewPortfolioItemPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [title_en, setTitleEn] = useState("");
  const [title_ja, setTitleJa] = useState("");
  const [overview_en, setOverviewEn] = useState("");
  const [overview_ja, setOverviewJa] = useState("");

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/portfolio" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-white">New Portfolio Item</h1>
      </div>

      {/* Language Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`px-4 py-2 text-sm font-semibold rounded-sm transition-colors ${
            lang === "en" ? "bg-[#c9a84c] text-black" : "bg-[#1c1c1c] text-gray-400 hover:bg-[#2a2a2a]"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLang("ja")}
          className={`px-4 py-2 text-sm font-semibold rounded-sm transition-colors ${
            lang === "ja" ? "bg-[#c9a84c] text-black" : "bg-[#1c1c1c] text-gray-400 hover:bg-[#2a2a2a]"
          }`}
        >
          Japanese
        </button>
      </div>

      <form action={createPortfolioItem} className="space-y-6">
        <input type="hidden" name="title_en" value={title_en} />
        <input type="hidden" name="title_ja" value={title_ja} />
        <input type="hidden" name="overview_en" value={overview_en} />
        <input type="hidden" name="overview_ja" value={overview_ja} />

        {lang === "en" && (
          <div className="space-y-6">
            <div className="flex items-end gap-4">
              <Field
                label="Project Title (EN)"
                name="title_en_display"
                placeholder="e.g. E-Commerce Platform"
                value={title_en}
                onChange={(e) => setTitleEn(e.target.value)}
              />
              <TranslateButton
                text={title_en}
                sourceLanguage="English"
                targetLanguage="Japanese"
                onTranslated={setTitleJa}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase">Overview (EN)</label>
                <TranslateButton
                  text={overview_en}
                  sourceLanguage="English"
                  targetLanguage="Japanese"
                  onTranslated={setOverviewJa}
                />
              </div>
              <RichTextEditor
                name="overview_en_display"
                placeholder="Describe the project in detail..."
                value={overview_en}
                onChange={setOverviewEn}
              />
            </div>
          </div>
        )}

        {lang === "ja" && (
          <div className="space-y-6">
            <Field
              label="Project Title (JA)"
              name="title_ja_display"
              placeholder="例：eコマースプラットフォーム"
              value={title_ja}
              onChange={(e) => setTitleJa(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Overview (JA)</label>
              <RichTextEditor
                name="overview_ja_display"
                placeholder="プロジェクトの詳細を説明してください..."
                value={overview_ja}
                onChange={setOverviewJa}
              />
            </div>
          </div>
        )}

        <hr className="border-gray-800 my-8" />

        <div>
          <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Category</label>
          <select
            name="category"
            className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <Field
          label="Technologies (comma-separated)"
          name="technologies"
          placeholder="React, Node.js, PostgreSQL"
        />
        <div className="space-y-3">
          <Field label="Cover Image" name="image" type="file" />
          <Field label="Or Provide Cover Image URL" name="imageUrl" placeholder="https://..." />
        </div>
        <Field label="Live URL (optional)" name="liveUrl" placeholder="https://yourproject.com" />
        <Field label="GitHub URL (optional)" name="githubUrl" placeholder="https://github.com/..." />

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
          >
            Add Project
          </button>
          <Link
            href="/admin/portfolio"
            className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, placeholder, value, onChange, textarea = false, rows = 4, type = "text"
}: {
  label: string; name: string; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; textarea?: boolean; rows?: number; type?: "text" | "file";
}) {
  return (
    <div className="flex-grow">
      <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={type === "file" ? undefined : value}
          onChange={onChange}
          accept={type === "file" ? "image/*" : undefined}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#111] file:text-gray-300 hover:file:bg-[#222] file:cursor-pointer"
        />
      )}
    </div>
  );
}
