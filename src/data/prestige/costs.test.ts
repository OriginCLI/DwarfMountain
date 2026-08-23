import type { PrestigeUpgrade } from './types'
import { calculatePrestigeSpent, getRankCost } from './costs'

const upgrades: PrestigeUpgrade[] = [
  {
    id: 'fixed-cost',
    name: 'Fixed Cost',
    tier: 1,
    position: { row: 1, column: 1 },
    maxRank: 3,
    costPerRank: 2,
    requirements: [],
    effects: [],
    tags: ['economy'],
    synergies: [],
    icon: 'placeholder:fixed-cost',
    description: 'A test upgrade.',
    source: [],
  },
  {
    id: 'scaling-cost',
    name: 'Scaling Cost',
    tier: 2,
    position: { row: 1, column: 2 },
    maxRank: 3,
    costPerRank: [1, 3, 5],
    requirements: [],
    effects: [],
    tags: ['damage'],
    synergies: [],
    icon: 'placeholder:scaling-cost',
    description: 'Another test upgrade.',
    source: [],
  },
]

describe('Prestige costs', () => {
  it('uses the appropriate cost for each one-based rank', () => {
    expect(getRankCost(upgrades[0], 2)).toBe(2)
    expect(getRankCost(upgrades[1], 1)).toBe(1)
    expect(getRankCost(upgrades[1], 3)).toBe(5)
  })

  it('derives PP spent from owned ranks without exceeding data caps', () => {
    expect(calculatePrestigeSpent({ 'fixed-cost': 2, 'scaling-cost': 9 }, upgrades)).toBe(13)
  })
})
