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

  const getCharCountColor = (count: number, max: number) => {
    if (count === 0) return "text-gray-500";
    if (count > max) return "text-red-500";
    if (count > max * 0.8) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <form action={async (formData) => {
      setIsSaving(true);
      await updateSeoContent(formData);
      setIsSaving(false);
    }} className="space-y-8">
      {saved && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-lg border border-green-500/20 text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
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
              tab === "en" ? "border-b-2 border-[#c9a84c] text-[#c9a84c]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            ENGLISH
          </button>
          <button
            type="button"
            onClick={() => setTab("ja")}
            className={`px-6 py-3 font-semibold tracking-widest text-sm transition-colors ${
              tab === "ja" ? "border-b-2 border-[#c9a84c] text-[#c9a84c]" : "text-gray-500 hover:text-gray-300"
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
            className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Translating...
              </>
            ) : "Auto-Translate to Japanese"}
          </button>
        )}
        {tab === "ja" && (
          <button
            type="button"
            onClick={handleTranslateToEn}
            disabled={isTranslating}
            className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Translating...
              </>
            ) : "Auto-Translate to English"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FORM */}
        <div className="space-y-6">
          <div className="bg-[#111] p-5 rounded-xl border border-white/5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Site Name <span className="text-gray-500 text-xs font-normal">({tab === "en" ? "English" : "Japanese"})</span>
              </label>
              <input
                type="text"
                value={tab === "en" ? siteName_en : siteName_ja}
                onChange={(e) => tab === "en" ? setSiteNameEn(e.target.value) : setSiteNameJa(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
                required
                placeholder="e.g. Abhash Khadka Portfolio"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-300">
                  Home Page Title
                </label>
                <span className={`text-xs ${getCharCountColor(currentTitle.length, 60)}`}>
                  {currentTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                value={tab === "en" ? title_en : title_ja}
                onChange={(e) => tab === "en" ? setTitleEn(e.target.value) : setTitleJa(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">Aim for 50-60 characters to avoid truncation in search results.</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-300">
                  Global Meta Description
                </label>
                <span className={`text-xs ${getCharCountColor(currentDescription.length, 160)}`}>
                  {currentDescription.length} / 160
                </span>
              </div>
              <textarea
                value={tab === "en" ? description_en : description_ja}
                onChange={(e) => tab === "en" ? setDescriptionEn(e.target.value) : setDescriptionJa(e.target.value)}
                rows={4}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">Aim for 150-160 characters. A compelling description increases click-through rates.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Keywords <span className="text-gray-500 text-xs font-normal">(Comma separated)</span>
              </label>
              <textarea
                value={tab === "en" ? keywords_en : keywords_ja}
                onChange={(e) => tab === "en" ? setKeywordsEn(e.target.value) : setKeywordsJa(e.target.value)}
                rows={3}
                placeholder="e.g. Abhash, Portfolio, Web Developer"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#c9a84c] text-black px-6 py-3.5 rounded-xl font-bold tracking-widest uppercase hover:bg-[#b8973b] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,168,76,0.2)] flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving Changes...
              </>
            ) : "Save SEO Settings"}
          </button>
        </div>

        {/* PREVIEW */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">Search Previews</h2>
          
          <div className="space-y-6">
            {/* Google Search Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Google Search Result</h3>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 font-sans hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
                    <span className="text-[10px]">🌐</span>
                  </div>
                  <div>
                    <div className="text-sm text-[#202124] leading-none mb-1 font-medium">{currentSiteName || "Abhash Khadka Portfolio"}</div>
                    <div className="text-xs text-[#4d5156] leading-none">https://abhashkhadka.com.np</div>
                  </div>
                  <div className="ml-auto text-gray-500 text-lg leading-none cursor-pointer">⋮</div>
                </div>
                <div className="text-[20px] text-[#1a0dab] cursor-pointer truncate leading-tight mb-1 font-medium hover:underline">
                  {currentTitle || "Your Title"} | Abhash Khadka
                </div>
                <div className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                  {currentDescription || "Your description will appear here. Make it compelling to encourage users to click through to your website."}
                </div>
              </div>
            </div>

            {/* Social Media Preview (Twitter/X style) */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Social Media Card (Twitter / LinkedIn)</h3>
              <div className="bg-black border border-gray-700 rounded-xl overflow-hidden font-sans hover:border-gray-500 transition-colors">
                <div className="w-full h-[200px] bg-gray-800 flex items-center justify-center border-b border-gray-700 relative overflow-hidden">
                  {/* Simulate OG Image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#222]"></div>
                  <span className="text-[#c9a84c] text-3xl font-bold tracking-tighter relative z-10 opacity-50">ABHASH KHADKA</span>
                </div>
                <div className="p-3 bg-black">
                  <div className="text-gray-400 text-[13px] mb-0.5">abhashkhadka.com.np</div>
                  <div className="text-white text-[15px] font-bold leading-tight mb-1 truncate">
                    {currentTitle || "Your Title"} | Abhash Khadka
                  </div>
                  <div className="text-gray-400 text-[14px] leading-snug line-clamp-2">
                    {currentDescription || "Your description will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
