"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteData } from "@/lib/data";
import { updateLandingContent, translateText } from "@/lib/actions";
import SaveAlert from "@/components/SaveAlert";
import FieldWithButton, { SmallFieldWithButton } from "./FieldWithButton";

export default function LandingForm({ data }: { data: SiteData["landing"] }) {
  const [tab, setTab] = useState<"en" | "ja">("en");
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      setShowAlert(true);
    }
  }, [searchParams]);

  const [tagline_en, setTaglineEn] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [subtitle_en, setSubtitleEn] = useState("");
  const [ctaText_en, setCtaTextEn] = useState("");
  const [aboutTag_en, setAboutTagEn] = useState("");
  const [aboutTitle_en, setAboutTitleEn] = useState("");
  const [bio1_en, setBio1En] = useState("");
  const [bio2_en, setBio2En] = useState("");
  const [bio3_en, setBio3En] = useState("");
  const [gpa_en, setGpaEn] = useState("");
  const [projectsCount_en, setProjectsCountEn] = useState("");
  const [certs_en, setCertsEn] = useState("");

  const [tagline_ja, setTaglineJa] = useState("");
  const [title_ja, setTitleJa] = useState("");
  const [subtitle_ja, setSubtitleJa] = useState("");
  const [ctaText_ja, setCtaTextJa] = useState("");
  const [aboutTag_ja, setAboutTagJa] = useState("");
  const [aboutTitle_ja, setAboutTitleJa] = useState("");
  const [bio1_ja, setBio1Ja] = useState("");
  const [bio2_ja, setBio2Ja] = useState("");
  const [bio3_ja, setBio3Ja] = useState("");
  const [gpa_ja, setGpaJa] = useState("");
  const [projectsCount_ja, setProjectsCountJa] = useState("");
  const [certs_ja, setCertsJa] = useState("");

  const [heroBgUrl, setHeroBgUrl] = useState("");
  const [aboutImgUrl, setAboutImgUrl] = useState("");
  const [quoteBgUrl, setQuoteBgUrl] = useState("");
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const handleTranslateAllToJa = async () => {
    setIsTranslatingAll(true);
    try {
      if (tagline_en && !tagline_ja) setTaglineJa(await translateText(tagline_en, "English", "Japanese"));
      if (title_en && !title_ja) setTitleJa(await translateText(title_en, "English", "Japanese"));
      if (subtitle_en && !subtitle_ja) setSubtitleJa(await translateText(subtitle_en, "English", "Japanese"));
      if (ctaText_en && !ctaText_ja) setCtaTextJa(await translateText(ctaText_en, "English", "Japanese"));
      if (aboutTag_en && !aboutTag_ja) setAboutTagJa(await translateText(aboutTag_en, "English", "Japanese"));
      if (aboutTitle_en && !aboutTitle_ja) setAboutTitleJa(await translateText(aboutTitle_en, "English", "Japanese"));
      if (bio1_en && !bio1_ja) setBio1Ja(await translateText(bio1_en, "English", "Japanese"));
      if (bio2_en && !bio2_ja) setBio2Ja(await translateText(bio2_en, "English", "Japanese"));
      if (bio3_en && !bio3_ja) setBio3Ja(await translateText(bio3_en, "English", "Japanese"));
      if (gpa_en && !gpa_ja) setGpaJa(await translateText(gpa_en, "English", "Japanese"));
      if (projectsCount_en && !projectsCount_ja) setProjectsCountJa(await translateText(projectsCount_en, "English", "Japanese"));
      if (certs_en && !certs_ja) setCertsJa(await translateText(certs_en, "English", "Japanese"));
      setTab("ja");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleTranslateAllToEn = async () => {
    setIsTranslatingAll(true);
    try {
      if (tagline_ja && !tagline_en) setTaglineEn(await translateText(tagline_ja, "Japanese", "English"));
      if (title_ja && !title_en) setTitleEn(await translateText(title_ja, "Japanese", "English"));
      if (subtitle_ja && !subtitle_en) setSubtitleEn(await translateText(subtitle_ja, "Japanese", "English"));
      if (ctaText_ja && !ctaText_en) setCtaTextEn(await translateText(ctaText_ja, "Japanese", "English"));
      if (aboutTag_ja && !aboutTag_en) setAboutTagEn(await translateText(aboutTag_ja, "Japanese", "English"));
      if (aboutTitle_ja && !aboutTitle_en) setAboutTitleEn(await translateText(aboutTitle_ja, "Japanese", "English"));
      if (bio1_ja && !bio1_en) setBio1En(await translateText(bio1_ja, "Japanese", "English"));
      if (bio2_ja && !bio2_en) setBio2En(await translateText(bio2_ja, "Japanese", "English"));
      if (bio3_ja && !bio3_en) setBio3En(await translateText(bio3_ja, "Japanese", "English"));
      if (gpa_ja && !gpa_en) setGpaEn(await translateText(gpa_ja, "Japanese", "English"));
      if (projectsCount_ja && !projectsCount_en) setProjectsCountEn(await translateText(projectsCount_ja, "Japanese", "English"));
      if (certs_ja && !certs_en) setCertsEn(await translateText(certs_ja, "Japanese", "English"));
      setTab("en");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  useEffect(() => {
    if (data) {
      setTaglineEn(data.en.hero.tagline ?? "");
      setTitleEn(data.en.hero.title ?? "");
      setSubtitleEn(data.en.hero.subtitle ?? "");
      setCtaTextEn(data.en.hero.ctaText ?? "");
      setAboutTagEn(data.en.about.tag ?? "");
      setAboutTitleEn(data.en.about.title ?? "");
      setBio1En(data.en.about.bio1 ?? "");
      setBio2En(data.en.about.bio2 ?? "");
      setBio3En(data.en.about.bio3 ?? "");
      setGpaEn(data.en.about.gpa ?? "");
      setProjectsCountEn(data.en.about.projects ?? "");
      setCertsEn(data.en.about.certs ?? "");

      setTaglineJa(data.ja.hero.tagline ?? "");
      setTitleJa(data.ja.hero.title ?? "");
      setSubtitleJa(data.ja.hero.subtitle ?? "");
      setCtaTextJa(data.ja.hero.ctaText ?? "");
      setAboutTagJa(data.ja.about.tag ?? "");
      setAboutTitleJa(data.ja.about.title ?? "");
      setBio1Ja(data.ja.about.bio1 ?? "");
      setBio2Ja(data.ja.about.bio2 ?? "");
      setBio3Ja(data.ja.about.bio3 ?? "");
      setGpaJa(data.ja.about.gpa ?? "");
      setProjectsCountJa(data.ja.about.projects ?? "");
      setCertsJa(data.ja.about.certs ?? "");

      setHeroBgUrl(data.images?.heroBg ?? "");
      setAboutImgUrl(data.images?.aboutImg ?? "");
      setQuoteBgUrl(data.images?.quoteBg ?? "");
    }
  }, [data]);

  const renderLanguageSection = (lang: "en" | "ja") => {
    const isVisible = tab === lang;
    if (lang === 'en') {
      return (
        <div className={isVisible ? "block" : "hidden"} key={lang}>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5 mb-10">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> Hero Section (EN)
            </h2>
            <FieldWithButton label="Tagline" name="tagline_en_display" value={tagline_en} onChange={(e) => setTaglineEn(e.target.value)} onTranslate={setTaglineJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Main Title" name="title_en_display" value={title_en} onChange={(e) => setTitleEn(e.target.value)} onTranslate={setTitleJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Subtitle / Description" name="subtitle_en_display" value={subtitle_en} onChange={(e) => setSubtitleEn(e.target.value)} onTranslate={setSubtitleJa} sourceLang="English" targetLang="Japanese" textarea />
            <FieldWithButton label="CTA Button Text" name="ctaText_en_display" value={ctaText_en} onChange={(e) => setCtaTextEn(e.target.value)} onTranslate={setCtaTextJa} sourceLang="English" targetLang="Japanese" />
          </section>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> About Section (EN)
            </h2>
            <FieldWithButton label='Tag (e.g. "About Me")' name="tag_en_display" value={aboutTag_en} onChange={(e) => setAboutTagEn(e.target.value)} onTranslate={setAboutTagJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Section Title" name="aboutTitle_en_display" value={aboutTitle_en} onChange={(e) => setAboutTitleEn(e.target.value)} onTranslate={setAboutTitleJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Bio Paragraph 1" name="bio1_en_display" value={bio1_en} onChange={(e) => setBio1En(e.target.value)} onTranslate={setBio1Ja} sourceLang="English" targetLang="Japanese" textarea />
            <FieldWithButton label="Bio Paragraph 2" name="bio2_en_display" value={bio2_en} onChange={(e) => setBio2En(e.target.value)} onTranslate={setBio2Ja} sourceLang="English" targetLang="Japanese" textarea />
            <FieldWithButton label="Bio Paragraph 3" name="bio3_en_display" value={bio3_en} onChange={(e) => setBio3En(e.target.value)} onTranslate={setBio3Ja} sourceLang="English" targetLang="Japanese" textarea />
            <div className="grid grid-cols-3 gap-4">
              <SmallFieldWithButton label="GPA / Label 1" name="gpa_en_display" value={gpa_en} onChange={(e) => setGpaEn(e.target.value)} onTranslate={setGpaJa} sourceLang="English" targetLang="Japanese" />
              <SmallFieldWithButton label="Projects / Label 2" name="projectsCount_en_display" value={projectsCount_en} onChange={(e) => setProjectsCountEn(e.target.value)} onTranslate={setProjectsCountJa} sourceLang="English" targetLang="Japanese" />
              <SmallFieldWithButton label="Certs / Label 3" name="certs_en_display" value={certs_en} onChange={(e) => setCertsEn(e.target.value)} onTranslate={setCertsJa} sourceLang="English" targetLang="Japanese" />
            </div>
          </section>
        </div>
      );
    } else {
      return (
        <div className={isVisible ? "block" : "hidden"} key={lang}>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5 mb-10">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> Hero Section (JA)
            </h2>
            <FieldWithButton label="Tagline" name="tagline_ja_display" value={tagline_ja} onChange={(e) => setTaglineJa(e.target.value)} onTranslate={setTaglineEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Main Title" name="title_ja_display" value={title_ja} onChange={(e) => setTitleJa(e.target.value)} onTranslate={setTitleEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Subtitle / Description" name="subtitle_ja_display" value={subtitle_ja} onChange={(e) => setSubtitleJa(e.target.value)} onTranslate={setSubtitleEn} sourceLang="Japanese" targetLang="English" textarea />
            <FieldWithButton label="CTA Button Text" name="ctaText_ja_display" value={ctaText_ja} onChange={(e) => setCtaTextJa(e.target.value)} onTranslate={setCtaTextEn} sourceLang="Japanese" targetLang="English" />
          </section>
          <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-5">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#c9a84c]">⬤</span> About Section (JA)
            </h2>
            <FieldWithButton label='Tag (e.g. "About Me")' name="tag_ja_display" value={aboutTag_ja} onChange={(e) => setAboutTagJa(e.target.value)} onTranslate={setAboutTagEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Section Title" name="aboutTitle_ja_display" value={aboutTitle_ja} onChange={(e) => setAboutTitleJa(e.target.value)} onTranslate={setAboutTitleEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Bio Paragraph 1" name="bio1_ja_display" value={bio1_ja} onChange={(e) => setBio1Ja(e.target.value)} onTranslate={setBio1En} sourceLang="Japanese" targetLang="English" textarea />
            <FieldWithButton label="Bio Paragraph 2" name="bio2_ja_display" value={bio2_ja} onChange={(e) => setBio2Ja(e.target.value)} onTranslate={setBio2En} sourceLang="Japanese" targetLang="English" textarea />
            <FieldWithButton label="Bio Paragraph 3" name="bio3_ja_display" value={bio3_ja} onChange={(e) => setBio3Ja(e.target.value)} onTranslate={setBio3En} sourceLang="Japanese" targetLang="English" textarea />
            <div className="grid grid-cols-3 gap-4">
              <SmallFieldWithButton label="GPA / Label 1" name="gpa_ja_display" value={gpa_ja} onChange={(e) => setGpaJa(e.target.value)} onTranslate={setGpaEn} sourceLang="Japanese" targetLang="English" />
              <SmallFieldWithButton label="Projects / Label 2" name="projectsCount_ja_display" value={projectsCount_ja} onChange={(e) => setProjectsCountJa(e.target.value)} onTranslate={setProjectsCountEn} sourceLang="Japanese" targetLang="English" />
              <SmallFieldWithButton label="Certs / Label 3" name="certs_ja_display" value={certs_ja} onChange={(e) => setCertsJa(e.target.value)} onTranslate={setCertsEn} sourceLang="Japanese" targetLang="English" />
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <>
      {showAlert && (
        <SaveAlert
          message="Landing page saved successfully!"
          onDismiss={() => setShowAlert(false)}
        />
      )}
      <form action={updateLandingContent} className="space-y-10">
      <input type="hidden" name="tagline_en" value={tagline_en || ""} />
      <input type="hidden" name="title_en" value={title_en || ""} />
      <input type="hidden" name="subtitle_en" value={subtitle_en || ""} />
      <input type="hidden" name="ctaText_en" value={ctaText_en || ""} />
      <input type="hidden" name="aboutTag_en" value={aboutTag_en || ""} />
      <input type="hidden" name="aboutTitle_en" value={aboutTitle_en || ""} />
      <input type="hidden" name="bio1_en" value={bio1_en || ""} />
      <input type="hidden" name="bio2_en" value={bio2_en || ""} />
      <input type="hidden" name="bio3_en" value={bio3_en || ""} />
      <input type="hidden" name="gpa_en" value={gpa_en || ""} />
      <input type="hidden" name="projectsCount_en" value={projectsCount_en || ""} />
      <input type="hidden" name="certs_en" value={certs_en || ""} />
      <input type="hidden" name="tagline_ja" value={tagline_ja || ""} />
      <input type="hidden" name="title_ja" value={title_ja || ""} />
      <input type="hidden" name="subtitle_ja" value={subtitle_ja || ""} />
      <input type="hidden" name="ctaText_ja" value={ctaText_ja || ""} />
      <input type="hidden" name="aboutTag_ja" value={aboutTag_ja || ""} />
      <input type="hidden" name="aboutTitle_ja" value={aboutTitle_ja || ""} />
      <input type="hidden" name="bio1_ja" value={bio1_ja || ""} />
      <input type="hidden" name="bio2_ja" value={bio2_ja || ""} />
      <input type="hidden" name="bio3_ja" value={bio3_ja || ""} />
      <input type="hidden" name="gpa_ja" value={gpa_ja || ""} />
      <input type="hidden" name="projectsCount_ja" value={projectsCount_ja || ""} />
      <input type="hidden" name="certs_ja" value={certs_ja || ""} />
      
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
            disabled={isTranslatingAll}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600 mb-2"
          >
            {isTranslatingAll ? "Translating..." : "Auto-Translate to Japanese"}
          </button>
        )}
        {tab === "ja" && (
          <button
            type="button"
            onClick={handleTranslateAllToEn}
            disabled={isTranslatingAll}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors hover:bg-purple-700 disabled:bg-gray-600 mb-2"
          >
            {isTranslatingAll ? "Translating..." : "Auto-Translate to English"}
          </button>
        )}
      </div>

      {renderLanguageSection("en")}
      {renderLanguageSection("ja")}

      {/* Shared Images Section */}
      <section className="bg-[#111111] border border-gray-800 rounded-sm p-6 space-y-10">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <span className="text-[#c9a84c]">⬤</span> Hero Image
          </h2>
          <div className="space-y-3">
            <Field label="Hero Background Image (Leave empty to keep existing)" name="heroBg" type="file" />
            <Field label="Or Provide Hero Background URL" name="heroBgUrl" value={heroBgUrl} onChange={(e) => setHeroBgUrl(e.target.value)} />
          </div>
          <input type="hidden" name="existingHeroBg" value={data.images?.heroBg || ""} />
        </div>

        <div className="border-t border-gray-800 pt-10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <span className="text-[#c9a84c]">⬤</span> About Image
          </h2>
          <div className="space-y-3">
            <Field label="About Image (Leave empty to keep existing)" name="aboutImg" type="file" />
            <Field label="Or Provide About Image URL" name="aboutImgUrl" value={aboutImgUrl} onChange={(e) => setAboutImgUrl(e.target.value)} />
          </div>
          <input type="hidden" name="existingAboutImg" value={data.images?.aboutImg || ""} />
        </div>

        <div className="border-t border-gray-800 pt-10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <span className="text-[#c9a84c]">⬤</span> Quote Background Image
          </h2>
          <div className="space-y-3">
            <Field label="Quote Background Image (Leave empty to keep existing)" name="quoteBg" type="file" />
            <Field label="Or Provide Quote Background URL" name="quoteBgUrl" value={quoteBgUrl} onChange={(e) => setQuoteBgUrl(e.target.value)} />
          </div>
          <input type="hidden" name="existingQuoteBg" value={data.images?.quoteBg || ""} />
        </div>
      </section>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="bg-[#c9a84c] text-black font-bold px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#b8973b] transition-colors rounded-sm"
        >
          Save All Changes
        </button>
        <Link
          href="/"
          target="_blank"
          className="border border-gray-700 text-gray-400 font-medium px-8 py-3 text-sm hover:border-gray-500 hover:text-white transition-colors rounded-sm"
        >
          Preview Site ↗
        </Link>
      </div>
    </form>
    </>
  );
}

function Field({
  label, name, value, onChange, textarea = false, rows = 4, type = "text"
}: {
  label: string; name: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; textarea?: boolean; rows?: number; type?: "text" | "file";
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={type === "file" ? undefined : value}
          onChange={onChange}
          accept={type === "file" ? "image/*" : undefined}
          className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#111] file:text-gray-300 hover:file:bg-[#222] file:cursor-pointer"
        />
      )}
    </div>
  );
}

function SmallField({ label, name, value, onChange }: { label: string; name: string; value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm"
      />
    </div>
  );
}
