"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { setLocale } from "@/app/actions";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "uz", name: "O'zbekcha" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
];

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (localeCode: string) => {
    if (localeCode === currentLocale) {
      setIsOpen(false);
      return;
    }
    
    try {
      await setLocale(localeCode);
      setIsOpen(false);
      // Hard reload to reset all providers and client bundles with the new locale
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch language:", error);
    }
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider glass-effect border border-border/80 hover:border-primary/40 hover:bg-accent/40 text-muted-foreground hover:text-foreground hover-lift transition-all cursor-pointer select-none"
      >
        <Globe className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span>{currentLanguage.code}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl glass-effect border border-border shadow-lg p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-250 z-[100]">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors hover:bg-primary/10 hover:text-foreground cursor-pointer ${
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <span>{lang.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
