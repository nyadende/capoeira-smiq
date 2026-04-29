# Capoeira International — Project Handoff Document

> This document captures the full context of the Capoeira International SMIQ funnel project — what was built, why decisions were made, all bugs fixed, and everything needed to continue development in a new thread.

---

## Project Overview

**Project name:** Capoeira International  
**Purpose:** An Ask Method SMIQ (Single Most Important Question) funnel — a community research tool that segments the Capoeira audience and captures their biggest challenges in their own words. The goal is insight-gathering, not selling.  
**Approach:** Community-first. No promises of resources or deliverables. Honest, warm, and inclusive across all levels of the art.

---

## File Structure

```
/
├── index.html               ← Landing page (Capoeira International)
├── capoeira-form.html       ← SMIQ lead capture form
├── capoeira-dashboard.html  ← Private AI analysis dashboard
└── README.md                ← Setup and technical documentation
```

All files are **self-contained vanilla HTML/CSS/JS**. No frameworks, no build step, no npm. Only external dependency is Google Fonts.

---

## Design System

Consistent across all three files:

| Token | Value | Usage |
|---|---|---|
| Background | `#0e0c09` | Page background (form/landing) |
| Card background | `#15120d` | Card surfaces |
| Gold | `#c8922a` | Primary accent, CTAs, headings |
| Gold light | `#e8b84b` | Hover states |
| Gold muted | `#6b4d1a` | Borders, subtle accents |
| Text | `#e8dfd0` | Body text |
| Text muted | `#8a7a65` | Secondary text, subtitles |
| Text dim | `#4a3f30` | Placeholders, hints |

**Typography:**
- `Playfair Display` (700/900 weight) — headings
- `Crimson Pro` (300/400/600) — body text
- `JetBrains Mono` — dashboard labels/data only

**Visual effects:** SVG grain texture overlay via `body::before`, radial gold gradient atmosphere via `body::after` / `.glow-top`.

**Segment colours:**

| Segment | Key | Colour |
|---|---|---|
| The Curious One | `curious` | `#c8922a` (gold) |
| The Student | `student` | `#4f8ef7` (blue) |
| The Practitioner | `practitioner` | `#9b6fd4` (purple) |
| The Teacher | `teacher` | `#e8843a` (orange) |
| The One Who Left | `lapsed` | `#7a8fa6` (steel blue) |

---

## File 1: `index.html` — Landing Page

**Purpose:** Community-feel landing page that introduces Capoeira International and directs visitors to the form.

**Sections:**
1. **Nav** — Fixed top bar with logo and "Join the Conversation" CTA linking to `capoeira-form.html`
2. **Hero** — Bold headline *"One art. Many journeys. One conversation."* with animated fadeUp entrance, scroll hint
3. **Who We Are** — Mission copy establishing lineage-neutrality, three pillar cards (Global Reach, No Agenda, All Levels)
4. **Who This Is For** — All five segments displayed as cards so every visitor sees themselves
5. **Why We're Asking** — Honest about the one-question format, four promise bullets, no fake resource promises
6. **Final CTA** — Second call to action before footer
7. **Footer** — Logo + tagline

**Key copy decisions:**
- No mention of resources being sent — honest about the research intent
- All five segments shown prominently so nobody feels excluded
- Tone: warm, inclusive, community-driven (not sales-y)

---

## File 2: `capoeira-form.html` — SMIQ Form

### Flow

```
Step 0: Segment picker (5 cards)
    ↓
Step 1: SMIQ open text (personalised per segment)
    ↓
Step 2: Teacher detail (TEACHER ONLY — all others skip)
    ↓
Step 3: Name + email capture
    ↓
Success screen
```

### Segments

| Segment key | Label | Icon | SMIQ question |
|---|---|---|---|
| `curious` | The Curious One | 🌱 | "When it comes to starting Capoeira, what is your single biggest challenge or frustration right now?" |
| `student` | The Student | 🎵 | "When it comes to growing in your Capoeira practice, what is your single biggest challenge or frustration right now?" |
| `practitioner` | The Practitioner | 🌀 | "When it comes to taking your Capoeira to the next level, what is your single biggest challenge or frustration right now?" |
| `teacher` | The Teacher | 🪘 | "When it comes to teaching Capoeira and growing your school or group, what is your single biggest challenge or frustration right now?" |
| `lapsed` | The One Who Left | 🌙 | "You trained Capoeira and then stepped away — what was the single biggest reason you left?" |

The lapsed card spans full width (2-column grid) as a 5th card beneath the 2×2 grid.

### Teacher Detail Step (Step 2)

Only shown for `segment === 'teacher'`. Two grids, both required to continue:

**Teaching situation (2×2 grid):**
| Value | Label |
|---|---|
| `classes` | I teach classes / Affiliated with someone else's school |
| `own-school` | I teach & run my own school or group |
| `admin` | I run a school but don't teach regularly |
| `online` | I teach primarily online |

**Graduation level (2×3 grid):**
| Value | Label |
|---|---|
| `monitor` | Monitor / Instructor |
| `professor` | Professor |
| `contra-mestre` | Contra-Mestre |
| `mestre` | Mestre / Fully graduated master |
| `grao-mestre` | Grão-Mestre / Grand master |
| `ungraded` | Not formally graded / Self-taught or community teacher |

### Step Dots

- Non-teachers: 3 dots (steps 0, 1, 3)
- Teachers: 4 dots (steps 0, 1, 2, 3)
- The teacher dot (index 2) is hidden via `.hidden` class for non-teacher segments
- Active dot: 48px wide gold; completed dots: 28px gold-muted; inactive: 28px dim

### Routing Logic

```js
const isTeacher = () => state.segment === 'teacher';
const isLapsed  = () => state.segment === 'lapsed';

function goNext() {
  const next = state.currentStep + 1;
  if (next === 2 && !isTeacher()) renderStep(3); // skip teacher step
  else renderStep(next);
}

function goBack() {
  const prev = state.currentStep - 1;
  if (prev === 2 && !isTeacher()) renderStep(1); // skip back over teacher step
  else renderStep(prev);
}
```

### Animation Restart Trick

Every step transition uses a forced reflow to restart the `fadeUp` CSS animation:

```js
function renderStep(index) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const card = $('main-card');
  void card.offsetWidth; // forces reflow — animation restarts
  const el = $(`step-${index}`);
  if (el) el.classList.add('active');
  state.currentStep = index;
  updateDots();
}
```

### Supabase Submission

```js
const payload = {
  name, email, segment, segment_label, smiq_answer,
  teaching_role:    isTeacher() ? state.teachingRole    : null,
  graduation_level: isTeacher() ? state.graduationLevel : null,
  created_at: new Date().toISOString(),
};

fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=minimal',
  },
  body: JSON.stringify(payload),
});
```

### Success Screen

- Heading: `Axé, [name]!`
- Default message: *"Thank you for sharing. We read every response personally and your answer will help shape something genuinely useful for the Capoeira community."*
- Lapsed message: *"Thank you for sharing your story. Understanding why people step away matters deeply — your answer will be read carefully."*
- Shows segment badge (icon + label)
- No email confirmation line, no mention of resources

### Configuration Block

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
const TABLE             = 'smiq_responses';
```

---

## File 3: `capoeira-dashboard.html` — Analysis Dashboard

**Private — do not publish publicly.** Contains Anthropic API calls from the browser.

### Config Panel

Inputs entered at runtime (not hardcoded):
- Supabase URL
- Supabase Anon Key
- Response limit: 100 / 250 / 500 / 1000 / All
- Segment filter: All / Beginners / Students / Practitioners / Teachers

### Load Data

Fetches from Supabase REST API with optional limit and segment filter. Renders:
- Stats bar: total + per-segment counts
- Raw data table (max 200 rows displayed, note shown if truncated)

### AI Analysis

Calls `https://api.anthropic.com/v1/messages` with model `claude-sonnet-4-20250514`.

- Sends up to 150 answers per segment
- Requests strict JSON — no markdown fences
- Parses response and renders theme cards with animated progress bars

**Expected JSON structure from Claude:**
```json
{
  "strategicSummary": "3-4 sentence cross-segment insight",
  "segments": {
    "curious": {
      "themes": [
        {
          "name": "Theme name (3-6 words)",
          "pct": 42,
          "insight": "One actionable insight sentence.",
          "quote": "Verbatim example quote."
        }
      ]
    },
    "student": { "themes": [...] },
    "practitioner": { "themes": [...] },
    "teacher": { "themes": [...] }
  }
}
```

- 3–5 themes per segment
- Gold-bordered Strategic Summary card shown at top
- 2×2 segment analysis grid below
- Progress bars animate in after render (100ms delay)
- Button changes to "✦ Re-run Analysis" after first run

### Dashboard Segment Colours

| Segment | Colour |
|---|---|
| Curious / Beginner | `#2ecc8a` (green) |
| Student | `#4f8ef7` (blue) |
| Practitioner | `#9b6fd4` (purple) |
| Teacher | `#e8843a` (orange) |

---

## Supabase Setup

### Table SQL

```sql
create table smiq_responses (
  id               bigint generated always as identity primary key,
  created_at       timestamptz default now(),
  name             text,
  email            text,
  segment          text,
  segment_label    text,
  smiq_answer      text,
  teaching_role    text,
  graduation_level text
);
```

### RLS Insert Policy

RLS is on by default. Run this or create via the dashboard UI:

```sql
create policy "anon_insert"
on "public"."smiq_responses"
as PERMISSIVE
for INSERT
to anon
with check (
  true
);
```

Via UI: **Table Editor → smiq_responses → RLS Policies → New Policy → INSERT → Target role: anon → WITH CHECK: `true`**

**This policy is required.** Without it, form submissions return a 401 error:
```
{"code":"42501","message":"new row violates row-level security policy for table \"smiq_responses\""}
```

---

## Bugs Fixed During Development

### 1. Script parse error — apostrophes in single-quoted strings

**Error:** `Uncaught Error: Script error.` / `Unexpected identifier 't'`

**Cause:** Placeholder strings containing contractions (`don't`, `I'm`) were wrapped in single quotes in JS, causing the apostrophes to terminate the string early.

**Fix:** Switched those specific strings to double-quoted JS strings:
```js
// BROKEN
placeholder: 'e.g. I don't know where to find...',

// FIXED
placeholder: "e.g. I don't know where to find...",
```

**Rule to remember:** Never use single-quoted JS strings for any text that might contain apostrophes or contractions.

### 2. Supabase 401 RLS error

**Error:** `Server error 401: {"code":"42501","message":"new row violates row-level security policy..."}`

**Cause:** Supabase enables RLS by default. There was no INSERT policy for the `anon` role, so all inserts were blocked.

**Fix:** Add the `anon_insert` policy (see Supabase Setup above). The `with check (true)` expression means "always allow" — no conditions needed for anonymous public inserts.

---

## Key Technical Principles

- **Zero inline `onclick` attributes** — all event listeners use `addEventListener`
- **No frameworks** — vanilla HTML/CSS/JS only
- **Animation restart** — `void card.offsetWidth` reflow trick required to restart CSS keyframe animations on repeated step transitions
- **Routing skips** — `goNext()` and `goBack()` both account for the teacher-only step (index 2), skipping it in both directions for all non-teacher segments
- **Lapsed segment** is treated as a non-teacher for all routing purposes
- **JS string literals** — use double quotes for any string that may contain apostrophes
- **Supabase anon key** is safe to expose in frontend code for INSERT-only use cases with RLS configured correctly

---

## Claude Code Setup (resolved)

Claude Code was installed via Homebrew:

```bash
sudo chown -R $(whoami) /opt/homebrew/var/homebrew/locks
brew install claude-code
```

The permissions fix (`chown`) was needed before the install would complete. After install, run `claude` in any project directory to start a session.

---

## What's Working

- ✅ Landing page (`index.html`) live with all five sections
- ✅ Form (`capoeira-form.html`) — all five segments, teacher detail step, routing, animations
- ✅ Supabase connected and accepting submissions
- ✅ RLS policy configured (`anon_insert`)
- ✅ Success screen — clean thank-you, no false resource promises
- ✅ Dashboard (`capoeira-dashboard.html`) — data loading and AI analysis
- ✅ Mobile text sizes increased for readability
- ✅ All scripts parse cleanly (no syntax errors)

## Potential Next Steps

- Add the lapsed segment to the dashboard's segment filter and stats bar
- Deploy files to a hosting platform (Netlify, Vercel, or GitHub Pages all work — drag and drop the folder)
- Add the Capoeira International logo/wordmark once branding is finalised
- Consider a custom domain
- Once responses come in, run the dashboard AI analysis to identify the first themes
