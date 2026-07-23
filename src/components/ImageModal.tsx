"use client";

import { useState, useEffect } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className="relative z-0 cursor-pointer group w-full rounded-sm overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto transition-opacity duration-300 group-hover:opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            View Full Image
          </span>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center p-4 pt-20 pb-20 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: "var(--bg-primary)", opacity: 0.85 }}></div>
          
          <div className="relative z-10 inline-block max-w-full max-h-full">
            <img 
              src={src} 
              alt={alt}
              className="max-w-full max-h-[80vh] w-auto h-auto shadow-2xl rounded-sm border"
              style={{ borderColor: "var(--border-color)" }}
            />
            <button 
              className="absolute -top-3 -right-3 text-white hover:text-white bg-black hover:bg-black/80 rounded-full p-2 transition-colors cursor-pointer shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
