[CmdletBinding()]
param(
    [string]$GameRoot = 'C:\Program Files (x86)\Steam\steamapps\common\Dwarf Eat Mountain',
    [string]$InspectorPath = '.\.work\inspectors\undertale-mod-tool\0.9.1.2\cli\UndertaleModCli.exe',
    [string]$SnapshotPath = '.\src\data\prestige\prestige-build-24333424.json',
    [string]$OutputDirectory = '.\public\assets\game\prestige',
    [string]$ReportPath = '.\.work\extraction\build-24333424\prestige-icon-export-report.json'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$workspace = (Resolve-Path -LiteralPath '.').Path
$dataPath = Join-Path $GameRoot 'data.win'
$cliPath = (Resolve-Path -LiteralPath $InspectorPath).Path
$snapshot = (Resolve-Path -LiteralPath $SnapshotPath).Path
if (-not (Test-Path -LiteralPath $dataPath -PathType Leaf)) {
    throw "Installed game data file not found: $dataPath"
}

$allowedAssetRoot = [IO.Path]::GetFullPath((Join-Path $workspace 'public\assets\game'))
$output = [IO.Path]::GetFullPath((Join-Path $workspace $OutputDirectory))
if (-not $output.StartsWith($allowedAssetRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Output directory must stay below the ignored local game-asset root: $allowedAssetRoot"
}
$report = [IO.Path]::GetFullPath((Join-Path $workspace $ReportPath))
$ignoredWorkRoot = [IO.Path]::GetFullPath((Join-Path $workspace '.work'))
if (-not $report.StartsWith($ignoredWorkRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Report path must stay below the ignored working directory: $ignoredWorkRoot"
}

New-Item -ItemType Directory -Force -Path $output, (Split-Path -Parent $report) | Out-Null
$scriptPath = (Resolve-Path -LiteralPath '.\tools\import-game-assets\export-prestige-icons.csx').Path

$previousSnapshot = $env:DEM_PRESTIGE_SNAPSHOT
$previousOutput = $env:DEM_PRESTIGE_ICON_OUTPUT
$previousReport = $env:DEM_PRESTIGE_ICON_REPORT
try {
    $env:DEM_PRESTIGE_SNAPSHOT = $snapshot
    $env:DEM_PRESTIGE_ICON_OUTPUT = $output
    $env:DEM_PRESTIGE_ICON_REPORT = $report
    & $cliPath load $dataPath --scripts $scriptPath
    if ($LASTEXITCODE -ne 0) {
        throw "UndertaleModTool exited with code $LASTEXITCODE."
    }
} finally {
    $env:DEM_PRESTIGE_SNAPSHOT = $previousSnapshot
    $env:DEM_PRESTIGE_ICON_OUTPUT = $previousOutput
    $env:DEM_PRESTIGE_ICON_REPORT = $previousReport
}

& .\tools\import-game-assets\verify-local-prestige-icons.ps1 -SnapshotPath $snapshot -IconDirectory $output
$trackedOrUnignored = @(git ls-files --cached --others --exclude-standard -- $output)
if ($trackedOrUnignored.Count -gt 0) {
    throw "Exported icons are not safely ignored by Git: $($trackedOrUnignored -join ', ')"
}

Write-Host "Local-only Prestige icons are ready in $output"
Write-Host "Ignored extraction report: $report"
