# RxNext product pass handoff

**Branch:** `cursor-product-pass`  
**Remote tip (pre-review-fix):** `890eecb04a72b210970cd01e778e82be9bc8d432`  
**Base:** `main` @ `5872798`  
**Status:** On GitHub. Review/stabilize before merge. Do **not** merge or alter Vercel production without approval.

## What changed and why

Broad product-pass redesign to make RxNext feel like an enterprise PBM intelligence workspace (consulting clarity + Databricks density + Figma craft) while preserving the core vision: reporting, object-level investigation, solution evaluation, lineage, and write-back style actions.

1. **Foundation** — Plus Jakarta Sans + IBM Plex Mono, global canvas tokens, product metadata aligned to “pharmacy benefit intelligence.”
2. **Shared chrome** — `AppShell` unifies top nav (Reports / Opportunities / Actions), org chip, and context rail across `/` and `/solutions`.
3. **Reports (`/`)** — Executive report shell: left report rail, KPI strip, net-paid trend, attention queue, variance drivers, selected-object evidence, and claim lineage table. “Create opportunity” writes to `localStorage`.
4. **Opportunities (`/solutions`)** — Portfolio pipeline + decision workspace (Candidates → Diligence → Economics → Decision gates). Economics keys off the selected opportunity’s annual exposure. Portfolio merges seed opportunities with locally created ones from Reports.
5. **Mobile** — Primary nav remains reachable under 980px. Opportunity rows and report rail collapse sensibly.

## Important design and architecture decisions

- **One product CSS surface** (`src/app/product.css`) drives both pages; removed unused `solutions.module.css`.
- **Shared data modules** under `src/lib/`: `report-data.ts`, `opportunities.ts`, `format.ts`, plus existing `solutions.ts`.
- **Nav labels:** Reports / Opportunities / Actions (Actions disabled “coming soon”).
- **Visual language:** light ops canvas, dark top chrome, blue accent, tabular mono for figures.
- **No backend / auth / Vercel changes** in this pass; decision and opportunity write-backs remain client `localStorage`.

## Files and dependencies added or removed

**Added:** `src/components/AppShell.tsx`, `src/lib/format.ts`, `src/lib/report-data.ts`, `src/lib/opportunities.ts`, `scripts/review-smoke.mjs`, `HANDOFF.md`  
**Removed:** `src/app/solutions/solutions.module.css`  
**Dependencies:** No new runtime deps (Next 16.4.3 / React 19 / Tailwind 4).

## Controlled review completed (pre-PR)

| Check | Result |
| --- | --- |
| Diff vs `main` | 12 files; Reports + Opportunities redesign + shared libs |
| `npm run lint` | Pass |
| `npm run build` | Pass (static `/`, `/solutions`) |
| Playwright smoke desktop 1440×900 | Pass — lineage, create opportunity, portfolio, candidates, diligence note, economics sliders, 7 gates |
| Playwright smoke mobile 390×844 | Pass — same flows |
| Screenshots | `/opt/cursor/artifacts/screenshots/review-{desktop,mobile}-{reports,workspace}.png` |

## Stabilization fixes after review

- Harden Reports `createOpportunity` storage (try/catch + richer payload).
- Opportunities portfolio now surfaces locally created opportunities from Reports.
- Dynamic “active opportunities” count.
- Refresh HANDOFF after successful GitHub push + review.

## Known issues / unfinished work

- **Actions** tab is a stub (disabled).
- Chrome buttons (Portfolio brief, Methodology, Share, Export, Change scope, data health) are non-functional.
- Diligence stage `<select>` does not yet filter candidates.
- Persistence is demo-only (`localStorage`).
- Mobile hides report left rail under 720px.
- No CI unit/e2e suite in-repo yet (smoke script is manual/local).

## Recommended next steps (post-merge)

1. Replace demo data with a **provider-based data layer** for a safe work dataset connection.
2. Real **Actions** write-back (RFI, shortlist, gate advance + audit log).
3. Add Vitest/Playwright to CI using `scripts/review-smoke.mjs` patterns.
4. Deep-link `?opp=` from Reports → Opportunities.

## Exact final commit SHA

See tip of `cursor-product-pass` after the review-stabilize commit (`git rev-parse origin/cursor-product-pass`).
