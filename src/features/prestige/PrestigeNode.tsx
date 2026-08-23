import type { MouseEvent } from 'react'
import type { InstalledPrestigeUpgrade } from '../../data/prestige/installed-build'

interface PrestigeNodeProps {
  upgrade: InstalledPrestigeUpgrade
  rank: number
  rankCap: number | null
  locked: boolean
  lockReason: string | null
  selected: boolean
  onSelect: (upgrade: InstalledPrestigeUpgrade) => void
  onIncrement: (event: MouseEvent<HTMLButtonElement>, upgrade: InstalledPrestigeUpgrade) => void
  onDecrement: (upgrade: InstalledPrestigeUpgrade) => void
}

export function PrestigeNode({
  upgrade,
  rank,
  rankCap,
  locked,
  lockReason,
  selected,
  onSelect,
  onIncrement,
  onDecrement,
}: PrestigeNodeProps) {
  const isMaxed = rankCap !== null && rank >= rankCap
  const state = locked ? 'locked' : isMaxed ? 'maxed' : rank > 0 ? 'partial' : 'unowned'
  const maximumLabel = rankCap === null ? 'Repeatable with no fixed cap' : `of ${rankCap}`
  const lockLabel = lockReason === null ? '' : `, Locked: ${lockReason}`
  const initials = upgrade.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '◆'

  return (
    <div className="prestige-node-control">
      <button
      className={`prestige-node prestige-node--${state}`}
      type="button"
      aria-disabled={locked}
      data-upgrade-id={upgrade.id}
      data-state={state}
      data-selected={selected}
      aria-label={`${upgrade.name}, Rank ${rank} ${maximumLabel}${lockLabel}`}
      aria-describedby="prestige-tooltip"
      aria-pressed={rank > 0}
      onClick={(event) => {
        onSelect(upgrade)
        if (!locked) onIncrement(event, upgrade)
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        onSelect(upgrade)
        if (!locked) onDecrement(upgrade)
      }}
      onFocus={() => onSelect(upgrade)}
      onMouseEnter={() => onSelect(upgrade)}
      onKeyDown={(event) => {
        if ((event.key === 'ArrowDown' || event.key === 'Delete' || event.key === 'Backspace') && rank > 0) {
          event.preventDefault()
          onDecrement(upgrade)
        }
      }}
    >
      <span className="prestige-node__icon" aria-hidden="true">{locked ? '◇' : initials}</span>
      <span className="prestige-node__cost" aria-hidden="true">{upgrade.costPerRank}</span>
      <span className="prestige-node__rank" aria-hidden="true">
        {rankCap === null || upgrade.rankLimit.kind === 'ascension-scaled' ? (
          <span className="prestige-node__infinite">{rankCap === null ? '∞' : `A${rankCap}`} {rank}</span>
        ) : (
          Array.from({ length: rankCap }, (_, index) => (
            <span className={index < rank ? 'is-filled' : ''} key={index} />
          ))
        )}
      </span>
      <span className="prestige-node__state">{state}</span>
      </button>
      <button
        className="prestige-node__decrement"
        type="button"
        aria-label={`Decrease ${upgrade.name} rank`}
        disabled={rank === 0}
        onClick={() => {
          onDecrement(upgrade)
          onSelect(upgrade)
        }}
      >−</button>
    </div>
  )
}
