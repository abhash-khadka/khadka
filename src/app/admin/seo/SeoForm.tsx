"use client";

import { useState } from "react";
import { SeoContent } from "@/lib/data";
import { updateSeoContent, translateText } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

export default function SeoForm({ data }: { data: SeoContent }) {
  const [tab, setTab] = useState<"en" | "ja">("en");
  
  const [siteName_en, setSiteNameEn] = useState(data?.siteName_en || "");
  const [title_en, setTitleEn] = useState(data?.title_en || "");
  const [description_en, setDescriptionEn] = useState(data?.description_en || "");
  const [keywords_en, setKeywordsEn] = useState(data?.keywords_en || "");
  
  const [siteName_ja, setSiteNameJa] = useState(data?.siteName_ja || "");
  const [title_ja, setTitleJa] = useState(data?.title_ja || "");
  const [description_ja, setDescriptionJa] = useState(data?.description_ja || "");
  const [keywords_ja, setKeywordsJa] = useState(data?.keywords_ja || "");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  const handleTranslateToJa = async () => {
    setIsTranslating(true);
    try {
      if (siteName_en && !siteName_ja) setSiteNameJa(await translateText(siteName_en, "English", "Japanese"));
      if (title_en && !title_ja) setTitleJa(await translateText(title_en, "English", "Japanese"));
      if (description_en && !description_ja) setDescriptionJa(await translateText(description_en, "English", "Japanese"));
      if (keywords_en && !keywords_ja) setKeywordsJa(await translateText(keywords_en, "English", "Japanese"));
      setTab("ja");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateToEn = async () => {
    setIsTranslating(true);
    try {
      if (siteName_ja && !siteName_en) setSiteNameEn(await translateText(siteName_ja, "Japanese", "English"));
      if (title_ja && !title_en) setTitleEn(await translateText(title_ja, "Japanese", "English"));
      if (description_ja && !description_en) setDescriptionEn(await translateText(description_ja, "Japanese", "English"));
      if (keywords_ja && !keywords_en) setKeywordsEn(await translateText(keywords_ja, "Japanese", "English"));
      setTab("en");
    } finally {
      setIsTranslating(false);
    }
  };

  const currentSiteName = tab === "en" ? siteName_en : siteName_ja;
  const currentTitle = tab === "en" ? title_en : title_ja;
  const currentDescription = tab === "en" ? description_en : description_ja;

  return (
    <form action={async (formData) => {
      setIsSaving(true);
      await updateSeoContent(formData);
      setIsSaving(false);
    }} className="space-y-8">
      {saved && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-lg border border-green-500/20 text-sm">
          SEO settings saved successfully!
        </div>
      )}
      
      {/* Hidden Inputs for Form Submission */}
      <input type="hidden" name="siteName_en" value={siteName_en} />
      <input type="hidden" name="title_en" value={title_en} />
      <input type="hidden" name="description_en" value={description_en} />
      <input type="hidden" name="keywords_en" value={keywords_en} />
      <input type="hidden" name="siteName_ja" value={siteName_ja} />
      <input type="hidden" name="title_ja" value={title_ja} />
      <input type="hidden" name="description_ja" value={description_ja} />
      <input type="hidden" name="keywords_ja" value={keywords_ja} />

      {/* Language Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
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
            onClick={handleTranslateToJa}
            disabled={isTranslating}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600"
          >
            {isTranslating ? "Translating..." : "Auto-Translate to Japanese"}
          </button>
        )}
        {tab === "ja" && (
          <button
            type="button"
            onClick={handleTranslateToEn}
            disabled={isTranslating}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600"
          >
            {isTranslating ? "Translating..." : "Auto-Translate to English"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Site Name ({tab === "en" ? "English" : "Japanese"})
            </label>
            <input
              type="text"
              value={tab === "en" ? siteName_en : siteName_ja}
              onChange={(e) => tab === "en" ? setSiteNameEn(e.target.value) : setSiteNameJa(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Example: "Abhash Khadka Portfolio"</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title ({tab === "en" ? "English" : "Japanese"})
            </label>
            <input
              type="text"
              value={tab === "en" ? title_en : title_ja}
              onChange={(e) => tab === "en" ? setTitleEn(e.target.value) : setTitleJa(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description ({tab === "en" ? "English" : "Japanese"})
            </label>
            <textarea
              value={tab === "en" ? description_en : description_ja}
              onChange={(e) => tab === "en" ? setDescriptionEn(e.target.value) : setDescriptionJa(e.target.value)}
              rows={4}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Keywords ({tab === "en" ? "English" : "Japanese"} - Comma separated)
            </label>
            <textarea
              value={tab === "en" ? keywords_en : keywords_ja}
              onChange={(e) => tab === "en" ? setKeywordsEn(e.target.value) : setKeywordsJa(e.target.value)}
              rows={4}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#c9a84c] text-black px-6 py-2 rounded-lg font-bold tracking-widest uppercase hover:bg-[#b8973b] transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* PREVIEW */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Google Search Preview ({tab === "en" ? "English" : "Japanese"})</h2>
          <div className="bg-white rounded-lg p-5 shadow-sm max-w-[600px] border border-gray-200 font-sans">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <span className="text-[10px]">🌐</span>
              </div>
              <div>
                <div className="text-sm text-[#202124] leading-none mb-1 font-medium">{currentSiteName || "Abhash Khadka Portfolio"}</div>
                <div className="text-xs text-[#4d5156] leading-none">https://abhashkhadka.com.np</div>
              </div>
              <div className="ml-auto text-gray-500 text-xs">⋮</div>
            </div>
            <div className="text-[20px] text-[#1a0dab] cursor-pointer truncate leading-tight mb-1 font-medium hover:underline">
              {currentTitle || "Your Title"} | Abhash Khadka
            </div>
            <div className="text-sm text-[#4d5156] leading-snug line-clamp-2">
              {currentDescription || "Your description will appear here..."}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is an approximation of how your site might appear in Google Search results. Actual appearance may vary depending on the search query and device.
          </p>
        </div>
      </div>
    </form>
  );
}
