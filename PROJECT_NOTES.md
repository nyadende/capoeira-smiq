# Capoeira SMIQ Funnel — Project Notes

> Living memory document. Update as decisions get made.
> Original v1 handoff is in `PROJECT_CONTEXT.md` (uploaded to first session).

## Snapshot (as of April 2026)

- **Live URL:** https://maltascapoeira.github.io/smiq/
- **Repo:** github.com/maltascapoeira/smiq (inferred from GH Pages URL)
- **Owner:** Nya, Malta Capoeira
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
| Hosting    | **Cloudflare Workers** (via OpenNext, decided 2026-07-21)    |
| Database   | **Neon Postgres** (decided)                                  |
| Auth       | Real email/password or magic-link login on the dashboard     |
| AI calls   | Server-side only, API key in env var                         |
| Email      | TBD — Resend is the obvious pick for Vercel + magic links    |

### Why Cloudflare Workers (decided 2026-07-21)

- Long-term hosting platform, moving off Vercel
- Deployed via `@opennextjs/cloudflare` (OpenNext's Cloudflare adapter) — Cloudflare
  doesn't yet have a "verified" first-party Next.js adapter, so this is their
  recommended integration path as of this build
- Good fit here: no `next/image`, no filesystem access, no edge-runtime-only code,
  and `@neondatabase/serverless` already talks to Neon over HTTP, so it works
  unmodified inside the Workers runtime
- R2-backed ISR/tag caching was intentionally skipped for now (no ISR/revalidation
  in this app yet) — see `open-next.config.ts` if that's needed later
- Deployed first to the free `*.workers.dev` subdomain; custom domain is still an
  open question (see below), to be wired up via Cloudflare once decided
- Neon's DB connection is independent of the hosting platform (plain connection
  string), so this move doesn't affect the database setup — only the one-click
  Vercel marketplace convenience is lost, no functional change

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

## Agentic engineering implementation plan

This project should adopt agentic engineering principles selectively: enough to
improve reliability, maintainability, and safety, without introducing unnecessary
complexity.

### Phase 1 — Stabilize the foundation

- Lock the core product requirements, user journeys, and content boundaries.
- Define the canonical data model for survey responses, segment routing, and
  dashboard outputs.
- Keep AI calls server-side only and enforce clear input/output schemas.
- Add basic validation, structured logging, and error handling around the form
  flow and AI integration.

### Phase 2 — Introduce process discipline

- Version prompts and track changes explicitly.
- Separate prompt templates from orchestration logic so changes are easier to
  review and test.
- Create a lightweight review checklist for prompt, schema, and workflow changes.
- Capture decisions in this file and in the repo docs so the system remains
  understandable over time.

### Phase 3 — Improve reliability and quality

- Add retries, fallbacks, and timeout handling for AI calls.
- Create a small evaluation set of expected outputs for the main survey and
  analysis flows.
- Log failures and quality issues so the system can be tuned based on real use.
- Introduce feature flags where AI behavior is still evolving.

### Phase 4 — Governance and iteration

- Define ownership for prompts, data schemas, and deployment decisions.
- Establish a simple release process for changes that affect user-facing copy or
  AI behavior.
- Review whether the project needs more formal testing, observability, or human
  review before scaling.
- Keep the implementation pragmatic: optimize for clarity, reproducibility, and
  trust rather than over-engineering.
