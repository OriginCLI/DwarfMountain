import {
  getNextAscensionRequirement,
  getPrestigeRankCap,
  prestigeDatabase,
  type InstalledPrestigeUpgrade,
} from '../../data/prestige/installed-build'

interface PrestigeTooltipProps {
  upgrade: InstalledPrestigeUpgrade
  rank: number
  unlockSpent: number
  ascensionRank: number
}

export function PrestigeTooltip({ upgrade, rank, unlockSpent, ascensionRank }: PrestigeTooltipProps) {
  const rankCap = getPrestigeRankCap(upgrade, ascensionRank)
  const maximum = rankCap === null ? '∞' : String(rankCap)
  const isMaxed = rankCap !== null && rank >= rankCap
  const currentEffect = rank === 0 ? null : effectAtRank(upgrade.effect.plainText, rank)
  const nextEffect = isMaxed ? null : effectAtRank(upgrade.effect.plainText, rank + 1)
  const nextAscensionRequirement = getNextAscensionRequirement(upgrade, rank)
  const relationshipText = upgrade.relationships.map((relationship) => {
    if (relationship.kind === 'enables-at-run-tier') {
      return `${relationship.targetName} at run-upgrade tier ${relationship.minimumRunUpgradeTier}`
    }
    if (relationship.kind === 'grants-after-ascension') {
      return `${relationship.targetName} after Ascension at this node's rank ${relationship.minimumSourceRank}`
    }
    return `Extends ${relationship.targetName} at this node's rank ${relationship.minimumSourceRank}`
  })

  return (
    <aside className="prestige-tooltip" id="prestige-tooltip" role="tooltip" aria-live="polite">
      <p className="prestige-tooltip__eyebrow">
        Tier {upgrade.tier} · Grid {upgrade.position.row + 1}:{upgrade.position.column + 1}
        {upgrade.position.confidence === 'unverified' ? ' · unverified order' : ''}
      </p>
      <h3>{upgrade.name}</h3>
      <p className="prestige-tooltip__rank">Rank {rank} / {maximum}</p>
      <div className="prestige-tooltip__rule" />
      <dl>
        <div>
          <dt>Current-rank effect</dt>
          <dd>{rank === 0 ? 'Not owned.' : currentEffect?.specific ? currentEffect.text : `Rank ${rank}; exact formula is shown below.`}</dd>
        </div>
        <div>
          <dt>Next-rank effect</dt>
          <dd>
            {isMaxed
              ? nextAscensionRequirement !== null && ascensionRank < nextAscensionRequirement.minimumAscensionRank
                ? `Rank ${rank + 1} requires Ascension Rank ${nextAscensionRequirement.minimumAscensionRank}.`
                : 'Maximum legal rank reached for the current Ascension Rank.'
              : nextEffect?.specific
                ? nextEffect.text
                : `Rank ${rank + 1} uses the exact formula shown below.`}
          </dd>
        </div>
        <div>
          <dt>Installed effect data</dt>
          <dd>{upgrade.effect.plainText}</dd>
        </div>
        <div>
          <dt>Next rank</dt>
          <dd>{isMaxed ? 'No legal purchase at the current Ascension Rank.' : `Next rank cost ${upgrade.costPerRank} PP`}</dd>
        </div>
        <div>
          <dt>Total invested</dt>
          <dd>{rank * upgrade.costPerRank} PP</dd>
        </div>
        <div>
          <dt>Requirement</dt>
          <dd>
            {unlockSpent === 0 ? 'Tier 1 is available immediately.' : `Tier ${upgrade.tier} unlocks at ${unlockSpent} PP spent.`}
            {upgrade.requirements.filter((requirement) => requirement.kind === 'run-upgrade-tier').map(
              (requirement) => ` Also requires ${requirement.name} run-upgrade tier ${requirement.minimumTier}.`,
            )}
            {upgrade.rankLimit.kind === 'ascension-scaled'
              ? ` Purchase limit: ${upgrade.rankLimit.ranksPerAscensionRank} per Ascension Rank${upgrade.rankLimit.hardMaximum === null ? '.' : `, ${upgrade.rankLimit.hardMaximum} maximum.`}`
              : null}
          </dd>
        </div>
        <div>
          <dt>Prestige relationships</dt>
          <dd>
            {upgrade.dependencies.length === 0 ? 'No direct Prestige purchase dependency in the native record.' : `Purchase dependencies: ${upgrade.dependencies.join(', ')}.`}
            {relationshipText.length === 0 ? ' No downstream Prestige-node relationship represented.' : ` Related nodes: ${relationshipText.join('; ')}.`}
          </dd>
        </div>
      </dl>
      <p className="prestige-tooltip__source">
        Installed build {prestigeDatabase.game.steamBuildId} · native {upgrade.internal.constructor} · localization {upgrade.internal.localizationNameKey}
      </p>
      <p className="prestige-tooltip__optimizer">Optimizer score: not calculated until Phase 3.</p>
    </aside>
  )
}

function effectAtRank(text: string, rank: number): { text: string; specific: boolean } {
  let specific = false
  const resolved = text.replace(/\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)+/g, (sequence) => {
    const values = sequence.split('/')
    if (rank < 1 || rank > values.length) return sequence
    specific = true
    return values[rank - 1]
  })
  return { text: resolved, specific }
}
