"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PopupContent } from "@/lib/data";
import Link from "next/link";

const POPUP_KEY = "welcome_popup_seen";

export default function WelcomePopup({ popup }: { popup: PopupContent }) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popup.enabled) return;
    const seen = sessionStorage.getItem(POPUP_KEY);
    if (!seen) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [popup.enabled]);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  const title = lang === "ja" ? popup.title_ja : popup.title_en;
  const body = lang === "ja" ? popup.body_ja : popup.body_en;
  const buttonLabel = lang === "ja" ? popup.buttonLabel_ja : popup.buttonLabel_en;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        style={{
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Card */}
      <div
        className="fixed z-[9999] inset-0 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-md rounded-md shadow-2xl pointer-events-auto overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            animation: "popupSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Image */}
          {popup.image && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={popup.image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Accent line */}
            <div
              className="w-10 h-0.5 mb-4 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />

            {title && (
              <h2
                className="text-xl font-bold mb-3 pr-8"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
            )}

            {body && (
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {body}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {buttonLabel && popup.buttonUrl && (
                <Link
                  href={popup.buttonUrl}
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-bold rounded-sm transition-opacity hover:opacity-85"
                  style={{ background: "var(--color-accent)", color: "var(--bg-primary)" }}
                >
                  {buttonLabel}
                </Link>
              )}
              <button
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium rounded-sm border transition-colors"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                {lang === "ja" ? "閉じる" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupSlideIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
