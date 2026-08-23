# Phase 2 Browser Evidence

Verified on 2026-08-23 with Playwright 1.62.1 against locally installed Chrome and the Vite development server.

## Automated checks

- The Prestige route renders six tier rails and exactly 102 node buttons.
- A rank edit updates the PP total and survives a full page reload through local storage.
- Focusing an unlocked node exposes exact installed-build effect and source text in the tooltip.
- Focusing a locked node exposes its exact tier threshold while `aria-disabled` prevents purchasing it.
- The Ascension Rank editor updates an installed per-Ascension purchase cap, and the tooltip exposes the formula and hard maximum.
- Every owned node has a visible decrement control usable by mouse, keyboard, or touch; right-click remains available.
- The compact `390 × 844` viewport retains horizontally scrollable tier rails and a visible PP editor.
- The desktop flow recorded no browser console errors.

## Captures

- [Desktop Prestige planner](./prestige-desktop.png) — default Playwright viewport, full-page capture after one persisted rank purchase.
- [Compact Prestige planner](./prestige-mobile.png) — `390 × 844` viewport, full-page capture.

These images show the companion's original UI and generated text-glyph placeholders. No image from the installed game is present in either capture or in the repository.

## Command

```powershell
$env:PLAYWRIGHT_CHROME_EXECUTABLE = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:e2e
```

The tree structure was separately compared with the normally opened installed-game Prestige screen. The comparison confirmed the 102-node tier counts, row shapes, and unlock thresholds; proprietary screen captures were not retained.
