/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAPOEIRA INTERNATIONAL — i18n Engine  (public/i18n.js)
 *
 * Self-contained language loader, switcher, and DOM patcher.
 * Exposed as window.i18n for use from layout scripts and React components.
 * Locale JSON files are fetched from /locales/<code>.json.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * HOW TO ADD A NEW LANGUAGE
 * ───────────────────────────────────────────────────────────────────────────
 * 1. Create locales/<code>.json using locales/en.json as the template.
 *    Translate every string value; do not translate keys. Add the "//"
 *    REVIEW NEEDED comment key and mark domain strings with _review: true
 *    (see existing pt/es/fr files for the pattern).
 *
 * 2. Register it in SUPPORTED_LANGUAGES below:
 *
 *      { code: 'ar', label: 'العربية', dir: 'rtl' }
 *
 *    Set dir: 'rtl' for right-to-left scripts (Arabic, Hebrew, Farsi, etc.)
 *    and dir: 'ltr' for everything else.
 *
 * WHERE TO SET RTL OVERRIDES
 * ───────────────────────────────────────────────────────────────────────────
 * This engine writes html[lang] and html[dir] on every language switch.
 * All layout CSS should work automatically if it uses logical properties
 * (margin-inline-*, padding-block-*, inset-inline-*, border-inline-*, etc.).
 *
 * If a component still uses physical properties (left/right, margin-left…),
 * add a targeted override in app/globals.css — not here:
 *
 *   [dir="rtl"] .your-component { margin-inline-start: 1rem; }
 *
 * For language-specific font stacks add a lang selector in globals.css:
 *
 *   [lang="ar"] { --font-body: 'Noto Naskh Arabic', serif; }
 *
 * Keep all directional and script-specific CSS in globals.css so it is
 * auditable in one place and never scattered across JS files.
 *
 * HOW TO MARK DOM ELEMENTS FOR TRANSLATION
 * ───────────────────────────────────────────────────────────────────────────
 * Add data attributes to any element that holds translatable content:
 *
 *   data-i18n="namespace.key"             sets element.textContent
 *   data-i18n-html="namespace.key"        sets element.innerHTML  (use sparingly)
 *   data-i18n-placeholder="namespace.key" sets the placeholder attribute
 *   data-i18n-aria-label="namespace.key"  sets the aria-label attribute
 *   data-i18n-title="namespace.key"       sets the title attribute
 *   data-i18n-vars='{"name":"value"}'     JSON interpolation vars, shared by
 *                                          all data-i18n-* attrs on the same element
 *
 * Interpolation: use {varName} inside any translation string.
 * Example in JSON  →  "heading": "Axé, {firstName}!"
 * Example in HTML  →  data-i18n="form_success.heading"
 *                     data-i18n-vars='{"firstName":"João"}'
 *
 * For React components, call window.i18n.t(key, vars) directly and
 * subscribe to the 'change' event to trigger re-renders:
 *
 *   document.addEventListener('i18n:change', ({ detail }) => {
 *     // detail = { code, dir, label }
 *     forceUpdate(); // or setState, or whatever triggers a re-render
 *   });
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────────────────

  /** Add new languages here. Order determines display order in any language picker. */
  const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English',   dir: 'ltr' },
    { code: 'pt', label: 'Português', dir: 'ltr' },
    { code: 'es', label: 'Español',   dir: 'ltr' },
    { code: 'fr', label: 'Français',  dir: 'ltr' },
  ];

  const DEFAULT_LANG = 'en';
  const STORAGE_KEY  = 'capoeira-lang';
  const LOCALE_BASE  = '/locales/';

  // ── State ──────────────────────────────────────────────────────────────────

  let currentLang  = DEFAULT_LANG;
  let strings      = {};  // active locale data
  let fallback     = {};  // English data — used when a key is absent in active locale
  const cache      = {};  // { code: data } — prevents duplicate fetches
  const listeners  = {};  // internal event bus: { eventName: [handler, …] }

  // ── Locale loading ─────────────────────────────────────────────────────────

  async function loadLocale(code) {
    if (cache[code]) return cache[code];
    const res = await fetch(`${LOCALE_BASE}${code}.json`);
    if (!res.ok) {
      throw new Error(`[i18n] Locale fetch failed for "${code}" (HTTP ${res.status})`);
    }
    const data = await res.json();
    cache[code] = data;
    return data;
  }

  // ── Key resolution ─────────────────────────────────────────────────────────

  /**
   * Walk a dot-separated path through a translations object.
   * Returns a string value or undefined. Boolean _review flags and the
   * "//" comment key are silently ignored (they resolve to non-string, so
   * undefined is returned and the fallback chain continues).
   */
  function resolve(obj, path) {
    const parts = path.split('.');
    let node = obj;
    for (const part of parts) {
      if (node == null || typeof node !== 'object') return undefined;
      node = node[part];
    }
    return typeof node === 'string' ? node : undefined;
  }

  /** Replace every {varName} token with the matching value from vars. */
  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (match, key) =>
      vars[key] != null ? String(vars[key]) : match
    );
  }

  /**
   * Translate a dot-separated key with optional variable interpolation.
   *
   * Resolution order:
   *   1. Active locale strings
   *   2. English fallback (handles untranslated keys after adding a new locale)
   *   3. The bare key string (never silently swallows missing keys in dev)
   *
   * @param {string} key  - e.g. "nav.cta" or "form_success.heading"
   * @param {object} [vars] - e.g. { firstName: 'João' }
   * @returns {string}
   */
  function t(key, vars) {
    const raw = resolve(strings, key) ?? resolve(fallback, key) ?? key;
    return interpolate(raw, vars);
  }

  // ── DOM attribute protocol ─────────────────────────────────────────────────

  /**
   * Each entry maps a data-attribute name to the DOM property or attribute it
   * writes. Add new entry types here if new attribute conventions are needed.
   */
  const ATTR_MAP = [
    {
      attr:  'data-i18n',
      write: (el, str) => { el.textContent = str; },
    },
    {
      attr:  'data-i18n-html',
      write: (el, str) => { el.innerHTML = str; },
    },
    {
      attr:  'data-i18n-placeholder',
      write: (el, str) => { el.setAttribute('placeholder', str); },
    },
    {
      attr:  'data-i18n-aria-label',
      write: (el, str) => { el.setAttribute('aria-label', str); },
    },
    {
      attr:  'data-i18n-title',
      write: (el, str) => { el.setAttribute('title', str); },
    },
  ];

  /** Parse data-i18n-vars JSON safely, returning an object or null. */
  function parseVars(el) {
    const raw = el.getAttribute('data-i18n-vars');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  /**
   * Scan the live DOM and write the current locale's strings into every
   * element that carries a data-i18n-* attribute.
   * Safe to call repeatedly — each call is a full re-scan.
   */
  function applyDOM() {
    ATTR_MAP.forEach(({ attr, write }) => {
      document.querySelectorAll(`[${attr}]`).forEach(el => {
        const key = el.getAttribute(attr);
        if (key) write(el, t(key, parseVars(el)));
      });
    });
  }

  // ── MutationObserver ───────────────────────────────────────────────────────
  // Re-applies translations after React mounts or updates components that
  // carry data-i18n-* attributes. Debounced to batch rapid DOM mutations.

  let debounceTimer  = null;
  let domObserver    = null;

  /** All attribute names the observer should watch for. */
  const WATCHED_ATTRS = ATTR_MAP.map(h => h.attr);

  function scheduleApply() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyDOM, 40);
  }

  /** Test whether a node or any of its descendants carry an i18n attribute. */
  function hasI18nContent(node) {
    if (node.nodeType !== 1) return false; // element nodes only
    return WATCHED_ATTRS.some(attr =>
      node.hasAttribute(attr) || node.querySelector(`[${attr}]`) != null
    );
  }

  function startObserver() {
    if (domObserver) return;
    domObserver = new MutationObserver(mutations => {
      const relevant = mutations.some(m =>
        [...m.addedNodes].some(hasI18nContent)
      );
      if (relevant) scheduleApply();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ── html[lang] / html[dir] ─────────────────────────────────────────────────

  function applyHtmlAttributes(code) {
    const entry = SUPPORTED_LANGUAGES.find(l => l.code === code);
    const dir   = entry ? entry.dir : 'ltr';
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir',  dir);
  }

  // ── Internal event bus ─────────────────────────────────────────────────────

  function emit(event, detail) {
    (listeners[event] || []).forEach(fn => {
      try { fn(detail); } catch (err) { console.error('[i18n] listener error:', err); }
    });
    // Mirror to the DOM so non-module scripts can use addEventListener
    document.dispatchEvent(new CustomEvent(`i18n:${event}`, { detail, bubbles: false }));
  }

  function on(event, handler) {
    (listeners[event] ??= []).push(handler);
  }

  function off(event, handler) {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(fn => fn !== handler);
    }
  }

  // ── setLanguage ────────────────────────────────────────────────────────────

  /**
   * Load a locale, patch the DOM, and persist the choice.
   * All DOM-controlled strings update immediately; React components should
   * listen to the 'i18n:change' CustomEvent and re-render themselves.
   *
   * @param {string} code - BCP 47 language code, e.g. "en", "pt", "fr"
   * @returns {Promise<void>}
   */
  async function setLanguage(code) {
    const entry = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (!entry) {
      console.warn(`[i18n] Unsupported language code "${code}" — falling back to "${DEFAULT_LANG}".`);
      code  = DEFAULT_LANG;
    }

    try {
      // English is always the fallback locale; load it first if not cached
      fallback = cache[DEFAULT_LANG] ?? await loadLocale(DEFAULT_LANG);

      strings     = await loadLocale(code);
      currentLang = code;

      // If we loaded English as the active locale, make it its own fallback too
      if (code === DEFAULT_LANG) fallback = strings;

      try { localStorage.setItem(STORAGE_KEY, code); } catch { /* private browsing */ }

      applyHtmlAttributes(code);
      applyDOM();

      emit('change', {
        code,
        dir:   entry ? entry.dir   : 'ltr',
        label: entry ? entry.label : code,
      });

    } catch (err) {
      console.error('[i18n] setLanguage failed:', err);
    }
  }

  // ── init ───────────────────────────────────────────────────────────────────

  /**
   * Bootstrap the engine. Determines the starting language by checking
   * (in order): localStorage → browser language preference → DEFAULT_LANG.
   * Then loads the locale, patches the DOM, and starts the MutationObserver.
   *
   * Called automatically when the script loads. Safe to call again manually
   * (e.g. after hydration) — the locale is already cached so no re-fetch occurs.
   *
   * @returns {Promise<void>}
   */
  async function init() {
    let code = DEFAULT_LANG;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
        code = stored;
      } else {
        // Try to honour the browser's preferred language if we support it.
        // navigator.language is typically "pt-BR", "en-US", etc.; we match
        // on the primary subtag only ("pt", "en", …).
        const primary = (navigator.language || '').split('-')[0].toLowerCase();
        const match   = SUPPORTED_LANGUAGES.find(l => l.code === primary);
        if (match) code = match.code;
      }
    } catch { /* localStorage or navigator unavailable */ }

    await setLanguage(code);

    // Attach the observer after the first translation pass so it never fires
    // for the initial render
    if (document.body) {
      startObserver();
    } else {
      document.addEventListener('DOMContentLoaded', startObserver, { once: true });
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  window.i18n = Object.freeze({
    /**
     * Translate key → string.
     * @param {string}  key  - dot-separated path, e.g. "nav.cta"
     * @param {object} [vars] - interpolation vars, e.g. { firstName: 'João' }
     */
    t,

    /**
     * Switch the active language and repaint the page.
     * @param {string} code - e.g. "pt"
     * @returns {Promise<void>}
     */
    setLanguage,

    /** @returns {string} The active language code, e.g. "en" */
    getCurrentLang: () => currentLang,

    /**
     * @returns {{ code: string, label: string, dir: string }[]}
     * Array of all registered languages, in display order.
     */
    getLanguages: () => SUPPORTED_LANGUAGES.map(l => ({ ...l })),

    /**
     * Subscribe to engine events.
     * @param {'change'} event
     * @param {function} handler  - receives { code, dir, label }
     */
    on,

    /**
     * Unsubscribe a previously registered handler.
     * @param {'change'} event
     * @param {function} handler
     */
    off,

    /**
     * Re-scan the DOM and apply the current locale to all data-i18n-* elements.
     * Call this after programmatically inserting new translatable markup.
     */
    applyDOM,

    /**
     * Re-run language detection and load. Useful to call after React has
     * hydrated if the initial server render pre-empted auto-init.
     * @returns {Promise<void>}
     */
    init,
  });

  // ── Auto-init ──────────────────────────────────────────────────────────────
  // Runs automatically as soon as the DOM is ready. When loaded via Next.js
  // <Script strategy="afterInteractive">, the DOM is already available so
  // init() fires synchronously (as an async microtask).

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

}());
