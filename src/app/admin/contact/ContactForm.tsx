"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ContactContent } from "@/lib/data";
import { updateContactContent } from "@/lib/actions";
import TranslateButton from "@/components/TranslateButton";
import SaveAlert from "@/components/SaveAlert";
import FieldWithButton from "@/app/admin/landing/FieldWithButton";

export default function ContactForm({ data }: { data: ContactContent }) {
  const [tab, setTab] = useState<"en" | "ja">("en");
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      setShowAlert(true);
    }
  }, [searchParams]);

  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [tag_en, setTagEn] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [subtitle_en, setSubtitleEn] = useState("");
  const [tag_ja, setTagJa] = useState("");
  const [title_ja, setTitleJa] = useState("");
  const [subtitle_ja, setSubtitleJa] = useState("");

  useEffect(() => {
    if (data) {
      setLocation(data.location ?? "");
      setEmail(data.email ?? "");
      setTagEn(data.tag_en ?? "");
      setTitleEn(data.title_en ?? "");
      setSubtitleEn(data.subtitle_en ?? "");
      setTagJa(data.tag_ja ?? "");
      setTitleJa(data.title_ja ?? "");
      setSubtitleJa(data.subtitle_ja ?? "");
    }
  }, [data]);

  const renderLanguageSection = (lang: "en" | "ja") => {
    const isVisible = tab === lang;
    if (lang === 'en') {
      return (
        <div className={isVisible ? "block" : "hidden"} key={lang}>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> Contact Section (EN)
            </h2>
            <FieldWithButton label="Tag" name="tag_en_display" value={tag_en} onChange={(e) => setTagEn(e.target.value)} onTranslate={setTagJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Title" name="title_en_display" value={title_en} onChange={(e) => setTitleEn(e.target.value)} onTranslate={setTitleJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Subtitle" name="subtitle_en_display" value={subtitle_en} onChange={(e) => setSubtitleEn(e.target.value)} onTranslate={setSubtitleJa} sourceLang="English" targetLang="Japanese" textarea />
          </section>
        </div>
      );
    } else {
      return (
        <div className={isVisible ? "block" : "hidden"} key={lang}>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> Contact Section (JA)
            </h2>
            <FieldWithButton label="Tag" name="tag_ja_display" value={tag_ja} onChange={(e) => setTagJa(e.target.value)} onTranslate={setTagEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Title" name="title_ja_display" value={title_ja} onChange={(e) => setTitleJa(e.target.value)} onTranslate={setTitleEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Subtitle" name="subtitle_ja_display" value={subtitle_ja} onChange={(e) => setSubtitleJa(e.target.value)} onTranslate={setSubtitleEn} sourceLang="Japanese" targetLang="English" textarea />
          </section>
        </div>
      );
    }
  };

  return (
    <>
      {showAlert && (
        <SaveAlert message="Contact content saved successfully!" onDismiss={() => setShowAlert(false)} />
      )}
      <form action={updateContactContent} className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Section</h1>
          <button
            type="submit"
            className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm w-full sm:w-auto"
          >
            Save All Changes
          </button>
        </div>

        <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5 mb-10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-[#c9a84c]">⬤</span> General Info
          </h2>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Location</label>
            <input type="text" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 rounded-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Email</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 rounded-sm focus:outline-none focus:border-[#c9a84c] transition-colors" />
          </div>
        </section>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm p-2 flex gap-2">
          <button type="button" onClick={() => setTab("en")} className={`flex-1 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm transition-colors ${tab === "en" ? "bg-[#c9a84c] text-black" : "text-gray-400 hover:text-white"}`}>
            English
          </button>
          <button type="button" onClick={() => setTab("ja")} className={`flex-1 py-3 text-sm font-semibold tracking-widest uppercase rounded-sm transition-colors ${tab === "ja" ? "bg-[#c9a84c] text-black" : "text-gray-400 hover:text-white"}`}>
            Japanese
          </button>
        </div>

        {/* Hidden inputs to pass data back on submit since they might not be visible in DOM */}
        <input type="hidden" name="tag_en" value={tag_en} />
        <input type="hidden" name="title_en" value={title_en} />
        <input type="hidden" name="subtitle_en" value={subtitle_en} />
        <input type="hidden" name="tag_ja" value={tag_ja} />
        <input type="hidden" name="title_ja" value={title_ja} />
        <input type="hidden" name="subtitle_ja" value={subtitle_ja} />

        {renderLanguageSection("en")}
        {renderLanguageSection("ja")}

      </form>
    </>
  );
}
