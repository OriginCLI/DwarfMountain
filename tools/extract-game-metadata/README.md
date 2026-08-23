# Installed-Build Prestige Extraction

This pipeline reads the locally installed *Dwarf Eats Mountain* build in place and produces the structured Prestige snapshot used by the companion. It never writes to the game directory, launches the game, injects code, bypasses protection, or exports art or audio.

## Inspector provenance

- **UndertaleModTool CLI 0.9.1.2** from the official [UnderminersTeam repository](https://github.com/UnderminersTeam/UndertaleModTool) and [0.9.1.2 release](https://github.com/UnderminersTeam/UndertaleModTool/releases/tag/0.9.1.2).
- Release commit: `3eba065fdf70712fba0a33b6fafa7539588d0906`.
- Archive: `UTMT_CLI_v0.9.1.2-Windows.zip`.
- Verified archive SHA-256: `e17637750c9c5bd074e799de99e69e1aa58c19cbbd9cbaa8868bbc387da04345`.
- Local ignored directory: `.work/inspectors/undertale-mod-tool/0.9.1.2/`.
- Only `UndertaleModCli.exe` was executed. The bundled `createdump.exe` was not run.
- **Microsoft DUMPBIN 14.51.36252.0**, installed with Visual Studio Community, was used to inspect the YYC executable's PE headers and disassembly.

The data file reports GameMaker bytecode 17 but contains no GML code resources because this build uses the YoYo Compiler (YYC). The native executable therefore contains the Prestige constructor data needed to complete the record.

## Files inspected, read-only

- `C:\Program Files (x86)\Steam\steamapps\appmanifest_4078200.acf`
- `C:\Program Files (x86)\Steam\steamapps\common\Dwarf Eat Mountain\data.win`
- `C:\Program Files (x86)\Steam\steamapps\common\Dwarf Eat Mountain\Dwarf Eats Mountain.exe`
- `C:\Program Files (x86)\Steam\steamapps\common\Dwarf Eat Mountain\DEM_loc.json`
- `C:\Users\drago\AppData\Local\Mountain_Eaters\prestige.json`
- `C:\Users\drago\AppData\Local\Mountain_Eaters\prestige_session.json`

The save files were inspected only to cross-check normal, player-created rank deltas. Nothing in the install or save directories was modified by these tools.

## Reproduction commands

Run from the repository root in ordinary PowerShell; administrator privileges are neither required nor used.

```powershell
$release = '0.9.1.2'
$toolRoot = ".work\inspectors\undertale-mod-tool\$release"
$archive = "$toolRoot\UTMT_CLI_v$release-Windows.zip"
$rawRoot = '.work\extraction\build-24333424'
$gameRoot = 'C:\Program Files (x86)\Steam\steamapps\common\Dwarf Eat Mountain'
$dumpbin = 'C:\Program Files\Microsoft Visual Studio\18\Community\VC\Tools\MSVC\14.51.36231\bin\Hostx64\x64\dumpbin.exe'

New-Item -ItemType Directory -Force $toolRoot, "$rawRoot\utmt", "$rawRoot\pe" | Out-Null
Invoke-WebRequest "https://github.com/UnderminersTeam/UndertaleModTool/releases/download/$release/UTMT_CLI_v$release-Windows.zip" -OutFile $archive
$expectedToolHash = 'e17637750c9c5bd074e799de99e69e1aa58c19cbbd9cbaa8868bbc387da04345'
$actualToolHash = (Get-FileHash -Algorithm SHA256 $archive).Hash.ToLowerInvariant()
if ($actualToolHash -ne $expectedToolHash) { throw "Unexpected inspector archive hash: $actualToolHash" }
Expand-Archive -LiteralPath $archive -DestinationPath $toolRoot -Force

$cli = "$toolRoot\UndertaleModCli.exe"
& $cli --version
& $cli info "$gameRoot\data.win" --verbose
$env:DEM_METADATA_OUTPUT = (Resolve-Path "$rawRoot\utmt").Path + '\resource-metadata.json'
& $cli load "$gameRoot\data.win" --scripts '.\tools\extract-game-metadata\export-resource-metadata.csx'

& $dumpbin /headers "/out:$rawRoot\pe\DwarfEatsMountain.headers.txt" "$gameRoot\Dwarf Eats Mountain.exe"
& $dumpbin /disasm "/out:$rawRoot\pe\DwarfEatsMountain.disasm.txt" "$gameRoot\Dwarf Eats Mountain.exe"

.\tools\extract-game-metadata\extract-prestige-native.ps1 `
  -GameExecutable "$gameRoot\Dwarf Eats Mountain.exe" `
  -Disassembly "$rawRoot\pe\DwarfEatsMountain.disasm.txt" `
  -OutputPath "$rawRoot\pe\prestige-native.json"

.\tools\extract-game-metadata\build-prestige-snapshot.ps1 `
  -NativeMetadata "$rawRoot\pe\prestige-native.json" `
  -LocalizationFile "$gameRoot\DEM_loc.json" `
  -DataFile "$gameRoot\data.win" `
  -ManifestPath 'C:\Program Files (x86)\Steam\steamapps\appmanifest_4078200.acf' `
  -CapturedAt '2026-08-23' `
  -OutputPath '.\src\data\prestige\prestige-build-24333424.json'
.\tools\extract-game-metadata\verify-local-build.ps1
.\tools\extract-game-metadata\verify-local-build.test.ps1
```

The raw outputs stay under ignored `.work/extraction/build-24333424/`. The only transformed game-data artifact intended for source control is `src/data/prestige/prestige-build-24333424.json`.

## Extracted metadata

The source-controlled snapshot contains:

- all 102 internal upgrade IDs, English names, and descriptions;
- tier, exact seven-column grid row and column, and native constructor reference;
- fixed PP cost per rank, finite maximum rank, unbounded status, or Ascension-scaled purchase-limit formula;
- tier-spend unlock thresholds (`0`, `12`, `50`, `125`, `180`, `250` PP);
- direct native dependency representation, rank-specific Ascension requirements, three run-upgrade-tier requirements, and downstream relationships between Prestige nodes;
- native sprite resource indices as non-visual references, without exporting sprites;
- localization keys, source hashes, build identity, tool provenance, and extraction timestamp.

Native `cost` is `1` for every constructor. Runtime rank price is `tier × cost`, giving fixed per-rank prices of 1–6 PP. Native `maxPurchases = 0` marks 14 Tier 6 repeatable records. Installed effect data further divides them into two unbounded nodes and 12 Ascension-scaled limits; Endless Invocations also has a hard maximum of 15. Both the native sentinel and the effective formula are retained.

## Cross-checks

- The actual installed-build Prestige screen was opened normally and compared without purchasing anything. It showed 102 nodes in tier counts `14/26/14/21/7/20`, the same row shapes, constructor-order placement, and thresholds as the snapshot.
- Existing read-only save differences confirmed the cost rule: one observed group cost `19 PP` for ranks priced `4 + 4 + 3 + 4 + 4`, and three Tier 5 purchases cost `15 PP`.
- Snapshot tests reject duplicate IDs or positions and verify every rank cap, cost, dependency list, tier threshold, and source reference.

## Remaining uncertainty

- No official semantic version was found for Steam build `24333424`; the project identifies it by installed build ID.
- Effect values and formulas are retained exactly where the installed localization represents them. Conditional prose is not converted into executable mathematical evaluators in Phase 2.
- Grid coordinates come from the native constructor sequence within each tier and match the current screen's seven-column rows. The row structure was fully compared; not all 102 named tooltips were individually hovered during the practical screen check, so the snapshot records the ordering rule for auditability.
- Ascension and run-upgrade requirements are structured only when the installed effect data states them. Direct `dependencies` remain empty because the native node record has no dependency field; related nodes are separately typed so an effect relationship is not mislabeled as a purchase prerequisite.
- Sprite indices identify relationships only. Proprietary sprites, audio, executables, localization files, saves, disassembly, and full raw metadata are intentionally absent from source control.

An injection-based alternative (`yyc-toolbox`) was rejected because it would violate the read-only/no-injection boundary. It was not downloaded or executed.
