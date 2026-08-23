import type { InstalledPrestigeDatabase } from './installed-build'

export function validatePrestigeDatabase(database: InstalledPrestigeDatabase): string[] {
  const issues: string[] = []
  const ids = new Set<string>()
  const positions = new Set<string>()

  if (database.tierUnlocks.length !== 6) {
    issues.push('Expected exactly six tier unlock thresholds.')
  }

  for (const upgrade of database.nodes) {
    if (ids.has(upgrade.id)) {
      issues.push(`Duplicate id: ${upgrade.id}`)
    }
    ids.add(upgrade.id)

    const position = `${upgrade.tier}:${upgrade.position.row}:${upgrade.position.column}`
    if (positions.has(position)) {
      issues.push(`Colliding position: ${position}`)
    }
    positions.add(position)

    if (!Number.isInteger(upgrade.tier) || upgrade.tier < 1 || upgrade.tier > 6) {
      issues.push(`Invalid tier for ${upgrade.id}.`)
    }
    if (upgrade.maxRank !== null && (!Number.isInteger(upgrade.maxRank) || upgrade.maxRank < 1)) {
      issues.push(`Invalid rank cap for ${upgrade.id}.`)
    }
    if (upgrade.repeatable !== (upgrade.maxRank === null)) {
      issues.push(`Repeatable/cap mismatch for ${upgrade.id}.`)
    }
    if (upgrade.rankLimit.kind === 'fixed' && upgrade.rankLimit.maximum !== upgrade.maxRank) {
      issues.push(`Fixed rank-limit mismatch for ${upgrade.id}.`)
    }
    if (upgrade.rankLimit.kind === 'ascension-scaled') {
      if (!Number.isInteger(upgrade.rankLimit.ranksPerAscensionRank) || upgrade.rankLimit.ranksPerAscensionRank < 1) {
        issues.push(`Invalid Ascension-scaled rank limit for ${upgrade.id}.`)
      }
      if (
        upgrade.rankLimit.hardMaximum !== null
        && (!Number.isInteger(upgrade.rankLimit.hardMaximum) || upgrade.rankLimit.hardMaximum < 1)
      ) {
        issues.push(`Invalid hard rank cap for ${upgrade.id}.`)
      }
    }
    for (const requirement of upgrade.rankRequirements) {
      if (
        !Number.isInteger(requirement.rank)
        || requirement.rank < 1
        || (upgrade.maxRank !== null && requirement.rank > upgrade.maxRank)
        || !Number.isInteger(requirement.minimumAscensionRank)
        || requirement.minimumAscensionRank < 0
      ) {
        issues.push(`Invalid rank requirement for ${upgrade.id}.`)
      }
    }
    if (!Number.isInteger(upgrade.costPerRank) || upgrade.costPerRank < 1) {
      issues.push(`Invalid cost for ${upgrade.id}.`)
    }
    if (upgrade.effect.gameText.trim().length === 0) {
      issues.push(`Missing effect text for ${upgrade.id}.`)
    }
    if (upgrade.internal.localizationNameKey.trim().length === 0 || upgrade.internal.constructor.trim().length === 0) {
      issues.push(`Missing internal source reference for ${upgrade.id}.`)
    }
  }

  for (const upgrade of database.nodes) {
    for (const dependency of upgrade.dependencies) {
      if (!ids.has(dependency)) {
        issues.push(`Unknown dependency ${dependency} on ${upgrade.id}.`)
      }
    }
    for (const relationship of upgrade.relationships) {
      if (!ids.has(relationship.targetUpgradeId)) {
        issues.push(`Unknown relationship target ${relationship.targetUpgradeId} on ${upgrade.id}.`)
      }
    }
  }

  return issues
}
