# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is the project owner playing *Dwarf Eats Mountain*. They use the companion alongside the game to record owned Prestige ranks and plan progression decisions without changing the game itself.

## Product Purpose

Dwarf Eats Mountain Companion is a local-first web application for modeling a player's current game state and helping them make informed Prestige and progression decisions. Its initial completed surface is the interactive Prestige planner; future work may add build planning, bottleneck analysis, run planning, and optimization.

## Positioning

This is a personal, evidence-backed build planner and optimizer rather than a generic wiki. It keeps exact game facts, experimentally inferred formulas, derived values, heuristics, and strategy recommendations distinct, so its advice remains inspectable instead of being presented as game truth.

## Operating Context

The user runs the companion locally while playing the Steam game. They enter available Prestige Points, Ascension Rank, and owned Prestige ranks; the application persists that profile in browser local storage. The Prestige screen supports incrementing, decrementing, and bulk-filling ranks within verified game constraints, then exposes verified metadata in an inspectable tooltip.

## Capabilities and Constraints

- React, TypeScript, Vite, modern CSS, Vitest, and Playwright form the existing web stack.
- The app uses hash-route navigation and browser localStorage; it has no authentication or backend infrastructure in this phase.
- Prestige data is sourced from installed-build extraction and records provenance and verification status. Tier 6 layout remains explicitly pending live verification.
- Optimizer guidance is intentionally unavailable until the supporting mechanics and evaluation evidence exist; the product must not fabricate recommendations or formulas.
- A later backend or cloud-sync system should be possible without rewriting the local profile model.

## Brand Commitments

The product is named **Dwarf Eats Mountain Companion**. It is a fan-made personal companion tool that should feel at home beside *Dwarf Eats Mountain*, with a game-like, compact, information-dense interface. It must not present itself as an official game product.

## Evidence on Hand

- The project brief: `Codex Prompt — Dwarf Eats Mountain Companion & Optimizer.md`.
- Installed-build Prestige snapshot and validation: `src/data/prestige/prestige-build-24333424.json`, `src/data/prestige/validate.ts`, and `tools/extract-game-metadata/`.
- Current research and provenance notes: `research/`.
- Existing browser-verification evidence: `docs/verification/`.
- Optional proprietary game art belongs only in the ignored `public/assets/game/` directory. The repository contains placeholders and manifests but must not commit or redistribute proprietary game assets, audio, executable files, saves, or raw extraction output.
- No confirmed optimizer formulas, user-entered live-run data, or recommendation evidence is currently on hand; future interfaces must label those gaps rather than inventing content.

## Product Principles

1. Make player decisions practical during real play without changing the game.
2. Preserve a clear evidence boundary between verified facts, derived estimates, heuristics, and recommendations.
3. Keep the application local-first, private, and usable without an account or backend.
4. Favor inspectable calculations and explicit uncertainty over falsely precise guidance.
5. Preserve the lawful boundary around game assets and extracted material.

## Accessibility & Inclusion

The existing Prestige interface keeps locked nodes keyboard-focusable for metadata inspection and respects the user's reduced-motion preference. No broader product-specific accessibility standard is confirmed yet.
