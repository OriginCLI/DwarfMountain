# Dwarf Eats Mountain Prestige Vertical Slice Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local-first, provenance-aware React companion through a source-verified Prestige profile editor.

**Architecture:** Domain data and calculations live outside React. `src/domain` defines versioned profiles, sources, effects, and rank transitions; `src/data` provides immutable game snapshots; `src/storage` owns versioned local persistence. The interface reads a derived view model so the later optimizer can use the same data without coupling to UI state.

**Tech Stack:** React, TypeScript, Vite, Vitest, Playwright, CSS, browser localStorage.

---

## Design decisions

- **Visual direction:** a coal-black mine ledger with oxidized copper frames, gemstone status lights, square pixel corners, and deliberately dense tier rails. It is a game companion, not a SaaS dashboard.
- **Data boundary:** factual data records carry sources and confidence. A `derived` effect cites the inputs and derivation. A future recommendation is a separate `heuristic` record.
- **Asset boundary:** `public/assets/game/.gitkeep` remains empty. `assetManifest.ts` maps semantic icon IDs to local optional paths and generated fallback glyphs.
- **Interaction boundary:** left click increments one owned rank, Shift+click increments up to three, Ctrl+Shift+click fills legal nodes in a tier from left to right, and context-menu/right click decrements. All operations are capped and local to the companion profile.

### Task 1: Establish the source-data gate

**Files:**
- Create: `tools/extract-game-metadata/README.md`
- Create: `tools/extract-game-metadata/verify-local-build.ps1`
- Test: `tests/data/source-records.test.ts`

1. Write a failing test requiring every displayed Prestige record to include a source, game-build identity, confidence, and no unresolved numeric field.
2. Run `npm run test -- tests/data/source-records.test.ts`; expect the test runner to be unavailable before foundation setup.
3. Add only the local-build verifier and its non-redistribution guard.
4. Re-run the verifier; it must report build ID and no copied source files.
5. Commit the research/source gate with Phase 0 reports.

### Task 2: Scaffold the checked TypeScript application

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/styles/global.css`
- Create: `src/test/setup.ts`

1. Write a failing render test for an app shell with a labelled Prestige navigation target.
2. Run the focused Vitest test and observe the expected missing-module failure.
3. Create the smallest Vite/React app that renders the shell.
4. Run typecheck, focused test, and production build.
5. Commit the Phase-1 scaffold only after fresh output shows all three gates pass.

### Task 3: Define source, profile, and Prestige contracts

**Files:**
- Create: `src/domain/source.ts`, `src/domain/prestige.ts`, `src/domain/profile.ts`
- Create: `src/domain/ranks.ts`
- Test: `src/domain/ranks.test.ts`

1. Write failing tests for one-rank increment, capped increment, decrement at zero, and deterministic tier bulk fill.
2. Run the focused test; confirm failure is due to missing rank functions.
3. Implement pure rank functions with immutable inputs.
4. Re-run focused and full unit tests.
5. Commit the domain model.

### Task 4: Add versioned local persistence

**Files:**
- Create: `src/storage/profileStore.ts`
- Create: `src/storage/profileMigrations.ts`
- Test: `src/storage/profileStore.test.ts`

1. Write failing tests for a round trip, invalid data rejection, and schema migration.
2. Verify RED.
3. Implement a small storage adapter injectable for tests and backed by localStorage in the browser.
4. Verify GREEN and typecheck.
5. Commit the storage slice.

### Task 5: Introduce the asset manifest and sourced data snapshot

**Files:**
- Create: `public/assets/game/.gitkeep`
- Create: `src/data/assets/assetManifest.ts`
- Create: `src/data/prestige/installed-build.ts`
- Create: `src/data/prestige/validate.ts`
- Test: `src/data/prestige/validate.test.ts`

1. Write a failing test for duplicate IDs, colliding positions, invalid ranks/costs, missing source, and unresolved icon mappings.
2. Verify RED.
3. Add only records whose graph fields have passed the extraction gate; mark deferred records outside the render set.
4. Verify GREEN.
5. Commit the sourced data slice.

### Task 6: Build the Prestige tree and accessible tooltip

**Files:**
- Create: `src/features/prestige/PrestigePage.tsx`
- Create: `src/features/prestige/PrestigeNode.tsx`
- Create: `src/features/prestige/PrestigeTooltip.tsx`
- Create: `src/features/prestige/prestige.css`
- Test: `src/features/prestige/PrestigePage.test.tsx`

1. Write failing behavior tests for click, Shift+click, Ctrl+Shift+click, decrement, PP total, focus tooltip, and disabled/locked state.
2. Verify RED.
3. Implement the minimal composed UI against pure domain functions.
4. Verify GREEN and run an accessibility-focused test.
5. Commit the interaction slice.

### Task 7: Add browser workflows and visual evidence

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/prestige.spec.ts`
- Create: `docs/verification/phase-2-browser-evidence.md`

1. Write Playwright tests for editing a rank, reload persistence, tooltip access, and compact viewport layout.
2. Run them against a real local Vite server; observe the initial failure before implementation.
3. Fix only application code necessary for the workflow.
4. Capture and inspect desktop and mobile screenshots; document exact viewport, observed controls, and remaining visual-reference limitation.
5. Run `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`; commit Phase 2 only with fresh passing evidence.

## Execution order and stop conditions

Do not start Task 5 or Task 6 until the canonical current-build Prestige graph supplies every rendered node's ID, cost, rank cap, tier, position, requirements, effect, icon mapping, and provenance. Do not start the optimizer in this plan. Before executable work, create an isolated `codex/` branch/worktree from an initial Phase-0 commit; the repository has no commits yet, so this requires establishing the Phase-0 baseline first.
