import type { PrestigeUpgrade } from './types'

export function getRankCost(upgrade: PrestigeUpgrade, rank: number): number {
  if (!Number.isInteger(rank) || rank < 1 || rank > upgrade.maxRank) {
    throw new RangeError(`Rank ${rank} is outside the valid range for ${upgrade.id}.`)
  }

  if (typeof upgrade.costPerRank === 'number') {
    return upgrade.costPerRank
  }

  const cost = upgrade.costPerRank[rank - 1]
  if (cost === undefined) {
    throw new RangeError(`Missing cost for rank ${rank} of ${upgrade.id}.`)
  }

  return cost
}

export function calculatePrestigeSpent(
  ownedRanks: Readonly<Record<string, number>>,
  upgrades: readonly PrestigeUpgrade[],
): number {
  return upgrades.reduce((total, upgrade) => {
    const ownedRank = Math.min(upgrade.maxRank, Math.max(0, Math.trunc(ownedRanks[upgrade.id] ?? 0)))
    let upgradeCost = 0

    for (let rank = 1; rank <= ownedRank; rank += 1) {
      upgradeCost += getRankCost(upgrade, rank)
    }

    return total + upgradeCost
  }, 0)
}
