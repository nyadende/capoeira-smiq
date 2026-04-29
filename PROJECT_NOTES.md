# Capoeira SMIQ Funnel — Project Notes

> Living memory document. Update as decisions get made.
> Original v1 handoff is in `PROJECT_CONTEXT.md` (uploaded to first session).

## Snapshot (as of April 2026)

- **Live URL:** https://maltascapoeira.github.io/smiq/
- **Repo:** github.com/maltascapoeira/smiq (inferred from GH Pages URL)
- **Owner:** Paul (paulsmith@me.com), Malta Capoeira
- **Brand:** "Capoeira International" — addresses the global Capoeira community,
  run from Malta
- **Status:** Site is live, but Supabase project is paused due to non-usage.
  Only 0–10 responses collected — no meaningful data to migrate. About to be
  re-architected from static HTML to a full-stack Node app.

## Why we're rebuilding

1. **Tech stack feels limiting.** Vanilla HTML/CSS/JS with no build step makes
   future features hard to add.
2. **Anthropic API key exposed in browser.** `capoeira-dashboard.html` calls
   `https://api.anthropic.com/v1/messages` directly from client code — the key
   is visible to anyone viewing source. A Node backend keeps the key server-side.

## Target architecture (v2)

| Concern    | Choice                                                       |
|------------|--------------------------------------------------------------|
| Framework  | **Next.js** (App Router)                                     |
| Hosting    | **Vercel**                                                   |
| Database   | **Neon Postgres** (decided)                                  |
| Auth       | Real email/password or magic-link login on the dashboard     |
| AI calls   | Server-side only, API key in env var                         |
| Email      | TBD — Resend is the obvious pick for Vercel + magic links    |

### Why Neon (decided 2026-04-28)

- First-class Vercel marketplace integration (one-click)
- Serverless Postgres, scales to zero (free tier easily covers this funnel)
- Plain Postgres — no vendor SDK lock-in, no RLS complexity (not needed once
  API is server-side)
- Database branching for staging/preview deploys

## What to carry forward from v1

The existing build is well-thought-through. v2 should preserve:

- **Five segments** with exact SMIQ wording (Curious, Student, Practitioner,
  Teacher, Lapsed) — copy lives in `PROJECT_CONTEXT.md`
- **Teacher-only branching:** teaching situation (4 options) + graduation level
  (6 options including "ungraded")
- **Lapsed segment treated as non-teacher** for routing
- **Design system:** warm dark palette (`#0e0c09` bg, `#c8922a` gold),
  Playfair Display + Crimson Pro typography, SVG grain overlay, gold radial glow
- **Tone:** community-first, no fake resource promises, no sales language
- **Success screen:** "Axé, [name]!" with segment-specific copy (lapsed gets
  a different, more reflective message)
- **Dashboard analysis JSON schema:** `strategicSummary` + per-segment themes
  (3–5 themes, each with `name` / `pct` / `insight` / `quote`)

## Bugs already fixed (don't reintroduce)

1. **Apostrophes in single-quoted JS strings** broke parsing — moot in JSX/TSX
2. **Supabase RLS 401 on insert** — no longer relevant once API is server-side

## Open questions (resolve as we go)

- **Multi-language?** Capoeira is Portuguese-rooted; Malta is multilingual —
  worth considering EN/PT/ES at minimum
- **Add lapsed to the dashboard analysis** (was missing in v1's prompt)
- **Custom domain?** Currently on github.io subdomain
- **Branding:** is the Capoeira International wordmark/logo finalised?
- **Email provider** for magic-link auth (Resend recommended)
- **Migration of the 0–10 existing responses** — worth keeping or throwaway?

## Working preferences

- Paul wants strategy and re-architecture suggestions, not just code execution
- The codebase lives in a Git repo (not the local workspace folder), so file-level
  edits will need either repo access or working from copied snippets
