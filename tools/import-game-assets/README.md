# Local Game Asset Import

This project never commits or distributes *Dwarf Eats Mountain* sprites, audio, localization files, executables, or `data.win`.

If you choose to use your own extracted sprites while developing locally, place them under `public/assets/game/` using the paths named in `src/data/assets/assetManifest.ts`. For example, the default Prestige placeholder can be replaced locally at:

```text
public/assets/game/prestige/default.png
```

That directory is ignored except for `.gitkeep`. Keep the manifest's semantic ID stable; update only the local file and the mapping when a node needs a specific icon. Components must always retain the placeholder fallback so the app runs on a fresh clone without proprietary content.
