# Source Ledger

| ID | Source | Class | Accessed | Used for | Notes |
| --- | --- | --- | --- | --- | --- |
| steam-store | [Dwarf Eats Mountain on Steam](https://store.steampowered.com/app/4078200/) | Official game | 2026-08-23 | Product identity, core systems, scale | Primary source. |
| steam-news | [Official Steam news](https://steamcommunity.com/app/4078200/allnews/) | Official patch | 2026-08-23 | v1.1.0–v1.4.0 changes and controls | Primary source; public version stream stops at v1.4.0. |
| steamdb | [SteamDB app record](https://steamdb.info/app/4078200/) | Patch/build metadata | 2026-08-23 | Public update timing, engine identification | Secondary metadata; no balance claims. |
| local-build | Installed Steam build `24333424` and English localization | Official game, local inspection | 2026-08-23 | Current displayed names/effects | Do not copy files, strings in bulk, or art into the repository. |
| utmt-release | [UndertaleModTool 0.9.1.2](https://github.com/UnderminersTeam/UndertaleModTool/releases/tag/0.9.1.2) | Open-source inspector | 2026-08-23 | GameMaker resource inventory and constructor identities | Official release; archive hash and commit recorded in extraction README. |
| dumpbin | Microsoft DUMPBIN 14.51.36252.0 | Locally installed development tool | 2026-08-23 | Read-only PE headers and YYC constructor disassembly | No executable modification or execution. |
| live-prestige | Installed game's Prestige screen | Direct runtime observation | 2026-08-23 | Tier counts, row shapes, tier thresholds, broad composition | Opened normally; no purchases and no injection. |
| local-save-delta | Existing local Prestige save/session JSON | Direct local observation | 2026-08-23 | Cross-check fixed rank-price rule | Read-only; save contents are not committed. |
| gamedb-prestige | [GameDB Prestige](https://dwarfeatsmountain.gamedb.wiki/prestige/) | Player-maintained wiki | 2026-08-23 | Public node index and discovery | Conflicts with local Key Master data. |
| gamedb-mechanics | [GameDB Mechanics](https://dwarfeatsmountain.gamedb.wiki/mechanics/) | Player-maintained wiki | 2026-08-23 | Candidate mechanics/equations | Treat formulas as inferred until direct validation. |

## Search stopping rule

Broad discovery stopped after establishing the source classes and installed-build conflict. The canonical graph was then resolved through the approved reproducible local extraction and normal in-game comparison. Later updates should repeat that pipeline against the new installed build instead of copying unsourced guides.
