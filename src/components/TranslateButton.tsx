"use client";

import { useState } from "react";
import { translateText } from "@/lib/actions";

export default function TranslateButton({
  text,
  sourceLanguage,
  targetLanguage,
  onTranslated,
}: {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  onTranslated: (translatedText: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      if (translatedText.startsWith("Error:")) {
        alert(translatedText);
      } else {
        onTranslated(translatedText);
      }
    } catch (err) {
      alert("Translation error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !text}
      className="bg-blue-600 text-white px-4 py-2 text-xs font-semibold rounded-sm transition-colors hover:bg-blue-700 disabled:bg-gray-500"
    >
      {loading ? "Translating..." : `Translate to ${targetLanguage}`}
    </button>
  );
}
