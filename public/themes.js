/* ════════════════════════════════════════════════════════════════════════════
   themes.js — theme switcher for Capoeira International SMIQ
   Isolated: delete this file + app/themes.css to remove the feature entirely.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var THEMES = [
    { id: 'midnight-ink',    label: 'Midnight Ink'    },
    { id: 'desert-sand',     label: 'Desert Sand'     },
    { id: 'jade-forest',     label: 'Jade Forest'     },
    { id: 'cobalt-storm',    label: 'Cobalt Storm'    },
    { id: 'crimson-ritual',  label: 'Crimson Ritual'  },
    { id: 'ivory-dusk',      label: 'Ivory Dusk'      },
    /* ── Capoeira-specific ── */
    { id: 'roda-circle',     label: 'Roda Circle'     },
    { id: 'senzala-earth',   label: 'Senzala Earth'   },
    { id: 'maculele-fire',   label: 'Maculelê Fire'   },
    { id: 'praia-bahia',     label: 'Praia Bahia'     },
    { id: 'berimbau-bronze', label: 'Berimbau Bronze' },
  ];

  var VALID_IDS   = THEMES.map(function (t) { return t.id; });
  var STORAGE_KEY = 'capoeira-theme';
  var DEFAULT_ID  = 'midnight-ink';

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function readStorage() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function writeStorage(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function resolvedTheme() {
    var saved = readStorage();
    return (saved && VALID_IDS.indexOf(saved) >= 0) ? saved : DEFAULT_ID;
  }

  function applyTheme(id, animate) {
    var html = document.documentElement;
    if (animate) {
      html.classList.add('theme-transitioning');
      setTimeout(function () { html.classList.remove('theme-transitioning'); }, 320);
    }
    html.setAttribute('data-theme', id);
    writeStorage(id);
  }

  /* ── 1. Prevent flash-of-unstyled-theme (runs immediately) ───────────── */
  applyTheme(resolvedTheme(), false);

  /* ── 2. Dropdown logic ────────────────────────────────────────────────── */

  function mountDropdown() {
    var nav = document.querySelector('nav');
    if (!nav || document.getElementById('theme-switcher')) return;

    var current      = resolvedTheme();
    var currentTheme = THEMES.find(function (t) { return t.id === current; }) || THEMES[0];

    /* Build the switcher element */
    var el = document.createElement('div');
    el.id        = 'theme-switcher';
    el.className = 'theme-switcher';
    el.setAttribute('aria-label', 'Theme switcher');

    el.innerHTML =
      '<button class="theme-trigger" type="button"' +
              ' aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="theme-icon" aria-hidden="true">&#9680;</span>' +
        '<span class="theme-label">' + currentTheme.label + '</span>' +
        '<span class="theme-chevron" aria-hidden="true">&#9662;</span>' +
      '</button>' +
      '<ul class="theme-dropdown" role="listbox" aria-label="Select theme">' +
        THEMES.map(function (t) {
          var active = t.id === current;
          return (
            '<li role="option"' +
              ' aria-selected="' + active + '"' +
              ' data-tid="' + t.id + '"' +
              ' class="theme-option' + (active ? ' active' : '') + '">' +
              '<span class="theme-option-dot"></span>' +
              t.label +
            '</li>'
          );
        }).join('') +
      '</ul>';

    /* Wrap the switcher + existing .nav-cta into a .nav-actions flex group
       so both live on the right side of the nav.                           */
    var group = document.createElement('div');
    group.className = 'nav-actions';

    var cta = nav.querySelector('.nav-cta');
    nav.appendChild(group);     /* appended before moving cta, which is already in nav */
    group.appendChild(el);
    if (cta) group.appendChild(cta);

    /* ── Event wiring ───────────────────────────────────────────────────── */

    var trigger  = el.querySelector('.theme-trigger');
    var dropdown = el.querySelector('.theme-dropdown');
    var labelEl  = el.querySelector('.theme-label');

    /* Toggle open */
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = el.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Select a theme */
    dropdown.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-tid]');
      if (!opt) return;

      var id    = opt.getAttribute('data-tid');
      var theme = THEMES.find(function (t) { return t.id === id; });
      if (!theme) return;

      applyTheme(id, true);
      labelEl.textContent = theme.label;

      el.querySelectorAll('.theme-option').forEach(function (o) {
        var active = o.getAttribute('data-tid') === id;
        o.classList.toggle('active', active);
        o.setAttribute('aria-selected', String(active));
      });

      el.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });

    /* Close on outside click */
    document.addEventListener('click', function () {
      el.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── 3. Initial mount ─────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountDropdown);
  } else {
    mountDropdown();
  }

  /* ── 4. Re-mount after Next.js client-side navigation ──────────────────
     The nav in page.tsx is replaced on route changes.  A debounced
     MutationObserver re-runs mountDropdown whenever new nodes land in <body>. */
  var _debounce = null;
  var observer  = new MutationObserver(function () {
    if (_debounce) return;
    _debounce = setTimeout(function () {
      _debounce = null;
      if (document.querySelector('nav') && !document.getElementById('theme-switcher')) {
        mountDropdown();
      }
    }, 80);
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
