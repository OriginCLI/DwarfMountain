export interface TierRankTarget {
  id: string
  tier: number
  column: number
  maxRank: number
  legal: boolean
}

export interface TierFillResult {
  ranks: Record<string, number>
  changedIds: string[]
}

export function increaseOwnedRank(currentRank: number, maxRank: number, amount = 1): number {
  return Math.min(maxRank, currentRank + amount)
}

export function decreaseOwnedRank(currentRank: number): number {
  return Math.max(0, currentRank - 1)
}

export function fillTierToMaximum(
  upgrades: readonly TierRankTarget[],
  ranks: Readonly<Record<string, number>>,
  tier: number,
): TierFillResult {
  const nextRanks = { ...ranks }
  const changedIds: string[] = []

  const matchingUpgrades = upgrades
    .filter((upgrade) => upgrade.tier === tier && upgrade.legal)
    .sort((left, right) => left.column - right.column || left.id.localeCompare(right.id))

  for (const upgrade of matchingUpgrades) {
    const currentRank = nextRanks[upgrade.id] ?? 0
    if (currentRank < upgrade.maxRank) {
      nextRanks[upgrade.id] = upgrade.maxRank
      changedIds.push(upgrade.id)
    }
  }

  return { ranks: nextRanks, changedIds }
}
