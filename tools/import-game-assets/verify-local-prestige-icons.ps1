[CmdletBinding()]
param(
    [string]$SnapshotPath = '.\src\data\prestige\prestige-build-24333424.json',
    [string]$IconDirectory = '.\public\assets\game\prestige'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$snapshot = Get-Content -Raw -LiteralPath $SnapshotPath | ConvertFrom-Json
$expectedNames = @($snapshot.nodes | ForEach-Object { "$($_.id).png" } | Sort-Object)
$actualNames = @()
if (Test-Path -LiteralPath $IconDirectory -PathType Container) {
    $actualNames = @(Get-ChildItem -LiteralPath $IconDirectory -File -Filter '*.png' | Select-Object -ExpandProperty Name | Sort-Object)
}

$missing = @($expectedNames | Where-Object { $actualNames -notcontains $_ })
$unexpected = @($actualNames | Where-Object { $expectedNames -notcontains $_ })
if ($missing.Count -gt 0 -or $unexpected.Count -gt 0) {
    throw "Prestige icon set mismatch. Expected $($expectedNames.Count), found $($actualNames.Count), missing $($missing.Count), unexpected $($unexpected.Count)."
}

$pngSignature = @(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
foreach ($name in $expectedNames) {
    $path = Join-Path $IconDirectory $name
    $bytes = [IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $path).Path)
    if ($bytes.Length -le $pngSignature.Count) {
        throw "Prestige icon is empty or truncated: $name"
    }
    for ($index = 0; $index -lt $pngSignature.Count; $index += 1) {
        if ($bytes[$index] -ne $pngSignature[$index]) {
            throw "Prestige icon does not have a valid PNG signature: $name"
        }
    }
}

Write-Host "Verified $($expectedNames.Count) local Prestige icon PNGs in $IconDirectory"
