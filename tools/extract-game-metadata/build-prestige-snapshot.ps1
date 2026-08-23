[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$NativeMetadata,

    [Parameter(Mandatory = $true)]
    [string]$LocalizationFile,

    [Parameter(Mandatory = $true)]
    [string]$DataFile,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [Parameter(Mandatory = $true)]
    [string]$ManifestPath,

    [Parameter(Mandatory = $true)]
    [string]$CapturedAt
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Convert-GameTextToPlainText {
    param([string]$Text)

    $plain = $Text -replace '\[(?:#[0-9a-fA-F]{6}|c_[a-zA-Z0-9_]+|shake|/shake)\]', ''
    $plain = $plain -replace '…', ''
    $plain = $plain -replace '(?m)^---+', ''
    return $plain.Trim()
}

$nativePath = (Resolve-Path -LiteralPath $NativeMetadata).Path
$localizationPath = (Resolve-Path -LiteralPath $LocalizationFile).Path
$dataPath = (Resolve-Path -LiteralPath $DataFile).Path
$manifestPath = (Resolve-Path -LiteralPath $ManifestPath).Path
$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory -PathType Container)) {
    throw "Output directory does not exist: $outputDirectory"
}

$native = Get-Content -Raw -LiteralPath $nativePath | ConvertFrom-Json
$localization = Get-Content -Raw -LiteralPath $localizationPath | ConvertFrom-Json
$manifest = Get-Content -Raw -LiteralPath $manifestPath
$buildMatch = [regex]::Match($manifest, '"buildid"\s+"(?<buildId>\d+)"')
if (-not $buildMatch.Success) {
    throw "Steam manifest did not contain a buildid: $manifestPath"
}
$steamBuildId = $buildMatch.Groups['buildId'].Value
if ($CapturedAt -notmatch '^\d{4}-\d{2}-\d{2}$') {
    throw "CapturedAt must use YYYY-MM-DD format, got '$CapturedAt'."
}
$expectedOutputName = "prestige-build-$steamBuildId.json"
if ((Split-Path -Leaf $OutputPath) -ne $expectedOutputName) {
    throw "Output filename must match the inspected manifest build: $expectedOutputName"
}
$thresholds = $native.tierUnlockSpent

$rankAscensionRequirements = @{
    'p_At6_keep_artifacts_choice' = @(0, 2, 4, 6, 8)
    'p_t6_keep_t5_artifacts' = @(1)
    'p_t6_shrine_grounds' = @(0, 2)
    'p_t6_spire_artifact_bypass' = @(1, 5)
    'p_t6_start_with_buildings' = @(1, 1)
}

$ascensionScaledLimits = @{
    'p_t6_rituals_cd_infinite' = [ordered]@{ ranksPerAscensionRank = 1; hardMaximum = 15 }
    'p_t6_miners_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_cannon_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_demodwarves_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_flamers_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_lasers_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_harpoons_infinite' = [ordered]@{ ranksPerAscensionRank = 5; hardMaximum = $null }
    'p_t6_mithril_per_ascension' = [ordered]@{ ranksPerAscensionRank = 1; hardMaximum = $null }
    'p_t6_soul_per_ascension' = [ordered]@{ ranksPerAscensionRank = 1; hardMaximum = $null }
    'p_t6_gold_per_ascension' = [ordered]@{ ranksPerAscensionRank = 1; hardMaximum = $null }
    'p_t6_mithril_luck_infinite' = [ordered]@{ ranksPerAscensionRank = 2; hardMaximum = $null }
    'p_t6_spire_pp_chance' = [ordered]@{ ranksPerAscensionRank = 2; hardMaximum = $null }
}

$runUpgradeRequirements = @{
    'p_mapped_destruction' = [ordered]@{ kind = 'run-upgrade-tier'; upgradeId = 'powder_hall'; name = 'Powder Hall'; minimumTier = 3 }
    'p_cluster_pick' = [ordered]@{ kind = 'run-upgrade-tier'; upgradeId = 'cyberdwarf'; name = 'Cyberdwarf'; minimumTier = 2 }
    'p_nuclear_research' = [ordered]@{ kind = 'run-upgrade-tier'; upgradeId = 'powder_hall'; name = 'Powder Hall'; minimumTier = 4 }
}

$prestigeRelationships = @{
    'p_cyberdwarf' = @([ordered]@{ kind = 'enables-at-run-tier'; targetUpgradeId = 'p_cluster_pick'; targetName = 'C.L.U.S.T.E.R.P.I.C.K.'; minimumRunUpgradeTier = 2 })
    'p_powder_hall' = @(
        [ordered]@{ kind = 'enables-at-run-tier'; targetUpgradeId = 'p_mapped_destruction'; targetName = 'Mapped Destruction'; minimumRunUpgradeTier = 3 },
        [ordered]@{ kind = 'enables-at-run-tier'; targetUpgradeId = 'p_nuclear_research'; targetName = 'Nuclear Research'; minimumRunUpgradeTier = 4 }
    )
    'p_t6_keep_t5_artifacts' = @(
        [ordered]@{ kind = 'extends-prestige-effect'; targetUpgradeId = 'p_artifacts_perish_not'; targetName = 'Divine Relic'; minimumSourceRank = 1 },
        [ordered]@{ kind = 'extends-prestige-effect'; targetUpgradeId = 'p_At6_keep_artifacts_choice'; targetName = 'Vault of Gods'; minimumSourceRank = 1 }
    )
    'p_t6_building_headstart' = @(
        [ordered]@{ kind = 'grants-after-ascension'; targetUpgradeId = 'p_manufactorum'; targetName = 'Manufactorum'; minimumSourceRank = 1 },
        [ordered]@{ kind = 'grants-after-ascension'; targetUpgradeId = 'p_spelunkers_guild'; targetName = "Spelunker's Guild"; minimumSourceRank = 1 },
        [ordered]@{ kind = 'grants-after-ascension'; targetUpgradeId = 'p_geode_sanctum'; targetName = 'Geode Sanctum'; minimumSourceRank = 2 },
        [ordered]@{ kind = 'grants-after-ascension'; targetUpgradeId = 'p_meadhall'; targetName = 'Meadhall'; minimumSourceRank = 2 },
        [ordered]@{ kind = 'grants-after-ascension'; targetUpgradeId = 'p_shrine'; targetName = 'Shrine'; minimumSourceRank = 3 }
    )
}

$nodes = foreach ($node in $native.nodes) {
    $nameKey = [string]$node.localization.name
    $descriptionKey = [string]$node.localization.description
    $localizedName = $localization.PSObject.Properties[$nameKey].Value
    $localizedDescription = $localization.PSObject.Properties[$descriptionKey].Value
    if ([string]::IsNullOrWhiteSpace([string]$localizedName)) {
        $localizedName = $node.name
    }
    if ([string]::IsNullOrWhiteSpace([string]$localizedDescription)) {
        $localizedDescription = $node.description
    }

    $nativeMax = [int]$node.maxRank
    $tier = [int]$node.tier
    $rankRequirements = @()
    if ($rankAscensionRequirements.ContainsKey([string]$node.id)) {
        $rankRequirements = @(for ($rankIndex = 0; $rankIndex -lt $rankAscensionRequirements[[string]$node.id].Count; $rankIndex += 1) {
            [ordered]@{ rank = $rankIndex + 1; minimumAscensionRank = [int]$rankAscensionRequirements[[string]$node.id][$rankIndex] }
        })
    }
    $rankLimit = if ($nativeMax -gt 0) {
        [ordered]@{ kind = 'fixed'; maximum = $nativeMax }
    } elseif ($ascensionScaledLimits.ContainsKey([string]$node.id)) {
        [ordered]@{
            kind = 'ascension-scaled'
            ranksPerAscensionRank = [int]$ascensionScaledLimits[[string]$node.id].ranksPerAscensionRank
            hardMaximum = $ascensionScaledLimits[[string]$node.id].hardMaximum
        }
    } else {
        [ordered]@{ kind = 'unbounded' }
    }
    $requirements = @(
        [ordered]@{
            kind = 'tier-spent'
            tier = $tier
            prestigePointsSpent = [int]$thresholds.PSObject.Properties[[string]$tier].Value
        }
    )
    if ($runUpgradeRequirements.ContainsKey([string]$node.id)) {
        $requirements += $runUpgradeRequirements[[string]$node.id]
    }
    [object[]]$nodeRelationships = @()
    if ($prestigeRelationships.ContainsKey([string]$node.id)) {
        $nodeRelationships = [object[]]@($prestigeRelationships[[string]$node.id])
    }
    [ordered]@{
        id = [string]$node.id
        name = [string]$localizedName
        tier = $tier
        position = [ordered]@{
            row = [int]$node.position.row
            column = [int]$node.position.column
        }
        maxRank = if ($nativeMax -eq 0) { $null } else { $nativeMax }
        repeatable = $nativeMax -eq 0
        nativeMaxPurchases = $nativeMax
        rankLimit = $rankLimit
        rankRequirements = $rankRequirements
        costPerRank = $tier * [int]$node.baseCost
        costFormula = 'tier * baseCost (baseCost = 1); fixed for every rank'
        dependencies = @()
        relationships = $nodeRelationships
        requirements = $requirements
        effect = [ordered]@{
            gameText = [string]$localizedDescription
            plainText = Convert-GameTextToPlainText -Text ([string]$localizedDescription)
            representation = 'localized-game-data'
        }
        internal = [ordered]@{
            localizationNameKey = $nameKey
            localizationDescriptionKey = $descriptionKey
            spriteResourceIndex = if ($null -eq $node.spriteResourceIndex) { $null } else { [int]$node.spriteResourceIndex }
            constructor = [string]$node.native.constructor
        }
    }
}

if (@($nodes).Count -ne 102) {
    throw "Expected 102 transformed nodes, got $(@($nodes).Count)."
}

$snapshot = [ordered]@{
    schemaVersion = 2
    databaseId = "steam-4078200-build-$steamBuildId"
    capturedAt = $CapturedAt
    game = [ordered]@{
        steamAppId = 4078200
        steamBuildId = $steamBuildId
        executableSha256 = [string]$native.source.sha256
        dataFileSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $dataPath).Hash.ToLowerInvariant()
        localizationSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $localizationPath).Hash.ToLowerInvariant()
        yyc = $true
    }
    provenance = @(
        [ordered]@{
            id = 'installed-native-metadata'
            type = 'official-game'
            confidence = 'verified'
            fields = @('id', 'fallback name', 'tier', 'native rank cap', 'base cost', 'sprite resource index', 'localization references')
        },
        [ordered]@{
            id = 'installed-localization'
            type = 'official-game'
            confidence = 'verified'
            fields = @('display name', 'effect text', 'rank-specific Ascension gates', 'Ascension-scaled purchase limits', 'run-upgrade requirements', 'Prestige-node relationships')
        },
        [ordered]@{
            id = 'live-prestige-screen-cross-check'
            type = 'official-game'
            confidence = 'verified'
            fields = @('tier counts', 'seven-column row layout', 'constructor-order placement', 'tier unlock thresholds')
        },
        [ordered]@{
            id = 'installed-save-delta-cross-check'
            type = 'official-game'
            confidence = 'verified'
            fields = @('fixed PP cost per rank equals tier multiplied by baseCost')
        }
    )
    costModel = [ordered]@{
        formula = 'costPerRank = tier * baseCost'
        baseCostValues = @(1)
        rankScaling = $false
        evidence = 'All 102 native node structs store baseCost 1. Two independent local save deltas equal the sum of purchased node tiers (19 PP and 15 PP).'
    }
    tierUnlocks = @(1..6 | ForEach-Object {
        [ordered]@{
            tier = $_
            prestigePointsSpent = [int]$thresholds.PSObject.Properties[[string]$_].Value
        }
    })
    dependencyModel = [ordered]@{
        nodeEdges = $false
        rule = 'Nodes have no per-node prerequisite field or dependency edge; access is gated by the tier spent threshold.'
    }
    layout = [ordered]@{
        columns = 7
        rule = 'Filter native constructor order by tier, then fill rows left to right.'
    }
    nodes = @($nodes)
}

$snapshot | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $OutputPath -Encoding utf8
Write-Host "Wrote source-controlled Prestige snapshot with $(@($nodes).Count) nodes to $OutputPath"
