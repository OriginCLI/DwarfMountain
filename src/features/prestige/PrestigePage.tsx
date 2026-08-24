import { useMemo, useState } from 'react'
import {
  getNextAscensionRequirement,
  getPrestigeRankCap,
  prestigeDatabase,
  prestigeUpgrades,
  type InstalledPrestigeUpgrade,
} from '../../data/prestige/installed-build'
import type { PlayerProfile } from '../../domain/profile'
import { PrestigeNode } from './PrestigeNode'
import { PrestigeTooltip } from './PrestigeTooltip'
import './prestige.css'

interface PrestigePageProps {
  profile: PlayerProfile
  onProfileChange: (profile: PlayerProfile) => void
}

export function calculatePrestigeSpent(ranks: Readonly<Record<string, number>>): number {
  return prestigeUpgrades.reduce((total, upgrade) => {
    const rawRank = Math.max(0, Math.trunc(ranks[upgrade.id] ?? 0))
    const rank = upgrade.maxRank === null ? rawRank : Math.min(rawRank, upgrade.maxRank)
    return total + rank * upgrade.costPerRank
  }, 0)
}

function comparePrestigePosition(left: InstalledPrestigeUpgrade, right: InstalledPrestigeUpgrade): number {
  return left.position.row - right.position.row || left.position.column - right.position.column
}

export function PrestigePage({ profile, onProfileChange }: PrestigePageProps) {
  const firstDisplayedUpgrade = prestigeUpgrades
    .filter((upgrade) => upgrade.tier === 1)
    .sort(comparePrestigePosition)[0]
  const [selectedId, setSelectedId] = useState(firstDisplayedUpgrade?.id ?? '')
  const spent = calculatePrestigeSpent(profile.prestigeRanks)
  const selectedUpgrade = prestigeUpgrades.find((upgrade) => upgrade.id === selectedId) ?? prestigeUpgrades[0]
  const tiers = useMemo(
    () => Array.from(
      { length: 6 },
      (_, index) => prestigeUpgrades
        .filter((upgrade) => upgrade.tier === index + 1)
        .sort(comparePrestigePosition),
    ),
    [],
  )
  const currentTier = prestigeDatabase.tierUnlocks.reduce(
    (highest, threshold, index) => (spent >= threshold ? index + 1 : highest),
    1,
  )
  const nextTier = currentTier < 6 ? currentTier + 1 : null

  const updateRanks = (nextRanks: Record<string, number>) => {
    onProfileChange({
      ...profile,
      updatedAt: new Date().toISOString(),
      prestigeRanks: nextRanks,
    })
  }

  const increment = (upgrade: InstalledPrestigeUpgrade, amount: number) => {
    const current = Math.max(0, Math.trunc(profile.prestigeRanks[upgrade.id] ?? 0))
    const rankCap = getPrestigeRankCap(upgrade, profile.meta.ascensionRank)
    if (rankCap !== null && current >= rankCap) return
    const requested = current + amount
    const next = rankCap === null ? requested : Math.min(requested, rankCap)
    updateRanks({ ...profile.prestigeRanks, [upgrade.id]: next })
    setSelectedId(upgrade.id)
  }

  const fillRow = (target: InstalledPrestigeUpgrade) => {
    const nextRanks = { ...profile.prestigeRanks }
    const row = prestigeUpgrades
      .filter((upgrade) => upgrade.tier === target.tier && upgrade.position.row === target.position.row)
      .sort((left, right) => left.position.column - right.position.column)

    for (const upgrade of row) {
      const threshold = prestigeDatabase.tierUnlocks[upgrade.tier - 1]
      if (spent < threshold && (nextRanks[upgrade.id] ?? 0) === 0) {
        continue
      }
      const rankCap = getPrestigeRankCap(upgrade, profile.meta.ascensionRank)
      if (rankCap === 0) continue
      nextRanks[upgrade.id] = rankCap ?? Math.max(1, (nextRanks[upgrade.id] ?? 0) + 1)
    }
    updateRanks(nextRanks)
    setSelectedId(target.id)
  }

  return (
    <section className="prestige-page" id="prestige" aria-labelledby="prestige-title">
      <header className="prestige-page__header">
        <div>
          <p className="eyebrow">PERMANENT UPGRADE LEDGER</p>
          <h1 id="prestige-title">Prestige Planner</h1>
          <p className="prestige-page__instructions">Click +1 · Shift-click +3 · Ctrl+Shift-click fills a row · Right-click −1</p>
        </div>
        <div className="prestige-counters" aria-label="Prestige point summary">
          <label>
            <span>Available Prestige Points</span>
            <input
              inputMode="numeric"
              min="0"
              type="number"
              value={profile.meta.availablePrestigePoints}
              onChange={(event) => {
                const value = Math.max(0, Math.trunc(Number(event.target.value) || 0))
                onProfileChange({
                  ...profile,
                  updatedAt: new Date().toISOString(),
                  meta: { ...profile.meta, availablePrestigePoints: value },
                })
              }}
            />
          </label>
          <label>
            <span>Ascension Rank</span>
            <input
              aria-label="Ascension Rank"
              inputMode="numeric"
              min="0"
              type="number"
              value={profile.meta.ascensionRank}
              onChange={(event) => {
                const value = Math.max(0, Math.trunc(Number(event.target.value) || 0))
                onProfileChange({
                  ...profile,
                  updatedAt: new Date().toISOString(),
                  meta: { ...profile.meta, ascensionRank: value },
                })
              }}
            />
          </label>
          <div><span>PP spent</span><strong>{spent}</strong></div>
          <div><span>Current tier</span><strong>{currentTier}</strong></div>
          <div><span>Next tier</span><strong>{nextTier === null ? 'ASCENSION' : `${prestigeDatabase.tierUnlocks[nextTier - 1] - spent} PP`}</strong></div>
        </div>
      </header>

      <div className="prestige-workbench">
        <div className="prestige-tree" aria-label="Prestige upgrade tree">
          {tiers.map((upgrades, tierIndex) => {
            const tier = tierIndex + 1
            const threshold = prestigeDatabase.tierUnlocks[tierIndex]
            const tierLocked = spent < threshold
            return (
              <section className={`prestige-tier ${tierLocked ? 'is-locked' : ''}`} key={tier} aria-labelledby={`tier-${tier}-title`}>
                <header className="prestige-tier__header">
                  <div>
                    <span className="prestige-tier__roman">{toRoman(tier)}</span>
                    <h2 id={`tier-${tier}-title`}>Tier {tier}</h2>
                  </div>
                  <p>
                    {threshold === 0 ? 'OPEN' : tierLocked ? `Tier ${tier} unlocks at ${threshold} PP spent` : `UNLOCKED · ${threshold} PP`}
                    {upgrades.some((upgrade) => upgrade.position.confidence === 'unverified') ? ' · POSITION ORDER PENDING LIVE CHECK' : ''}
                  </p>
                </header>
                <div className="prestige-tier__grid">
                  {upgrades.map((upgrade) => {
                    const rank = Math.max(0, Math.trunc(profile.prestigeRanks[upgrade.id] ?? 0))
                    const rankCap = getPrestigeRankCap(upgrade, profile.meta.ascensionRank)
                    const nextAscensionRequirement = getNextAscensionRequirement(upgrade, rank)
                    const ascensionLocked = rankCap === 0 && rank === 0
                    const locked = (tierLocked || ascensionLocked) && rank === 0
                    const lockReason = tierLocked
                      ? `Tier ${tier} unlocks at ${threshold} PP spent`
                      : ascensionLocked
                        ? `Requires Ascension Rank ${nextAscensionRequirement?.minimumAscensionRank ?? 1}`
                        : null
                    return (
                      <PrestigeNode
                        key={upgrade.id}
                        upgrade={upgrade}
                        rank={rank}
                        rankCap={rankCap}
                        locked={locked}
                        lockReason={lockReason}
                        selected={upgrade.id === selectedId}
                        onSelect={(selected) => setSelectedId(selected.id)}
                        onIncrement={(event, selected) => {
                          if (event.ctrlKey && event.shiftKey) {
                            fillRow(selected)
                          } else {
                            increment(selected, event.shiftKey ? 3 : 1)
                          }
                        }}
                        onDecrement={(selected) => {
                          const current = Math.max(0, Math.trunc(profile.prestigeRanks[selected.id] ?? 0))
                          updateRanks({ ...profile.prestigeRanks, [selected.id]: Math.max(0, current - 1) })
                        }}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
        {selectedUpgrade !== undefined && (
          <div className="prestige-detail">
            <PrestigeTooltip
              upgrade={selectedUpgrade}
              rank={Math.max(0, Math.trunc(profile.prestigeRanks[selectedUpgrade.id] ?? 0))}
              unlockSpent={prestigeDatabase.tierUnlocks[selectedUpgrade.tier - 1]}
              ascensionRank={profile.meta.ascensionRank}
            />
          </div>
        )}
      </div>
    </section>
  )
}

function toRoman(value: number): string {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][value - 1] ?? String(value)
}
