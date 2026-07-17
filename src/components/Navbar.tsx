"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.home,      href: "/" },
    { label: t.nav.portfolio, href: "/portfolio" },
    { label: t.nav.about,     href: "/about" },
    { label: t.nav.blogs,     href: "/blogs" },
    { label: t.nav.contact,   href: "/contact" },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      router.push("/admin");
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current < 5) router.push("/");
      clickCountRef.current = 0;
    }, 800);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLinkClick = () => setMobileMenuOpen(false);
  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? { background: "var(--bg-nav)", backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" } : { background: "transparent" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 group z-50 cursor-pointer">
              <img src="/logo.png" alt="Abhash Logo" className="h-8 w-auto object-contain" />
              <span className="text-xl sm:text-2xl font-black tracking-tighter transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
                ABHASH
              </span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm tracking-wide transition-colors duration-300 hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>
            
            <div className="md:hidden flex items-center gap-3 z-50">
              <ThemeToggle />
              <LanguageToggle />
              <button 
                onClick={toggleMenu} 
                className="flex flex-col gap-1.5 p-2 focus:outline-none" 
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-px transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ background: "var(--text-primary)" }}></span>
                <span className={`block w-6 h-px transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} style={{ background: "var(--text-primary)" }}></span>
                <span className={`block h-px transition-all duration-300 origin-center ${mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-4'}`} style={{ background: "var(--text-primary)" }}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 w-full h-full z-40 flex flex-col items-center justify-center gap-6 sm:gap-8 transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ background: "var(--bg-nav)" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className="text-2xl font-light py-2 hover:opacity-70 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {item.label}
          </Link>
        ))}

      </div>
    </>
  );
}
