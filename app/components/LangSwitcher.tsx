"use client";

import { useState, useEffect, useRef } from "react";

// ── Type declaration for the vanilla-JS i18n engine (public/i18n.js) ──────────
declare global {
  interface Window {
    i18n?: {
      t: (key: string, vars?: Record<string, string>) => string;
      setLanguage: (code: string) => Promise<void>;
      getCurrentLang: () => string;
      getLanguages: () => Array<{ code: string; label: string; dir: string }>;
      on: (event: string, handler: (detail: unknown) => void) => void;
      off: (event: string, handler: (detail: unknown) => void) => void;
      applyDOM: () => void;
    };
  }
}

// ── Language registry ──────────────────────────────────────────────────────────
// Mirrors SUPPORTED_LANGUAGES in public/i18n.js. Update both together.
const LANGUAGES = [
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
  { code: "fr", label: "Français",  flag: "🇫🇷" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];
const LANG_MAP = new Map(LANGUAGES.map((l) => [l.code, l]));

function readStoredLang(): LangCode {
  try {
    const v = localStorage.getItem("capoeira-lang");
    if (v && LANG_MAP.has(v as LangCode)) return v as LangCode;
  } catch { /* private browsing */ }
  return "en";
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LangSwitcher() {
  const [current, setCurrent] = useState<LangCode>("en");
  const [open, setOpen]       = useState(false);
  const wrapRef               = useRef<HTMLDivElement>(null);

  // Sync from localStorage on mount, then track engine changes
  useEffect(() => {
    setCurrent(readStoredLang());

    function onEngineChange(e: Event) {
      const code = (e as CustomEvent<{ code: string }>).detail?.code as LangCode;
      if (code && LANG_MAP.has(code)) setCurrent(code);
    }
    document.addEventListener("i18n:change", onEngineChange);
    return () => document.removeEventListener("i18n:change", onEngineChange);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function select(code: LangCode) {
    setOpen(false);
    window.i18n?.setLanguage(code);
  }

  const active = LANG_MAP.get(current) ?? LANGUAGES[0];

  return (
    <div className={`lang-switcher${open ? " lang-switcher--open" : ""}`} ref={wrapRef}>

      {/* ── Trigger ── */}
      <button
        type="button"
        className="lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className="lang-icon" aria-hidden="true">{active.flag}</span>
        <span className="lang-label">{active.label}</span>
        <span className="lang-chevron" aria-hidden="true">▾</span>
      </button>

      {/* ── Dropdown (always rendered, shown via CSS transition) ── */}
      <ul className="lang-dropdown" role="listbox" aria-label="Language">
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === current;
          return (
            <li
              key={lang.code}
              role="option"
              aria-selected={isActive}
              className={`lang-option${isActive ? " lang-option--active" : ""}`}
              onClick={() => select(lang.code)}
            >
              <span aria-hidden="true">{lang.flag}</span>
              <span className="lang-option-code">{lang.code.toUpperCase()}</span>
              <span className="lang-option-name">{lang.label}</span>
            </li>
          );
        })}

      </ul>
    </div>
  );
}
