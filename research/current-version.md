# Current Version Evidence

## Scope

This project targets the copy of *Dwarf Eats Mountain* installed for this player, not an assumed public version label.

## Observed state — 2026-08-23

- Steam App ID: `4078200`.
- The official Steam store lists Green Wizard as developer and publisher, with a May 18, 2026 release. [Steam store page](https://store.steampowered.com/app/4078200/)
- SteamDB reported its latest record update on August 21, 2026. It identifies the title as a GameMaker game. [SteamDB app record](https://steamdb.info/app/4078200/)
- The local Steam manifest reports build ID `24333424`, installed/updated on August 21, 2026 at 07:47:31 CDT. This is direct local-install evidence, not a redistributable project asset.
- The latest visible official Steam-news release label is v1.4.0, dated July 21, 2026. Its changes include a ritual hotbar and a Denbreaker's Hail balance change. [Official Steam news](https://steamcommunity.com/app/4078200/allnews/)

## Version rule

The app will display **"Installed build 24333424 (observed 2026-08-21)"** until an official version label for that exact build is available. It will not call that build v1.4.0 merely because v1.4.0 is the latest public news post.

## Consequence for the data model

Each record needs a `gameVersion` field that can store either an official semantic version or an observed build identity, plus `verifiedAt`, `sourceType`, and confidence. A patch migration must be able to replace one evidence-backed data snapshot without changing the application schema.

The canonical snapshot now records the Steam build identity, capture date, hashes of the inspected executable, data file, and localization file, plus inspector and extraction-script provenance. This makes a future build comparison mechanical without treating a public release label as proof of local equivalence.
