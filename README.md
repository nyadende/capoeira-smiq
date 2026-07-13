# Capoeira International — SMIQ Funnel (v2)

A community research tool for the global Capoeira community. Segments visitors by their relationship to the art, then asks their single most important challenge in their own words.

Branded as **Capoeira International**, run by **Malta Capoeira**.

- **v1 (live):** https://maltascapoeira.github.io/smiq/
- **v2 (this repo):** Next.js rebuild, deployed on Vercel

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (tokens in `app/globals.css`) |
| Database | Neon Postgres via Vercel marketplace |
| ORM | Drizzle ORM (`drizzle-orm/neon-http`) |
| Email | Resend (response confirmation emails; dashboard magic-link auth pending — see Milestones) |
| Fonts | Playfair Display, Crimson Pro (via `next/font/google`) |
| Deploy | Vercel |

---

## Local development

```bash
git clone https://github.com/maltascapoeira/smiq.git
cd smiq
npm install
```

Create `.env.local` with:

```
DATABASE_URL=postgres://...

# Kit (ConvertKit) — server-side only
KIT_API_KEY=your_kit_api_key

# Segment tags
KIT_TAG_ID_BEGINNER=
KIT_TAG_ID_STUDENT=
KIT_TAG_ID_PRACTITIONER=
KIT_TAG_ID_TEACHER=
KIT_TAG_ID_LAPSED=

# Teacher role tags (applied when segment=teacher)
KIT_TAG_ID_ROLE_CLASSES=
KIT_TAG_ID_ROLE_OWN_SCHOOL=
KIT_TAG_ID_ROLE_ADMIN=
KIT_TAG_ID_ROLE_ONLINE=

# Graduation level tags (applied when segment=teacher)
KIT_TAG_ID_GRAD_MONITOR=
KIT_TAG_ID_GRAD_PROFESSOR=
KIT_TAG_ID_GRAD_CONTRA_MESTRE=
KIT_TAG_ID_GRAD_MESTRE=
KIT_TAG_ID_GRAD_GRAO_MESTRE=
KIT_TAG_ID_GRAD_UNGRADED=

# Resend — confirmation emails
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Kit tag IDs can be found in the Kit dashboard under **Subscribers → Tags**. If `KIT_API_KEY` is not set, the integration is silently skipped — Kit failures never block form submission.

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## Deploy to Vercel

> **Production deploy is blocked until M3 (dashboard + auth) lands.** The dashboard route must be auth-gated before it can go live — see Milestones and CLAUDE.md rule #2. Preview deploys are fine in the meantime.

1. **Link the project** (one-time):
   ```bash
   vercel link
   ```
2. **Add the Neon integration** via the Vercel marketplace (Storage → Neon) if not already connected. This gives each preview deploy its own database branch, cut from production.
3. **Sync env vars to Vercel**:
   ```bash
   bash scripts/sync-env-to-vercel.sh
   ```
   Pushes `.env.local` → the `preview` environment and `.env.production.local` → `production`. Requires the `vercel` CLI logged in and `vercel link` already run. Vercel system variables (`VERCEL_*`, `NEXT_RUNTIME*`) are skipped automatically.
4. **Push the schema to the production database** (only when the schema has changed):
   ```bash
   npm run db:push:prod
   ```
5. **Deploy**:
   ```bash
   vercel          # preview deploy
   vercel --prod   # production deploy — only after M3 auth is in place
   ```

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/smiq` | SMIQ survey form |

---

## Project structure

```
app/
  globals.css        # Design tokens + all component CSS
  layout.tsx         # Root layout (fonts, grain/glow overlays)
  page.tsx           # Landing page
  smiq/
    page.tsx         # /smiq server component shell
    SmiqForm.tsx     # Multi-step form (client component)
    actions.ts       # Server action — validates + inserts response
db/
  schema.ts          # Drizzle schema (smiq_responses table)
lib/
  db.ts              # Neon + Drizzle client
```

---

## Design system

Background `#0e0c09` · Surface `#15120d` · Gold `#c8922a` · Text `#e8dfd0`

Headings: Playfair Display · Body: Crimson Pro · Grain + radial gold glow overlays

---

## Security

The Anthropic API key is server-side only — never exposed to the browser. This was the central reason for the v1 → v2 rewrite.

---

## Milestones

- **M1** — Next.js scaffold, design tokens, Neon/Drizzle wired, landing page ported
- **M2** — SMIQ form: 4-step flow, segment picker, teacher branching, server action, success screen
- **M3** — Dashboard (private, auth-gated), AI analysis server-side *(pending)*
