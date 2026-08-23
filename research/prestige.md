# Prestige Research

## Evidence hierarchy

1. The player's installed English localization is the primary source for player-visible names and current effect text. It is used only as local inspection evidence; no game files or extracted art enter this repository.
2. Official Steam patch notes establish changes and interaction behavior.
3. The player-maintained GameDB wiki supplies discovery support and a complete public index, but it is not treated as the authority when it conflicts with the installed build. [Prestige index](https://dwarfeatsmountain.gamedb.wiki/prestige/)

## Confirmed interaction rules

The official v1.2.0 patch added Shift-click to buy up to three unit or upgrade ranks and Ctrl+Shift-click to buy an entire Prestige row from left to right. The planner mirrors the gestures as **profile editing only**; it never writes to the game. [Official v1.2.0 notes](https://steamcommunity.com/app/4078200/allnews/)

The v1.3.0 notes also say that the game's Prestige-screen Begin Game and Delete Save controls require a hold to prevent accidental activation. The companion does not recreate either destructive game command. [Official v1.3.0 notes](https://steamcommunity.com/app/4078200/allnews/)

## Visual-reference evidence

An official Steam screenshot exposes the intended broad composition: the live game remains visible behind a centered Prestige panel, with tier labels, compact icon rows, PP counters, and a tooltip anchored to the selected node. It is suitable as a visual-reference source, not as evidence for node positions in the August 21 build. [Official Steam screenshot](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4078200/1ec3938513869484ebcd0319aecda70147314f8d/ss_1ec3938513869484ebcd0319aecda70147314f8d.1920x1080.jpg?t=1761922163)

Phase 2 reproduces that visual grammar—tiered rails, compact icons, cost/rank state, tooltip placement, dark opaque panels, and strong readable status contrast—with original CSS and generated text placeholders. It does not embed, crop, or redistribute the screenshot or its game art.

## Confirmed installed-build examples

| Upgrade | Current observed effect | Confidence | Provenance |
| --- | --- | --- | --- |
| Fated Finds | The first 1/2/3 destroyed Dens guarantee an Artifact. | Verified | Local English localization; community page agrees. |
| Buried Heirlooms Newspaper | Consuming a Mountain has a 5/10/15/20% chance to add 1 PP. | Verified | Local English localization; community page agrees. |
| Key Master | Ruby, Sapphire, and Emerald key drop chance increases by 40/80/120/160%. | Verified | Local English localization. |
| Mountain's Buried Treasures | Consuming a Mountain has a 1/2/3% Artifact chance, increased by 0.03% per Runesmith and Scientist. | Verified | Local English localization; community page agrees. |
| Greyglitter Leylines | All dwarves gain 2/3/4 mithril-luck. | Verified | Local English localization; community page agrees. |

## Reconciled conflict

The public GameDB page currently describes Key Master as 25/50/75% across three ranks. The installed build exposes 40/80/120/160% across four ranks. The companion must use the installed-build value and retain the wiki value only in the conflict ledger. [GameDB Key Master record](https://dwarfeatsmountain.gamedb.wiki/prestige/)

## Complete installed-build graph

Read-only inspection of the GameMaker data file, the YYC executable, and English localization reconstructed all 102 native Prestige constructors. The graph is now stored in `src/data/prestige/prestige-build-24333424.json`.

| Field | Installed-build result |
| --- | --- |
| Tier counts | `14 / 26 / 14 / 21 / 7 / 20` |
| Row shapes | T1 `7+7`; T2 `7+7+7+5`; T3 `7+7`; T4 `7+7+7`; T5 `7`; T6 `7+7+6` |
| Tier thresholds | `0 / 12 / 50 / 125 / 180 / 250` PP spent |
| Grid | Seven columns; 102 unique tier/row/column positions |
| Rank price | `tier × native cost`; native cost is `1` for every node |
| Dependencies and relationships | No native direct dependency field; installed text supplies three run-upgrade-tier requirements, five rank-specific Ascension gates, and typed downstream Prestige-node relationships |
| Repeatables | 14 Tier 6 nodes with native `maxPurchases = 0`: two unbounded and 12 limited per Ascension Rank; Endless Invocations has a hard cap of 15 |

Every node retains its internal constructor, localization keys, native sprite reference, exact description, rank-limit formula, requirements, relationships, source evidence, and original native values. The Phase 2 editor enforces finite, rank-gated, and Ascension-scaled purchase limits directly. It does not claim to turn other conditional description prose into optimizer formulas; transparent scoring and full effect evaluators belong to later phases.
