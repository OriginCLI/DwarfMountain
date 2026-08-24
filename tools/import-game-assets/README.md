# Local Game Asset Import

This project never commits or distributes *Dwarf Eats Mountain* sprites, audio, localization files, executables, or `data.win`.

With explicit local-owner permission, export only the 102 Prestige-node icons referenced by the installed-build snapshot:

```powershell
.\tools\import-game-assets\export-local-prestige-icons.ps1
```

The read-only exporter uses the ignored UndertaleModTool 0.9.1.2 installation documented in `tools/extract-game-metadata/README.md`. It reads the installed `data.win`, selects sprite resources by the snapshot's `internal.spriteResourceIndex`, and exports the first frame as:

```text
public/assets/game/prestige/<upgrade-id>.png
```

It also writes an ignored metadata report to `.work/extraction/build-24333424/prestige-icon-export-report.json`. The verification step requires exactly 102 expected, valid PNG files and confirms that Git ignores them. No full atlas, unrelated sprite, audio, or game file is copied. Components retain an initials fallback so the app still works on a fresh clone.
