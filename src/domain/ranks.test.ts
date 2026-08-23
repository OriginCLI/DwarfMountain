import { decreaseOwnedRank, fillTierToMaximum, increaseOwnedRank } from './ranks'

describe('rank operations', () => {
  it('increases a rank by the requested amount without exceeding its maximum', () => {
    expect(increaseOwnedRank(1, 3, 1)).toBe(2)
    expect(increaseOwnedRank(1, 3, 3)).toBe(3)
  })

  it('does not decrease a rank below zero', () => {
    expect(decreaseOwnedRank(1)).toBe(0)
    expect(decreaseOwnedRank(0)).toBe(0)
  })

  it('fills legal upgrades in a tier from left to right and leaves other tiers unchanged', () => {
    const result = fillTierToMaximum(
      [
        { id: 'late', tier: 2, column: 3, maxRank: 2, legal: true },
        { id: 'blocked', tier: 2, column: 2, maxRank: 3, legal: false },
        { id: 'first', tier: 2, column: 1, maxRank: 4, legal: true },
        { id: 'other-tier', tier: 3, column: 1, maxRank: 1, legal: true },
      ],
      { late: 1, blocked: 0, first: 2, 'other-tier': 0 },
      2,
    )

    expect(result.ranks).toEqual({ late: 2, blocked: 0, first: 4, 'other-tier': 0 })
    expect(result.changedIds).toEqual(['first', 'late'])
  })
})
