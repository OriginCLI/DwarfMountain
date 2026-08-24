---
name: Dwarf Eats Mountain Companion - Game-Inspired Preview
description: Opt-in pixel command-screen system for the standalone Prestige companion preview.
colors:
  mountain-sky: "#63add7"
  ice-panel: "#3f6e88"
  deep-panel: "#274e6a"
  abyss-panel: "#142b43"
  snow-ink: "#f4f7ed"
  frost-muted: "#b9d5df"
  prestige-yellow: "#ffe33b"
  detail-cyan: "#5cd7ff"
  ice-line: "#e8f4ef"
  mountain-shadow: "#102339"
typography:
  display:
    fontFamily: '"Silkscreen", "Lucida Console", monospace'
    fontSize: "clamp(1.7rem, 5vw, 3.65rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Silkscreen", monospace'
    fontSize: "clamp(1.35rem, 2.6vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Silkscreen", monospace'
    fontSize: "0.88rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: '"Silkscreen", monospace'
    fontSize: "0.6rem"
    fontWeight: 400
    lineHeight: 1.58
  label:
    fontFamily: '"Silkscreen", monospace'
    fontSize: "0.5rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0"
rounded:
  square: "0"
spacing:
  compact: "4px"
  control: "8px"
  panel: "12px"
  section: "16px"
  workspace: "18px"
  page: "20px"
components:
  button-primary-route:
    backgroundColor: "{colors.prestige-yellow}"
    textColor: "{colors.abyss-panel}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 17px"
  button-mode:
    backgroundColor: "transparent"
    textColor: "{colors.frost-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "6px 9px"
    height: "34px"
  button-mode-active:
    backgroundColor: "{colors.prestige-yellow}"
    textColor: "{colors.abyss-panel}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "6px 9px"
    height: "34px"
  input-resource:
    backgroundColor: "transparent"
    textColor: "{colors.prestige-yellow}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "2px 0"
    height: "28px"
    width: "100%"
  nav-route-active:
    backgroundColor: "{colors.prestige-yellow}"
    textColor: "{colors.abyss-panel}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "9px 8px"
    height: "39px"
  card-prestige-board:
    backgroundColor: "rgb(47 91 116 / 92%)"
    textColor: "{colors.snow-ink}"
    rounded: "{rounded.square}"
    padding: "12px"
  upgrade-node-unowned:
    backgroundColor: "{colors.deep-panel}"
    textColor: "{colors.snow-ink}"
    rounded: "{rounded.square}"
    padding: "5px 4px 19px"
    height: "82px"
  upgrade-node-purchased:
    backgroundColor: "#3f7896"
    textColor: "{colors.prestige-yellow}"
    rounded: "{rounded.square}"
    padding: "5px 4px 19px"
    height: "82px"
  upgrade-node-locked:
    backgroundColor: "#28485e"
    textColor: "#a9c0c8"
    rounded: "{rounded.square}"
    padding: "5px 4px 19px"
    height: "82px"
  card-inspection:
    backgroundColor: "rgb(35 73 98 / 97%)"
    textColor: "{colors.snow-ink}"
    rounded: "{rounded.square}"
    padding: "16px"
---

# Design System: Dwarf Eats Mountain Companion - Game-Inspired Preview

## Overview

**Creative North Star: "Standalone Mountain Command Screen"**

This system is the implemented visual language for the optional `game-inspired` standalone companion preview. It uses an original pixel mountain backdrop, icy slate-blue fields, hard pixel edges, compact game-menu hierarchy, white pixel lettering, yellow ownership and action states, and cyan inspection detail. The Prestige board is the dominant instrument; provenance and companion-only controls stay legible but secondary.

The preview is strictly opt-in under `data-visual-mode="game-inspired"`. The existing original/legacy interface remains the default and available mode; do not apply these preview tokens globally or describe the preview as a replacement. The product remains a fan-made companion, never an official game surface or a gameplay overlay.

**Key Characteristics:**

- Pixel-sharp, information-dense command-screen composition.
- Cool layered panels over an original mountain atmosphere.
- Yellow for ownership, maximum rank, active routes, and primary action.
- Cyan and explicit framing keep selection distinct from ownership.
- Dense seven-column desktop tree and purpose-built three-column mobile tree.
- Visible provenance and uncertainty labels remain part of the interface.

## Colors

The preview pairs cool mountain blues with snow-white information and a deliberately bright yellow state signal.

### Primary

- **Prestige Yellow:** Marks purchased and maximum-rank nodes, active navigation, primary actions, rank pips, and resource values.

### Secondary

- **Detail Cyan:** Highlights selected-upgrade titles and supports the cyan selection language without implying ownership.

### Tertiary

- **Mountain Sky:** Establishes the bright atmospheric edge of the standalone background scene.

### Neutral

- **Ice Panel:** The principal slate-blue field for broad interface regions.
- **Deep Panel:** The solid control, card, and unowned-node surface.
- **Abyss Panel:** The darkest control, rail, and inset surface.
- **Snow Ink:** Primary text, icon, and border color.
- **Frost Muted:** Secondary instructions, provenance, and locked-support copy.
- **Ice Line:** The strong panel and tier-divider stroke.
- **Mountain Shadow:** Dark offset text shadow and pixel-depth anchor.

### Named Rules

**The Two-Signal Rule.** Yellow communicates ownership or action; cyan and an explicit frame communicate selection. Never make those states indistinguishable.

**The Cool Field Rule.** Large surfaces stay within the icy slate family so the yellow state signal remains rare and immediate.

## Typography

**Display Font:** Silkscreen (with Lucida Console and monospace fallbacks)
**Body Font:** Silkscreen (with monospace fallback)
**Label/Mono Font:** Silkscreen (with monospace fallback)

**Character:** A single locally hosted pixel family keeps the preview close to a compact game menu. Size, weight, color, and offset shadow provide hierarchy; switching typefaces does not.

### Hierarchy

- **Display** (700, `clamp(1.7rem, 5vw, 3.65rem)`, 1.1): Large route and dashboard headings.
- **Headline** (700, `clamp(1.35rem, 2.6vw, 2.25rem)`, 1.12): The Prestige planner heading inside the dense workspace.
- **Title** (700, `0.88rem`, 1.3): Selected upgrade names and similarly important compact titles.
- **Body** (400, `0.6rem`, 1.58): Tooltip facts and explanatory content where density must remain readable.
- **Label** (700, `0.5rem`, 1.45, zero tracking): Tier labels, field names, state labels, and metadata headings.

### Named Rules

**The Pixel Voice Rule.** In preview mode, use Silkscreen across display, body, controls, and metadata; rely on hierarchy rather than a second decorative font.

**The Offset Legibility Rule.** White or yellow text over blue atmosphere may use a hard dark offset shadow, never a soft glow.

## Layout

The preview shell spans up to 1540px and uses a 186px route rail beside a fluid workspace. Desktop Prestige composition places the board in a `minmax(570px, 1fr)` region and the inspection panel in a `minmax(290px, 330px)` region with an 18px gap. Tiers use a seven-column node grid; strong dividers and a narrow tier label column preserve scan order.

At 1180px and below, the inspection panel stacks after the tree. At 840px and below, the route rail becomes a horizontally scrollable menu with an explicit scroll cue. At 760px and below, tiers switch to three node columns, page padding contracts to 8px, and selected details become a fixed bottom disclosure. The global 320px minimum remains supported.

**The Board-First Rule.** Allocate the largest uninterrupted region to the upgrade grid; counters, provenance, and inspection detail support it rather than compete with it.

## Elevation & Depth

Depth is hybrid: solid and slightly translucent blue layers establish hierarchy, 3px light borders cut crisp silhouettes, and compact dark shadows lift only the shell, panels, and interactive nodes. The mountain scene supplies atmosphere, not contrast for text.

### Shadow Vocabulary

- **Top-bar lift** (`0 8px 22px rgb(4 16 27 / 42%)`): Separates the compact masthead from the landscape.
- **Frame lift** (`0 12px 28px rgb(3 14 24 / 48%)`): Anchors the full companion workspace.
- **Panel lift** (`5px 6px 13px rgb(8 26 41 / 43%)`): Used on counters and the Prestige board.
- **Node lift** (`3px 4px 9px rgb(8 26 41 / 46%)`): Keeps upgrade tiles legible as discrete controls.

### Named Rules

**The Hard Depth Rule.** Use borders and short dark offsets for structure; reserve diffuse shadow for separating the assembled command screen from the background.

## Shapes

The preview is square by default. Controls, nodes, cards, panels, and inputs use hard corners, with 3px light strokes for major boundaries and 2px strokes for compact inset controls. Upgrade nodes are at least 82px tall on desktop with 48px icon fields; mobile nodes are at least 76px tall with 42px icons. Rank pips are short rectangles, and selected or active states add concentric square frames rather than rounded halos.

**The Pixel Edge Rule.** Do not round preview panels or controls; every silhouette should read as a deliberate pixel-built rectangle.

## Components

### Buttons

- **Shape:** Hard rectangular controls with square corners and compact pixel labels.
- **Primary:** The route action uses Prestige Yellow over Abyss Panel text with `13px 17px` padding and a 3px Snow Ink border.
- **Mode Switch:** Two 34px-high options sit inside a dark framed group; the pressed option fills yellow while the inactive option stays transparent and muted.
- **Hover / Focus:** The route action retains its yellow field and dark text, adds a 3px yellow outline with a 3px offset, and switches to a hard `6px 7px 0` Mountain Shadow. The application-wide preview focus ring remains 3px yellow with a 3px offset.

### Cards / Containers

- **Corner Style:** Square corners throughout.
- **Background:** Ice Panel and Deep Panel layers, with a darker inspection surface.
- **Shadow Strategy:** Compact dark panel lifts from the documented shadow vocabulary.
- **Border:** Major panels and tier boundaries use 3px Ice Line strokes.
- **Internal Padding:** 12px for the Prestige board and 16px for the inspection panel.

### Inputs / Fields

- **Style:** Resource inputs remain transparent inside the Deep Panel counter strip, use yellow tabular numerals, and end in a 2px yellow underline.
- **Focus:** The underline changes to Snow Ink while the global yellow focus ring remains visible.
- **Constraints:** Numeric fields retain their minimum value behavior and do not disguise editable values as static counters.

### Navigation

The desktop rail uses muted pixel labels on a dark navy field. The active route fills yellow, switches to dark text, and gains a short dark offset shadow. On compact widths the same routes scroll horizontally and an explicit cue communicates overflow.

### Upgrade Nodes

Unowned nodes use a cool blue field, white 3px border, square 48px sprite area, top-right cost badge, bottom rank pips, and a separate decrement control. Purchased and maxed nodes use yellow framing and pips; locked nodes are desaturated but remain keyboard-focusable and expose a textual lock reason. Selection adds a cyan outer outline distinct from the yellow ownership frame.

### Inspection Panel

The selected-upgrade panel uses a familiar tooltip hierarchy: muted grid provenance, cyan name, yellow rank and term labels, white values, and a strong white rule. At mobile width it becomes an open bottom disclosure with a 48px summary row and a bounded scroll area.

## Do's and Don'ts

### Do:

- **Do** scope every game-inspired rule beneath `data-visual-mode="game-inspired"` and keep the original interface as the default available mode.
- **Do** keep the Prestige board visually dominant and preserve its seven-column desktop and three-column mobile scan patterns.
- **Do** combine color with frames, pips, labels, and lock explanations for ownership, selection, and availability.
- **Do** keep local fallback marks usable when optional proprietary Prestige icons are absent.
- **Do** respect reduced-motion preferences and preserve visible keyboard focus on every node, including locked nodes.

### Don't:

- **Don't** present the preview as an official game product, gameplay overlay, or screenshot replica.
- **Don't** commit or depend on proprietary screenshots, sprites, fonts, audio, executables, saves, or raw extraction output.
- **Don't** soften the preview into rounded cards, pills, or generic web-dashboard chrome.
- **Don't** use yellow selection treatment alone; selection must remain distinct from purchased and maxed states.
- **Don't** let companion-only details or unverified claims compete with verified upgrade information.
