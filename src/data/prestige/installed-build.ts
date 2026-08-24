import snapshot from './prestige-build-24333424.json'

export interface TierSpentRequirement {
  kind: 'tier-spent'
  tier: number
  prestigePointsSpent: number
}

export interface RunUpgradeTierRequirement {
  kind: 'run-upgrade-tier'
  upgradeId: string
  name: string
  minimumTier: number
}

export type PrestigeRequirement = TierSpentRequirement | RunUpgradeTierRequirement

export type PrestigeRankLimit =
  | { kind: 'fixed'; maximum: number }
  | { kind: 'ascension-scaled'; ranksPerAscensionRank: number; hardMaximum: number | null }
  | { kind: 'unbounded' }

export interface PrestigeRankRequirement {
  rank: number
  minimumAscensionRank: number
}

export interface PrestigeRelationship {
  kind: 'enables-at-run-tier' | 'extends-prestige-effect' | 'grants-after-ascension'
  targetUpgradeId: string
  targetName: string
  minimumRunUpgradeTier?: number
  minimumSourceRank?: number
}

export interface InstalledPrestigeUpgrade {
  id: string
  name: string
  tier: number
  position: {
    row: number
    column: number
    source: 'live-tooltip-observation' | 'constructor-order-derived'
    confidence: 'verified' | 'unverified'
  }
  maxRank: number | null
  repeatable: boolean
  nativeMaxPurchases: number
  rankLimit: PrestigeRankLimit
  rankRequirements: PrestigeRankRequirement[]
  costPerRank: number
  costFormula: string
  dependencies: string[]
  relationships: PrestigeRelationship[]
  requirements: PrestigeRequirement[]
  effect: {
    gameText: string
    plainText: string
    representation: 'localized-game-data'
  }
  internal: {
    localizationNameKey: string
    localizationDescriptionKey: string
    spriteResourceIndex: number | null
    constructor: string
  }
}

export interface InstalledPrestigeDatabase {
  schemaVersion: number
  databaseId: string
  capturedAt: string
  game: {
    steamAppId: number
    steamBuildId: string
    executableSha256: string
    dataFileSha256: string
    localizationSha256: string
    yyc: boolean
  }
  tierUnlocks: number[]
  nodes: InstalledPrestigeUpgrade[]
}

export const prestigeDatabase: InstalledPrestigeDatabase = {
  schemaVersion: snapshot.schemaVersion,
  databaseId: snapshot.databaseId,
  capturedAt: snapshot.capturedAt,
  game: snapshot.game,
  tierUnlocks: snapshot.tierUnlocks.map((entry) => entry.prestigePointsSpent),
  nodes: snapshot.nodes as InstalledPrestigeUpgrade[],
}

export const prestigeUpgrades = prestigeDatabase.nodes

export const prestigeUpgradeById = new Map(prestigeUpgrades.map((upgrade) => [upgrade.id, upgrade]))

export function getPrestigeRankCap(upgrade: InstalledPrestigeUpgrade, ascensionRank: number): number | null {
  const safeAscensionRank = Math.max(0, Math.trunc(ascensionRank))
  let limit: number | null

  if (upgrade.rankLimit.kind === 'fixed') {
    limit = upgrade.rankLimit.maximum
  } else if (upgrade.rankLimit.kind === 'ascension-scaled') {
    const scaled = safeAscensionRank * upgrade.rankLimit.ranksPerAscensionRank
    limit = upgrade.rankLimit.hardMaximum === null ? scaled : Math.min(scaled, upgrade.rankLimit.hardMaximum)
  } else {
    limit = null
  }

  if (upgrade.rankRequirements.length === 0) return limit
  const unlockedRanks = upgrade.rankRequirements.filter(
    (requirement) => safeAscensionRank >= requirement.minimumAscensionRank,
  ).length
  return limit === null ? unlockedRanks : Math.min(limit, unlockedRanks)
}

export function getNextAscensionRequirement(
  upgrade: InstalledPrestigeUpgrade,
  rank: number,
): PrestigeRankRequirement | null {
  return upgrade.rankRequirements.find((requirement) => requirement.rank === rank + 1) ?? null
}
