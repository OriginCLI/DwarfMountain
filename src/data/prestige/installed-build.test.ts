import { getPrestigeRankCap, prestigeDatabase, prestigeUpgrades } from './installed-build'
import { validatePrestigeDatabase } from './validate'

describe('installed Prestige build 24333424', () => {
  it('contains the complete verified native database', () => {
    expect(prestigeUpgrades).toHaveLength(102)
    expect(prestigeDatabase.schemaVersion).toBe(3)
    expect(prestigeDatabase.tierUnlocks).toEqual([0, 12, 50, 125, 180, 250])
    expect(prestigeDatabase.game.steamBuildId).toBe('24333424')
  })

  it('has valid caps, fixed per-tier costs, dependencies, and unique positions', () => {
    expect(validatePrestigeDatabase(prestigeDatabase)).toEqual([])

    const positions = prestigeUpgrades.map(
      (upgrade) => `${upgrade.tier}:${upgrade.position.row}:${upgrade.position.column}`,
    )
    expect(new Set(positions).size).toBe(102)
    expect(prestigeUpgrades.filter((upgrade) => upgrade.position.confidence === 'verified')).toHaveLength(82)
    expect(prestigeUpgrades.filter((upgrade) => upgrade.position.confidence === 'unverified')).toHaveLength(20)

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

  it('matches the current game display order observed from live tooltips', () => {
    const expectedByTier: Record<number, string[]> = {
      1: [
        'p_demodwarves_free_buys', 'p_dwarf_on_mountain_kill', 'p_housing_batch_dwarves',
        'p_miners_free_buys', 'p_mountain_mithril_chance', 'p_ore_click_force',
        'p_runner_slap_bonus_add', 'p_runner_stash_capacity', 'p_start_dwarves',
        'p_start_gold_per_pp', 'p_start_gold_per_tier', 'p_start_mithril',
        'p_start_random_tier1_artifact', 'p_start_runners',
      ],
      2: [
        'p_artifact_collect_gold', 'p_buried_heirlooms_newspaper', 'p_calamity_global_cd_reduction',
        'p_calamity_runner_speed', 'p_cyberdwarf', 'p_demobombs_power', 'p_den_artifact_chance',
        'p_firefield_extend_on_hit', 'p_flamers_free_buys', 'p_forge_staff_on_build',
        'p_guaranteed_den_artifacts', 'p_harpoons_free_buys', 'p_holy_pickaxe',
        'p_laboratory_staff_on_build', 'p_miners_power', 'p_powder_hall', 'p_ritual_power',
        'p_rocks_more_gems', 'p_runner_blast_shield', 'p_runners_carry_capacity',
        'p_runners_grace', 'p_runners_marching_orders', 'p_scientist_per_6_calamities',
        'p_soul_echoes', 'p_soulbound_legacy', 'p_turrets_gyro_calibration',
      ],
      3: [
        'p_all_luck_and_gemluck', 'p_auto_click_enabled', 'p_den_hp_less', 'p_harpoon_geyser',
        'p_harpoons_menace', 'p_homingmissile', 'p_infernal_symphony_luck',
        'p_key_drop_chance_increase', 'p_laser_beam_mastery', 'p_lasers_free_buys',
        'p_manufactorum', 'p_mountain_artifact_chance', 'p_soul_per_10_calamities',
        'p_spelunkers_guild',
      ],
      4: [
        'p_alchemy', 'p_all_mithril_luck', 'p_bulldozer_rocket_salvo', 'p_click_damage_health_mul',
        'p_cluster_pick', 'p_damage_per_4_housings', 'p_dynamite_safe_impact', 'p_enchant_more_uses',
        'p_explosives_kit', 'p_geode_sanctum', 'p_laser_gem_legacy', 'p_mapped_destruction',
        'p_meadhall', 'p_nuclear_research', 'p_ore_click_aoe', 'p_ph567', 'p_railgun',
        'p_rituals_cd_less', 'p_rituals_cost_less', 'p_start_dwarves_per_pp', 'p_yeeti_arms',
      ],
      5: [
        'p_artifacts_dont_perish', 'p_artifacts_perish_not', 'p_damage_per_underground_mapping',
        'p_dwarves_cd_reduction', 'p_dwarves_cost_per_brewmaster', 'p_shrine',
        'p_siege_den_momentum',
      ],
    }

    for (const [tierText, expectedIds] of Object.entries(expectedByTier)) {
      const tier = Number(tierText)
      const actualIds = prestigeUpgrades
        .filter((upgrade) => upgrade.tier === tier)
        .sort((left, right) => (
          left.position.row - right.position.row || left.position.column - right.position.column
        ))
        .map((upgrade) => upgrade.id)
      expect(actualIds).toEqual(expectedIds)
    }
  })

  it('preserves the installed-build special cases', () => {
    expect(prestigeUpgrades.find((upgrade) => upgrade.id === 'p_start_runners')).toMatchObject({
      name: 'Swift Start',
      tier: 1,
      maxRank: 3,
      costPerRank: 1,
      position: { row: 1, column: 6, source: 'live-tooltip-observation', confidence: 'verified' },
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
