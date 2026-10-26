# RxNext product pass handoff

**Branch:** `cursor-product-pass`  
**Product UI commit:** `137978eda9a74356d8166c54cbfe5dee988389f4`  
**Final commit SHA:** see Exact final commit SHA below  
**Base:** `main` @ `5872798`  
**Do not merge or alter Vercel production from this pass.**

## What changed and why

Broad product-pass redesign to make RxNext feel like an enterprise PBM intelligence workspace (consulting clarity + Databricks density + Figma craft) while preserving the core vision: reporting, object-level investigation, solution evaluation, lineage, and write-back style actions.

1. **Foundation** — Plus Jakarta Sans + IBM Plex Mono, global canvas tokens, product metadata aligned to “pharmacy benefit intelligence.”
2. **Shared chrome** — `AppShell` unifies top nav (Reports / Opportunities / Actions), org chip, and context rail across `/` and `/solutions`.
3. **Reports (`/`)** — Executive report shell: left report rail, KPI strip, net-paid trend, attention queue, variance drivers, selected-object evidence, and claim lineage table. “Create opportunity” still writes to `localStorage`.
4. **Opportunities (`/solutions`)** — Portfolio pipeline + decision workspace (Candidates → Diligence → Economics → Decision gates) kept intact; economics now keys off the selected opportunity’s annual exposure; money formatting centralized.
5. **Mobile** — Primary nav remains reachable under 980px (was previously hidden). Opportunity rows and report rail collapse sensibly.

## Important design and architecture decisions

- **One product CSS surface** (`src/app/product.css`) drives both pages; removed unused `solutions.module.css`.
- **Shared data modules** under `src/lib/`: `report-data.ts`, `opportunities.ts`, `format.ts`, plus existing `solutions.ts`.
- **Nav labels:** Reports / Opportunities / Actions (Actions disabled “coming soon”).
- **Visual language:** light ops canvas, dark top chrome, blue accent, tabular mono for figures — not a purple/cream marketing look.
- **No backend / auth / Vercel changes** in this pass; decision and opportunity write-backs remain client `localStorage`.

## Files and dependencies added or removed

**Added**

- `src/components/AppShell.tsx`
- `src/lib/format.ts`
- `src/lib/report-data.ts`
- `src/lib/opportunities.ts`
- `HANDOFF.md`

**Modified**

- `src/app/layout.tsx`, `src/app/globals.css` (foundation commit)
- `src/app/page.tsx`
- `src/app/product.css`
- `src/app/solutions/page.tsx`
- `package-lock.json` (foundation)

**Removed**

- `src/app/solutions/solutions.module.css` (unused)

**Dependencies**

- No new runtime dependencies. Still Next 16.4.3 / React 19 / Tailwind 4.

## Tests and verification completed

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run build` | Pass (static `/` and `/solutions`) |
| HTTP smoke | `200` on `/` and `/solutions` with expected copy |
| Desktop screenshots | `/opt/cursor/artifacts/screenshots/home-desktop.png`, `solutions-desktop.png` |
| Mobile screenshots | `home-mobile.png`, `solutions-mobile.png` |

Notes on visual verify: headless Chrome sometimes hangs after writing the PNG (timeout exit 124); files still landed and were reviewed. Interactive workspace tabs / Create opportunity were not fully exercised in a live browser agent (spend limit); logic unchanged from prior decision pipeline.

## Known issues or unfinished work

- **Actions** tab is a stub (disabled).
- **Portfolio brief / Methodology / Share / Export / Change scope / data health** buttons are non-functional chrome.
- Diligence stage filter `<select>` does not yet filter candidates.
- Opportunity / decision persistence is demo-only (`localStorage`), not multi-user or server-backed.
- Mobile still hides the report left rail under 720px (views switch via header only on desktop-width).
- No automated unit/e2e tests in this repo yet.
- Headless screenshot tooling is flaky in this environment.

## Recommended next steps

1. Wire **Create opportunity** from Reports into the Opportunities portfolio (read shared storage / URL deep-link `?opp=`).
2. Implement a real **Actions** surface for write-back (RFI send, shortlist, gate advance with audit log).
3. Add Vitest/Playwright for portfolio open → diligence → economics → gate advance.
4. Replace static report figures with a claims API / warehouse slice when available.
5. Review and merge `cursor-product-pass` after stakeholder design pass; deploy via normal Vercel preview → production promotion (not from this agent).

## Exact final commit SHA

- Product UI: `137978eda9a74356d8166c54cbfe5dee988389f4`
- Handoff docs: `ce4ed1978ba43c84fb7434c2f3f9c2c5b451d49f`
- Branch tip (checkout this): `a4fcb0e89a373604ecd277422b92e162bf22d0b8`
