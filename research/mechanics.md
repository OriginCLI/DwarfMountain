# Mechanics Research

## Fact, inference, and recommendation boundaries

The companion will classify mechanics as `exact`, `inferred`, `heuristic`, or `strategy`. A strategy recommendation never becomes a formula merely because it is useful.

## Current evidence

### Mountain health

The GameDB mechanics reference states that max Mountain HP is `max(1, round(baseHP × 1.115^level))`, with level-band base-HP rules. It calls out 1.115 as the health coefficient. This is community-sourced pending confirmation from the installed runtime data. [Mechanics reference](https://dwarfeatsmountain.gamedb.wiki/mechanics/)

### Mithril

The same community reference describes a damage-progress model rather than a constant chance: a hit contributes based on its share of Mountain max HP, then progress must exceed a random threshold. Its stated constants are 0.03 base, +0.06 per mithril-luck, a luck term cap of 18, a 0.01 normal-luck conversion, and a 0.3–1.7 threshold. This remains **inferred/community evidence** until the installed build's runtime calculation is extracted and testable. [Mithril section](https://dwarfeatsmountain.gamedb.wiki/mechanics/)

### Transport bottleneck

The official store description says that Runners must haul gold to the Great Maw while avoiding falling rocks. That directly supports treating transport as an independent bottleneck rather than a damage subscore. [Steam store description](https://store.steampowered.com/app/4078200/)

## Phase-1 model decision

Foundation code will store exact machine-readable effects where source evidence supports them. It will not calculate Mountain-clear time, PP/hour, Mithril drops, or optimizer scores yet. Those modules need their own sourced equations and regression tests in a later phase.
