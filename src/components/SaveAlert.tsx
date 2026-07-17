"use client";

import { useEffect, useState } from "react";

interface SaveAlertProps {
  message?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export default function SaveAlert({ 
  message = "Changes saved successfully!", 
  onDismiss, 
  autoDismissMs = 4000 
}: SaveAlertProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 400);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111] border border-green-500/30 rounded-sm px-5 py-4 shadow-2xl min-w-[280px] transition-all duration-400 ${
        exiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
      style={{ transitionDuration: "400ms" }}
    >
      {/* Green check icon */}
      <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center shrink-0 border border-green-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="text-sm font-medium text-white flex-1">{message}</p>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="text-gray-600 hover:text-gray-400 transition-colors ml-2 shrink-0"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-green-500/40 rounded-b-sm" style={{ animation: `shrink ${autoDismissMs}ms linear forwards` }} />

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}
