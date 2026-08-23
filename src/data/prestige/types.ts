import type { DataSource } from '../../domain/source'

export type PrestigeTag =
  | 'damage'
  | 'runner'
  | 'economy'
  | 'gold'
  | 'mithril'
  | 'artifact'
  | 'den'
  | 'prestige_points'
  | 'starting_power'
  | 'demolition'
  | 'ballista'
  | 'scientist'
  | 'runesmith'
  | 'spelunker'
  | 'boss'
  | 'key'
  | 'ascension'
  | 'quality_of_life'

export type Requirement =
  | { kind: 'minimum-tier'; tier: number }
  | { kind: 'prestige-rank'; upgradeId: string; minimumRank: number }
  | { kind: 'ascension-rank'; minimumRank: number }
  | { kind: 'unlock'; unlockId: string }

export type PrestigeEffect =
  | { kind: 'add'; stat: string; valuePerRank: number }
  | { kind: 'multiply'; stat: string; valuePerRank: number }
  | { kind: 'custom'; evaluator: string }

export interface PrestigeUpgrade {
  id: string
  name: string
  tier: number
  position: {
    row: number
    column: number
  }
  maxRank: number
  costPerRank: number | number[]
  requirements: Requirement[]
  effects: PrestigeEffect[]
  tags: PrestigeTag[]
  synergies: string[]
  conflicts?: string[]
  icon: string
  description: string
  source: DataSource[]
}
