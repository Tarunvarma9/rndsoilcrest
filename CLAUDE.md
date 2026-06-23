# Soil Crest Naturals — R&D Dossier

## What this is
A confidential, access-gated web application that serves as the product roadmap and AI research platform for Soil Crest Naturals, an Indian superfood brand. It visualises the R&D pipeline for Daily Health Mix across 8 product formats, and embeds 6 live Claude-powered agents that visitors can consult for real product research.

## Target user
Solo founder + internal team. Not a public product. Gate keeps it internal.

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Anthropic Claude API (`claude-sonnet-4-6`)
- Vercel deployment

## Design system — Galaxy Edition
| Token | Value | Use |
|---|---|---|
| `--void` | `#020014` | Page background |
| `--ash` | `#0D0A1E` | Cards / panels |
| `--bone` | `#F0EEFF` | Primary text |
| `--bone-muted` | `#9B93C4` | Secondary text |
| `--violet` | `#8B5CF6` | Primary accent (Claude purple) |
| `--cyan` | `#22D3EE` | Secondary accent |
| `--pink` | `#D946EF` | Tertiary accent |

Fonts: Fraunces (display) · Inter (body) · JetBrains Mono (labels/mono)

## Key files
| File | Purpose |
|---|---|
| `src/app/page.tsx` | Entry — checks `sc_access` cookie, shows gate or dossier |
| `src/app/api/unlock/route.ts` | POST — validates ACCESS_CODE, sets HttpOnly cookie |
| `src/app/api/agent/route.ts` | POST — validates agentId, builds system prompt, calls Anthropic |
| `src/lib/formats.ts` | Ground-truth data for all 8 product formats |
| `src/components/marketing/access-gate.tsx` | FIG. 00 — the gate UI |
| `src/components/marketing/dossier.tsx` | FIG. 01–09 — the dossier grid |
| `src/components/marketing/fig-modal.tsx` | Format detail modal |
| `src/components/marketing/agent-console.tsx` | FIG. 09 — live agent chat |

## Business logic invariants — never break
1. `ANTHROPIC_API_KEY` must never appear in client bundle (`NEXT_PUBLIC_*` is forbidden)
2. `ACCESS_CODE` must never be compared client-side — only in `/api/unlock`
3. `agentId` must always be validated against the server-side allow-list before use
4. COMPLIANCE agent must always append a disclaimer to consult a licensed consultant
5. `max_tokens` capped at 1000 per agent call

## Local dev
```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
```

## Environment variables
Set in `.env.local` (local) and Vercel dashboard (production):
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `ACCESS_CODE` — change from default before going live
- `NEXT_PUBLIC_APP_URL` — production URL once deployed

## Build phases (from master prompt)
- [x] Phase 0 — Scaffold
- [ ] Phase 1 — Port dossier design from App.jsx reference
- [ ] Phase 2 — Access gate wired and working
- [ ] Phase 3 — Agent backend with 6 system prompts
- [ ] Phase 4 — Agent Console UI (FIG. 09)
- [ ] Phase 5 — Polish (mobile, a11y, reduced-motion)
- [ ] Phase 6 — Deploy to Vercel
