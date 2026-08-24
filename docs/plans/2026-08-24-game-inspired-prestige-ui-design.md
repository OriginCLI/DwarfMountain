# Game-Inspired Prestige UI Design

## Status

Approved in conversation on August 24, 2026. This document defines the visual redesign before implementation.

## Scope

Redesign the Prestige planner and the app shell visible around it. Preserve the existing data, profile persistence, rank editing, source labels, keyboard behavior, reduced-motion support, and explicit uncertainty around unverified Tier 6 positions.

This pass does not redesign unfinished companion routes or add optimizer behavior.

## Direction

Build a standalone companion interface inspired by *Dwarf Eats Mountain*. The app must feel related to the game without looking like an overlay placed over active gameplay or a screenshot replica.

The game supplies the visual language:

- icy slate-blue interface fields;
- dark navy outlines and hard pixel edges;
- white pixel lettering with dark offset shadows;
- yellow purchased, selected, and maximum-rank states;
- muted blue unowned states;
- square sprites, rank pips, and bright tier dividers;
- compact, game-menu information hierarchy.

The companion supplies its own composition, navigation, provenance details, input controls, and responsive behavior.

## Desktop Composition

An original pixel-art mountain landscape fills the background and establishes atmosphere. A darkened foreground keeps the interface readable.

A compact top bar contains the product identity, build provenance, resource inputs, and game-style route controls. The main workspace uses two regions:

1. A large Prestige board shows tier dividers and the seven-column upgrade grid.
2. A fixed inspection panel shows the selected upgrade's name, rank, effect, requirements, investment, relationships, and source status.

The Prestige board should dominate the page. Supporting information must not compete with the upgrade grid.

## Mobile Composition

Mobile uses a purpose-built vertical game menu rather than shrinking the desktop layout. Navigation becomes compact and horizontally scrollable. Each tier uses a three-column upgrade grid. The selected-upgrade inspection panel follows the tree as a full-width section.

Touch targets remain usable even when the visual icon is smaller. Rank changes must stay discoverable without relying on hover or right-click.

## Components and States

- **App shell:** standalone mountain command screen with pixel landscape and solid game-style panels.
- **Top bar:** identity, navigation, installed-build label, Available PP, and Ascension Rank.
- **Tier header:** tier number, threshold, verification state, and strong horizontal rule.
- **Upgrade node:** local sprite or fallback mark, cost, rank pips, and an accessible label.
- **Inspection panel:** familiar game tooltip hierarchy with a quieter companion-only details layer.

State language must remain consistent:

- purchased or maxed: yellow frame and icon treatment;
- selected: bright focus frame distinct from ownership;
- available but unowned: cool blue field and white border;
- locked: desaturated field with legible lock explanation;
- unverified: explicit text label, never a color-only distinction.

## Data and Behavior

The redesign does not change domain logic. Normal click adds one rank, Shift-click adds three, Ctrl+Shift-click fills a row, and decrement controls reduce ranks. Rank caps, tier gates, Ascension requirements, and local persistence keep their current behavior.

The UI may reorganize controls and copy for clarity, but it must not invent optimizer scores, formulas, requirements, or game-version claims.

## Assets and Copyright

Use the locally captured game screens under `.work/observations/2026-08-24/` as visual evidence only. They do not ship with the app.

The existing local exporter may place the owner's 102 Prestige icons under the ignored `public/assets/game/prestige/` directory. The committed interface must still work with original or neutral fallback art. Do not commit or redistribute game screenshots, sprites, fonts, audio, executables, saves, or raw extraction output.

The mountain backdrop must be original artwork inspired by the game's broad palette and pixel medium, not a copy of the captured gameplay scene.

## Accessibility and Responsive Requirements

- Preserve keyboard access to every node, including locked nodes.
- Keep a visible focus treatment separate from selected and purchased states.
- Preserve reduced-motion behavior.
- Maintain readable text and controls at 320 CSS pixels.
- Do not convey ownership, locks, verification, or selection through color alone.
- Keep dense desktop information scannable without forcing horizontal page scrolling.

## Verification

Run the existing unit and Playwright suites, then add or update checks for the new shell and responsive Prestige layout. Capture desktop and mobile screenshots in one review pass, fix the observed defects as one batch, and confirm once.

Compare the result with both the approved design direction and the local in-game references. The goal is recognizable visual kinship and a stronger companion workflow, not pixel-for-pixel reproduction.
