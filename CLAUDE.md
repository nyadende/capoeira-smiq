# Capoeira SMIQ Funnel

Single-most-important-question survey for the global Capoeira community.
Branded "Capoeira International," run by Malta Capoeira.

- **Live (v1):** https://maltascapoeira.github.io/smiq/
- **Repo:** github.com/maltascapoeira/smiq
- **Owner:** Paul (paulsmith@me.com)

## Stack (v2 rebuild in progress)

- **Next.js** (App Router) on **Vercel**
- **Neon Postgres** (via Vercel marketplace integration)
- **Resend** for magic-link auth on the dashboard (likely)
- All Anthropic API calls server-side, key in env vars only

V1 exposed the Anthropic key in browser code. That is the central reason for
the rewrite. Don't recreate it.

## Reference docs

- `PROJECT_CONTEXT.md` — full v1 build (architecture, segment copy, history)
- `PROJECT_NOTES.md` — living memory. Update it when a real decision is made.

## Inviolable rules

1. Anthropic API key is server-side only. No exceptions.
2. The dashboard is private. Auth before any production deploy.
3. Preserve the five segments and their exact SMIQ wording (see
   `PROJECT_CONTEXT.md`). The Lapsed segment routes as a non-teacher and gets
   different success copy.
4. Tone is community-first. No sales language, no resource promises that
   won't be delivered.
5. Design system: `#0e0c09` background, `#c8922a` gold, Playfair Display +
   Crimson Pro, SVG grain overlay, gold radial glow.

## Conventions

- TypeScript everywhere
- Server actions or route handlers for every write
- Secrets in env vars — never committed, never logged
- Small, focused commits

## Next.js notes

@AGENTS.md
