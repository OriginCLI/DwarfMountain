import { getPrestigeRankCap, prestigeDatabase, prestigeUpgrades } from './installed-build'
import { validatePrestigeDatabase } from './validate'

describe('installed Prestige build 24333424', () => {
  it('contains the complete verified native database', () => {
    expect(prestigeUpgrades).toHaveLength(102)
    expect(prestigeDatabase.schemaVersion).toBe(2)
    expect(prestigeDatabase.tierUnlocks).toEqual([0, 12, 50, 125, 180, 250])
    expect(prestigeDatabase.game.steamBuildId).toBe('24333424')
  })

  it('has valid caps, fixed per-tier costs, dependencies, and unique positions', () => {
    expect(validatePrestigeDatabase(prestigeDatabase)).toEqual([])

    const positions = prestigeUpgrades.map(
      (upgrade) => `${upgrade.tier}:${upgrade.position.row}:${upgrade.position.column}`,
    )
    expect(new Set(positions).size).toBe(102)

    for (const upgrade of prestigeUpgrades) {
      expect(upgrade.costPerRank).toBe(upgrade.tier)
      expect(upgrade.maxRank === null || upgrade.maxRank > 0).toBe(true)
      expect(upgrade.requirements[0]).toEqual({
        kind: 'tier-spent',
        tier: upgrade.tier,
        prestigePointsSpent: prestigeDatabase.tierUnlocks[upgrade.tier - 1],
      })
      for (const dependencyId of upgrade.dependencies) {
        expect(prestigeUpgrades.some((candidate) => candidate.id === dependencyId)).toBe(true)
      }
      for (const relationship of upgrade.relationships) {
        expect(prestigeUpgrades.some((candidate) => candidate.id === relationship.targetUpgradeId)).toBe(true)
      }
    }
  })

  it('preserves the installed-build special cases', () => {
    expect(prestigeUpgrades.find((upgrade) => upgrade.id === 'p_start_runners')).toMatchObject({
      name: 'Swift Start',
      tier: 1,
      maxRank: 3,
      costPerRank: 1,
      position: { row: 0, column: 0 },
    })
    expect(prestigeUpgrades.find((upgrade) => upgrade.id === 'p_Bt6_damage_infinite')).toMatchObject({
      maxRank: null,
      repeatable: true,
      costPerRank: 6,
      rankLimit: { kind: 'unbounded' },
    })
  })

  it('models installed Ascension gates and dynamic repeatable limits', () => {
    expect(prestigeUpgrades.filter((upgrade) => upgrade.rankLimit.kind === 'ascension-scaled')).toHaveLength(12)
    expect(prestigeUpgrades.filter((upgrade) => upgrade.rankLimit.kind === 'unbounded')).toHaveLength(2)

    const invocations = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_t6_rituals_cd_infinite')!
    expect(getPrestigeRankCap(invocations, 0)).toBe(0)
    expect(getPrestigeRankCap(invocations, 1)).toBe(1)
    expect(getPrestigeRankCap(invocations, 99)).toBe(15)

    const endlessPicks = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_t6_miners_infinite')!
    expect(getPrestigeRankCap(endlessPicks, 2)).toBe(10)

    const endlessConquest = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_Bt6_damage_infinite')!
    expect(getPrestigeRankCap(endlessConquest, 0)).toBeNull()

    const vault = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_At6_keep_artifacts_choice')!
    expect(getPrestigeRankCap(vault, 0)).toBe(1)
    expect(getPrestigeRankCap(vault, 4)).toBe(3)
    expect(getPrestigeRankCap(vault, 8)).toBe(5)

    const kingOfTheSpire = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_t6_spire_artifact_bypass')!
    expect([0, 1, 4, 5].map((rank) => getPrestigeRankCap(kingOfTheSpire, rank))).toEqual([0, 1, 1, 2])
  })

  it('retains run-upgrade requirements and Prestige-node relationships from game data', () => {
    const mappedDestruction = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_mapped_destruction')!
    expect(mappedDestruction.requirements).toContainEqual({
      kind: 'run-upgrade-tier',
      upgradeId: 'powder_hall',
      name: 'Powder Hall',
      minimumTier: 3,
    })

    const ancestralHalls = prestigeUpgrades.find((upgrade) => upgrade.id === 'p_t6_building_headstart')!
    expect(ancestralHalls.relationships).toHaveLength(5)
    expect(ancestralHalls.relationships).toContainEqual({
      kind: 'grants-after-ascension',
      targetUpgradeId: 'p_shrine',
      targetName: 'Shrine',
      minimumSourceRank: 3,
    })
  })
})
