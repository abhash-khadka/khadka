"use client";

import { sendMessage } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function ContactForm() {
  const searchParams = useSearchParams();
  const sent = searchParams.get("sent") === "1";
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-16">
          {/* Left side: Contact Info */}
          <div className="w-full lg:w-1/3">
            <p className="font-medium tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4" style={{ color: "var(--color-accent)" }}>
              {t.contact.tag}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight" style={{ color: "var(--text-primary)" }}>
              {t.contact.title}
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-md" style={{ color: "var(--text-secondary)" }}>
              {t.contact.subtitle}
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border" style={{ borderColor: "var(--border-color)", color: "var(--color-accent)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{t.contact.location}</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Hiroshima, Japan</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border" style={{ borderColor: "var(--border-color)", color: "var(--color-accent)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{t.contact.email}</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>info.abhashk@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Form */}
          <div className="w-full lg:w-2/3">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)" }}>
                  <span className="text-3xl" style={{ color: "var(--color-accent)" }}>✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{t.contact.sent}</h3>
                <p className="mb-8" style={{ color: "var(--text-secondary)" }}>{t.contact.sentSubtitle}</p>
                <a href="/contact" className="text-sm font-medium hover:opacity-70 transition-colors" style={{ color: "var(--color-accent)" }}>
                  {t.contact.sendAnother}
                </a>
              </div>
            ) : (
              <form action={sendMessage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={t.contact.name}
                    className="w-full bg-transparent p-4 focus:outline-none transition-colors"
                    style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full bg-transparent p-4 focus:outline-none transition-colors"
                    style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder={t.contact.subject}
                  className="w-full bg-transparent p-4 focus:outline-none transition-colors"
                  style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                />
                <textarea
                  name="message"
                  required
                  placeholder={t.contact.message}
                  rows={6}
                  className="w-full bg-transparent p-4 focus:outline-none transition-colors resize-none"
                  style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto font-semibold text-xs tracking-[2px] uppercase px-10 py-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                  style={{ background: "var(--color-accent)", color: "var(--bg-primary)" }}
                >
                  {t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}
