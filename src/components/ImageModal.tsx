"use client";

import { useState } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="absolute inset-0 z-0 cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-80"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4 md:p-12"
          onClick={() => setIsOpen(false)}
        >
          <img 
            src={src} 
            alt={alt}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          />
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </>
  );
}
