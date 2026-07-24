"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ContactContent } from "@/lib/data";
import { updateContactContent, translateText } from "@/lib/actions";
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

  // English Fields
  const [location_en, setLocationEn] = useState("");
  const [email_en, setEmailEn] = useState("");
  
  // Other English Fields
  const [tag_en, setTagEn] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [subtitle_en, setSubtitleEn] = useState("");
  const [name_en, setNameEn] = useState("");
  const [emailPlaceholder_en, setEmailPlaceholderEn] = useState("");
  const [subject_en, setSubjectEn] = useState("");
  const [message_en, setMessageEn] = useState("");
  const [send_en, setSendEn] = useState("");
  const [sent_en, setSentEn] = useState("");
  const [sentSubtitle_en, setSentSubtitleEn] = useState("");
  const [sendAnother_en, setSendAnotherEn] = useState("");

  // Japanese Fields
  const [location_ja, setLocationJa] = useState("");
  const [email_ja, setEmailJa] = useState("");
  const [tag_ja, setTagJa] = useState("");
  const [title_ja, setTitleJa] = useState("");
  const [subtitle_ja, setSubtitleJa] = useState("");
  const [name_ja, setNameJa] = useState("");
  const [emailPlaceholder_ja, setEmailPlaceholderJa] = useState("");
  const [subject_ja, setSubjectJa] = useState("");
  const [message_ja, setMessageJa] = useState("");
  const [send_ja, setSendJa] = useState("");
  const [sent_ja, setSentJa] = useState("");
  const [sentSubtitle_ja, setSentSubtitleJa] = useState("");
  const [sendAnother_ja, setSendAnotherJa] = useState("");
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const handleTranslateAllToJa = async () => {
    setIsTranslatingAll(true);
    try {
      if (location_en && !location_ja) setLocationJa(await translateText(location_en, "English", "Japanese"));
      if (email_en && !email_ja) setEmailJa(email_en); // Usually email doesn't need translation, just copy

      if (tag_en && !tag_ja) setTagJa(await translateText(tag_en, "English", "Japanese"));
      if (title_en && !title_ja) setTitleJa(await translateText(title_en, "English", "Japanese"));
      if (subtitle_en && !subtitle_ja) setSubtitleJa(await translateText(subtitle_en, "English", "Japanese"));
      if (name_en && !name_ja) setNameJa(await translateText(name_en, "English", "Japanese"));
      if (emailPlaceholder_en && !emailPlaceholder_ja) setEmailPlaceholderJa(await translateText(emailPlaceholder_en, "English", "Japanese"));
      if (subject_en && !subject_ja) setSubjectJa(await translateText(subject_en, "English", "Japanese"));
      if (message_en && !message_ja) setMessageJa(await translateText(message_en, "English", "Japanese"));
      if (send_en && !send_ja) setSendJa(await translateText(send_en, "English", "Japanese"));
      if (sent_en && !sent_ja) setSentJa(await translateText(sent_en, "English", "Japanese"));
      if (sentSubtitle_en && !sentSubtitle_ja) setSentSubtitleJa(await translateText(sentSubtitle_en, "English", "Japanese"));
      if (sendAnother_en && !sendAnother_ja) setSendAnotherJa(await translateText(sendAnother_en, "English", "Japanese"));
      setTab("ja");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleTranslateAllToEn = async () => {
    setIsTranslatingAll(true);
    try {
      if (location_ja && !location_en) setLocationEn(await translateText(location_ja, "Japanese", "English"));
      if (email_ja && !email_en) setEmailEn(email_ja); // Usually email doesn't need translation, just copy

      if (tag_ja && !tag_en) setTagEn(await translateText(tag_ja, "Japanese", "English"));
      if (title_ja && !title_en) setTitleEn(await translateText(title_ja, "Japanese", "English"));
      if (subtitle_ja && !subtitle_en) setSubtitleEn(await translateText(subtitle_ja, "Japanese", "English"));
      if (name_ja && !name_en) setNameEn(await translateText(name_ja, "Japanese", "English"));
      if (emailPlaceholder_ja && !emailPlaceholder_en) setEmailPlaceholderEn(await translateText(emailPlaceholder_ja, "Japanese", "English"));
      if (subject_ja && !subject_en) setSubjectEn(await translateText(subject_ja, "Japanese", "English"));
      if (message_ja && !message_en) setMessageEn(await translateText(message_ja, "Japanese", "English"));
      if (send_ja && !send_en) setSendEn(await translateText(send_ja, "Japanese", "English"));
      if (sent_ja && !sent_en) setSentEn(await translateText(sent_ja, "Japanese", "English"));
      if (sentSubtitle_ja && !sentSubtitle_en) setSentSubtitleEn(await translateText(sentSubtitle_ja, "Japanese", "English"));
      if (sendAnother_ja && !sendAnother_en) setSendAnotherEn(await translateText(sendAnother_ja, "Japanese", "English"));
      setTab("en");
    } finally {
      setIsTranslatingAll(false);
    }
  };
  useEffect(() => {
    if (data) {
      setLocationEn(data.location_en ?? "");
      setEmailEn(data.email_en ?? "");
      setTagEn(data.tag_en ?? "");
      setTitleEn(data.title_en ?? "");
      setSubtitleEn(data.subtitle_en ?? "");
      setNameEn(data.name_en ?? "");
      setEmailPlaceholderEn(data.emailPlaceholder_en ?? "");
      setSubjectEn(data.subject_en ?? "");
      setMessageEn(data.message_en ?? "");
      setSendEn(data.send_en ?? "");
      setSentEn(data.sent_en ?? "");
      setSentSubtitleEn(data.sentSubtitle_en ?? "");
      setSendAnotherEn(data.sendAnother_en ?? "");
      
      setLocationJa(data.location_ja ?? "");
      setEmailJa(data.email_ja ?? "");
      setTagJa(data.tag_ja ?? "");
      setTitleJa(data.title_ja ?? "");
      setSubtitleJa(data.subtitle_ja ?? "");
      setNameJa(data.name_ja ?? "");
      setEmailPlaceholderJa(data.emailPlaceholder_ja ?? "");
      setSubjectJa(data.subject_ja ?? "");
      setMessageJa(data.message_ja ?? "");
      setSendJa(data.send_ja ?? "");
      setSentJa(data.sent_ja ?? "");
      setSentSubtitleJa(data.sentSubtitle_ja ?? "");
      setSendAnotherJa(data.sendAnother_ja ?? "");
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
            <h3 className="text-white font-bold text-md pt-2 border-t border-gray-800">General Info</h3>
            <FieldWithButton label="Location" name="location_en_display" value={location_en} onChange={(e) => setLocationEn(e.target.value)} onTranslate={setLocationJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Email" name="email_en_display" value={email_en} onChange={(e) => setEmailEn(e.target.value)} onTranslate={setEmailJa} sourceLang="English" targetLang="Japanese" />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Content</h3>
            <FieldWithButton label="Tag" name="tag_en_display" value={tag_en} onChange={(e) => setTagEn(e.target.value)} onTranslate={setTagJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Title" name="title_en_display" value={title_en} onChange={(e) => setTitleEn(e.target.value)} onTranslate={setTitleJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Subtitle" name="subtitle_en_display" value={subtitle_en} onChange={(e) => setSubtitleEn(e.target.value)} onTranslate={setSubtitleJa} sourceLang="English" targetLang="Japanese" textarea />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Form Fields</h3>
            <FieldWithButton label="Name Placeholder" name="name_en_display" value={name_en} onChange={(e) => setNameEn(e.target.value)} onTranslate={setNameJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Email Placeholder" name="emailPlaceholder_en_display" value={emailPlaceholder_en} onChange={(e) => setEmailPlaceholderEn(e.target.value)} onTranslate={setEmailPlaceholderJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Subject Placeholder" name="subject_en_display" value={subject_en} onChange={(e) => setSubjectEn(e.target.value)} onTranslate={setSubjectJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Message Placeholder" name="message_en_display" value={message_en} onChange={(e) => setMessageEn(e.target.value)} onTranslate={setMessageJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Send Button" name="send_en_display" value={send_en} onChange={(e) => setSendEn(e.target.value)} onTranslate={setSendJa} sourceLang="English" targetLang="Japanese" />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Success Message</h3>
            <FieldWithButton label="Sent Title" name="sent_en_display" value={sent_en} onChange={(e) => setSentEn(e.target.value)} onTranslate={setSentJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Sent Subtitle" name="sentSubtitle_en_display" value={sentSubtitle_en} onChange={(e) => setSentSubtitleEn(e.target.value)} onTranslate={setSentSubtitleJa} sourceLang="English" targetLang="Japanese" />
            <FieldWithButton label="Send Another Button" name="sendAnother_en_display" value={sendAnother_en} onChange={(e) => setSendAnotherEn(e.target.value)} onTranslate={setSendAnotherJa} sourceLang="English" targetLang="Japanese" />
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
            <h3 className="text-white font-bold text-md pt-2 border-t border-gray-800">General Info</h3>
            <FieldWithButton label="Location" name="location_ja_display" value={location_ja} onChange={(e) => setLocationJa(e.target.value)} onTranslate={setLocationEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Email" name="email_ja_display" value={email_ja} onChange={(e) => setEmailJa(e.target.value)} onTranslate={setEmailEn} sourceLang="Japanese" targetLang="English" />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Content</h3>
            <FieldWithButton label="Tag" name="tag_ja_display" value={tag_ja} onChange={(e) => setTagJa(e.target.value)} onTranslate={setTagEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Title" name="title_ja_display" value={title_ja} onChange={(e) => setTitleJa(e.target.value)} onTranslate={setTitleEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Subtitle" name="subtitle_ja_display" value={subtitle_ja} onChange={(e) => setSubtitleJa(e.target.value)} onTranslate={setSubtitleEn} sourceLang="Japanese" targetLang="English" textarea />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Form Fields</h3>
            <FieldWithButton label="Name Placeholder" name="name_ja_display" value={name_ja} onChange={(e) => setNameJa(e.target.value)} onTranslate={setNameEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Email Placeholder" name="emailPlaceholder_ja_display" value={emailPlaceholder_ja} onChange={(e) => setEmailPlaceholderJa(e.target.value)} onTranslate={setEmailPlaceholderEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Subject Placeholder" name="subject_ja_display" value={subject_ja} onChange={(e) => setSubjectJa(e.target.value)} onTranslate={setSubjectEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Message Placeholder" name="message_ja_display" value={message_ja} onChange={(e) => setMessageJa(e.target.value)} onTranslate={setMessageEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Send Button" name="send_ja_display" value={send_ja} onChange={(e) => setSendJa(e.target.value)} onTranslate={setSendEn} sourceLang="Japanese" targetLang="English" />
            
            <h3 className="text-white font-bold text-md pt-4 border-t border-gray-800">Success Message</h3>
            <FieldWithButton label="Sent Title" name="sent_ja_display" value={sent_ja} onChange={(e) => setSentJa(e.target.value)} onTranslate={setSentEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Sent Subtitle" name="sentSubtitle_ja_display" value={sentSubtitle_ja} onChange={(e) => setSentSubtitleJa(e.target.value)} onTranslate={setSentSubtitleEn} sourceLang="Japanese" targetLang="English" />
            <FieldWithButton label="Send Another Button" name="sendAnother_ja_display" value={sendAnother_ja} onChange={(e) => setSendAnotherJa(e.target.value)} onTranslate={setSendAnotherEn} sourceLang="Japanese" targetLang="English" />
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

        {/* Hidden inputs to pass data back on submit since they might not be visible in DOM */}
        <input type="hidden" name="location_en" value={location_en} />
        <input type="hidden" name="email_en" value={email_en} />
        <input type="hidden" name="tag_en" value={tag_en} />
        <input type="hidden" name="title_en" value={title_en} />
        <input type="hidden" name="subtitle_en" value={subtitle_en} />
        <input type="hidden" name="name_en" value={name_en} />
        <input type="hidden" name="emailPlaceholder_en" value={emailPlaceholder_en} />
        <input type="hidden" name="subject_en" value={subject_en} />
        <input type="hidden" name="message_en" value={message_en} />
        <input type="hidden" name="send_en" value={send_en} />
        <input type="hidden" name="sent_en" value={sent_en} />
        <input type="hidden" name="sentSubtitle_en" value={sentSubtitle_en} />
        <input type="hidden" name="sendAnother_en" value={sendAnother_en} />

        <input type="hidden" name="location_ja" value={location_ja} />
        <input type="hidden" name="email_ja" value={email_ja} />
        <input type="hidden" name="tag_ja" value={tag_ja} />
        <input type="hidden" name="title_ja" value={title_ja} />
        <input type="hidden" name="subtitle_ja" value={subtitle_ja} />
        <input type="hidden" name="name_ja" value={name_ja} />
        <input type="hidden" name="emailPlaceholder_ja" value={emailPlaceholder_ja} />
        <input type="hidden" name="subject_ja" value={subject_ja} />
        <input type="hidden" name="message_ja" value={message_ja} />
        <input type="hidden" name="send_ja" value={send_ja} />
        <input type="hidden" name="sent_ja" value={sent_ja} />
        <input type="hidden" name="sentSubtitle_ja" value={sentSubtitle_ja} />
        <input type="hidden" name="sendAnother_ja" value={sendAnother_ja} />

        {renderLanguageSection("en")}
        {renderLanguageSection("ja")}

      </form>
    </>
  );
}
