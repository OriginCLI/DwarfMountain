# Implementation Status

## Phase 0 — Research and installed-build extraction

| Gate | Status | Evidence |
| --- | --- | --- |
| Identify current target build | Complete | `research/current-version.md` records Steam build `24333424` without inventing a semantic version. |
| Record source hierarchy and provenance | Complete | `research/sources.md`. |
| Extract complete Prestige graph | Complete | 102 constructors in `src/data/prestige/prestige-build-24333424.json`. |
| Recover caps, costs, requirements, relationships, thresholds, and positions | Partial | Metadata is complete; live positions are verified for Tiers 1–5 (82 nodes). Tier 6 remains explicitly unverified until unlocked. |
| Keep extraction reproducible and read-only | Complete | `tools/extract-game-metadata/README.md`; raw output and inspector remain ignored under `.work/`. |
| Cross-check current game screen and runtime pricing | Complete | Live screen comparison and read-only save deltas documented in the extraction README. |

## Phase 1 — Foundation

| Gate | Status | Evidence |
| --- | --- | --- |
| React, TypeScript, Vite foundation | Complete | `package.json`, `src/main.tsx`, `vite.config.ts`. |
| Hash-route navigation | Complete | `src/app/App.tsx`, `src/app/App.test.tsx`. |
| Versioned player-profile contract | Complete | `src/domain/profile.ts`, `src/storage/profileStore.ts`. |
| Local persistence | Complete | Browser localStorage adapter with malformed-data guard and default-profile deduplication. |
| Prestige domain contracts | Complete | `src/data/prestige/types.ts`, `costs.ts`, and `src/domain/ranks.ts`. |
| Placeholder asset system | Complete | `src/data/assets/assetManifest.ts`, local-only `public/assets/game/`, and fallback SVG. |
| Automated and browser checks | Complete | Vitest, typecheck, production build, and Playwright foundation checks. |

## Phase 2 — Full Prestige UI

| Gate | Status | Evidence |
| --- | --- | --- |
| Render installed-build tree | Partial | Six tiers and 102 nodes render; exact seven-column order is live-verified for Tiers 1–5. Tier 6 is visibly labeled pending live verification. |
| Show verified node metadata | Complete | Tooltip exposes exact effect data, rank-limit formula, cost, tier/run/Ascension requirements, related nodes, and internal source references. |
| Edit finite and repeatable ranks | Complete | Click, visible decrement, right-click, Shift-click, and Ctrl+Shift row-fill with fixed and Ascension-scaled cap enforcement. |
| Persist build state locally | Complete | Prestige ranks and available PP use the Phase 1 profile store. |
| Represent locked tiers accessibly | Complete | Locked nodes remain non-purchasable but keyboard-focusable for metadata inspection. |
| Machine-readable snapshot and invariants | Complete | Snapshot plus tests for IDs, fixed/dynamic caps, costs, requirements, relationships, thresholds, and unique positions. |
| Desktop and compact browser verification | Complete | `docs/verification/prestige-desktop.png`, `prestige-mobile.png`, and `phase-2-browser-evidence.md`. |
| Proprietary asset boundary | Complete | The UI supports 102 explicitly authorized local Prestige PNGs under the ignored asset directory, with text fallback. No game art, audio, executable, saves, or raw extraction output is committed. |

## Later phases

Mechanics references, catalog content, prestige optimization, progression planning, diagnostics, and patch migration remain outside Phases 0–2. The Phase 2 tooltip labels optimizer guidance unavailable rather than fabricating a recommendation.
