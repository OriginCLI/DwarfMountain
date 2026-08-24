# Game-Inspired Prestige UI Preview Implementation Plan

> **For Codex:** Use the test-driven-development and verification-before-completion skills while executing this plan.

**Goal:** Add a switchable game-inspired Prestige UI preview while preserving the current interface as the default.

**Architecture:** Keep one React application and one profile store. Add a typed visual-mode preference at the app shell, expose an accessible mode switch, and apply the preview through a root data attribute plus preview-specific markup where CSS alone cannot express the approved composition. Keep the original selectors and styles unchanged outside the preview scope.

**Tech Stack:** React 19, TypeScript, Vite, modern CSS, Vitest, Testing Library, Playwright.

---

### Task 1: Add the reversible visual-mode switch

**Files:**

- Modify: `src/app/App.test.tsx`
- Modify: `src/app/App.tsx`

1. Add a test that expects the original mode on first render.
2. Add a test that switches to the game-inspired preview and back without losing route state.
3. Run the focused test and confirm it fails because the mode control does not exist.
4. Add a typed `VisualMode` state and an accessible two-state control.
5. Run the focused test and confirm it passes.

### Task 2: Add preview-specific structure and state hooks

**Files:**

- Modify: `src/app/App.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/features/prestige/PrestigePage.tsx`
- Modify: `src/features/prestige/PrestigeNode.tsx`

1. Add assertions for the preview root attribute and preview-only shell labels.
2. Run the focused test and confirm the new assertions fail.
3. Add semantic preview hooks without changing rank calculations or persistence.
4. Run the focused test and confirm it passes.

### Task 3: Build the game-inspired visual layer

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/features/prestige/prestige.css`

1. Add the original pixel mountain backdrop as responsive CSS geometry.
2. Add preview-scoped shell, navigation, panel, type, tier, node, tooltip, focus, and state styles.
3. Add the mobile three-column grid and stacked inspection layout.
4. Preserve all original styling when the preview attribute is absent.

### Task 4: Verify behavior and visual output

**Files:**

- Modify: `e2e/prestige.spec.ts`
- Update: `docs/verification/` screenshots and evidence only after successful browser checks.

1. Add a browser test that switches between both modes and edits a rank in preview mode.
2. Run unit tests, typecheck, and production build.
3. Run Playwright against desktop and mobile viewports.
4. Capture one batched desktop/mobile review round, fix observed defects once, and confirm once.
5. Run the Impeccable detector on changed UI targets.
6. Record the final review result without removing the original mode.
