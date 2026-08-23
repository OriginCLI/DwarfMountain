[CmdletBinding()]
param(
    [string]$SteamAppsPath = 'C:\Program Files (x86)\Steam\steamapps',
    [string]$ManifestPath = (Join-Path $SteamAppsPath 'appmanifest_4078200.acf')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-ManifestValue {
    param(
        [Parameter(Mandatory)] [string]$Manifest,
        [Parameter(Mandatory)] [string]$Key
    )

    $match = [regex]::Match($Manifest, '"' + [regex]::Escape($Key) + '"\s+"(?<value>[^"]+)"')
    if (-not $match.Success) {
        throw "The Steam manifest did not contain '$Key'."
    }

    return $match.Groups['value'].Value
}

function Get-LocalizedValue {
    param(
        [Parameter(Mandatory)] [object]$Localization,
        [Parameter(Mandatory)] [string]$Key
    )

    $property = $Localization.PSObject.Properties[$Key]
    if ($null -eq $property -or [string]::IsNullOrWhiteSpace([string]$property.Value)) {
        throw "The installed English localization did not contain '$Key'."
    }

    return [string]$property.Value
}

if (-not (Test-Path -LiteralPath $ManifestPath -PathType Leaf)) {
    throw "Steam manifest not found: $ManifestPath"
}

$manifest = Get-Content -LiteralPath $ManifestPath -Raw
$appId = Get-ManifestValue -Manifest $manifest -Key 'appid'
$installDirectory = Get-ManifestValue -Manifest $manifest -Key 'installdir'
$buildId = Get-ManifestValue -Manifest $manifest -Key 'buildid'
$lastUpdatedUnix = [Int64](Get-ManifestValue -Manifest $manifest -Key 'LastUpdated')
$gameRoot = Join-Path (Join-Path $SteamAppsPath 'common') $installDirectory
$localizationPath = Join-Path $gameRoot 'DEM_loc.json'

if (-not (Test-Path -LiteralPath $localizationPath -PathType Leaf)) {
    throw "Installed English localization not found: $localizationPath"
}

$localization = Get-Content -LiteralPath $localizationPath -Raw | ConvertFrom-Json
$prestigeNameCount = @($localization.PSObject.Properties | Where-Object { $_.Name -like 'prestige.*.name' }).Count
$effects = [ordered]@{
    fatedFinds = Get-LocalizedValue -Localization $localization -Key 'prestige.p_guaranteed_den_artifacts.desc'
    buriedHeirloomsNewspaper = Get-LocalizedValue -Localization $localization -Key 'prestige.p_buried_heirlooms_newspaper.desc'
    keyMaster = Get-LocalizedValue -Localization $localization -Key 'prestige.p_key_drop_chance_increase.desc'
    mountainsBuriedTreasures = Get-LocalizedValue -Localization $localization -Key 'prestige.p_mountain_artifact_chance.desc'
    greyglitterLeylines = Get-LocalizedValue -Localization $localization -Key 'prestige.p_all_mithril_luck.desc'
}

[pscustomobject]@{
    appId = $appId
    buildId = $buildId
    installedAtUtc = [DateTimeOffset]::FromUnixTimeSeconds($lastUpdatedUnix).UtcDateTime.ToString('o')
    prestigeNameCount = $prestigeNameCount
    effects = $effects
    copiedGameFiles = $false
} | ConvertTo-Json -Depth 4
