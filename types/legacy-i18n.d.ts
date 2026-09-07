// Transitional ambient type for the old public/i18n.js engine, used by
// SmiqForm.tsx and ConfirmedContent.tsx until they're converted to next-intl
// (see the next-intl migration plan, steps 6-7). Delete this file once both
// are converted and no `window.i18n` references remain.
export {};

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
