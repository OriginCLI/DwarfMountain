import { createEmptyProfile } from './profile'

describe('createEmptyProfile', () => {
  it('creates a versioned local profile with safe defaults for every Phase-1 section', () => {
    const profile = createEmptyProfile({
      id: 'profile-1',
      name: 'Keean — Main Save',
      gameDataVersion: 'build 24333424',
      now: '2026-08-23T15:00:00.000Z',
    })

    expect(profile).toMatchObject({
      schemaVersion: 1,
      id: 'profile-1',
      name: 'Keean — Main Save',
      gameDataVersion: 'build 24333424',
      createdAt: '2026-08-23T15:00:00.000Z',
      updatedAt: '2026-08-23T15:00:00.000Z',
      meta: {
        availablePrestigePoints: 0,
        ascensionRank: 0,
        highestMountain: 0,
        highestBoss: 0,
        worldSpireStatus: 'not_started',
      },
      prestigeRanks: {},
      artifacts: {},
      keys: { ruby: false, sapphire: false, emerald: false },
      unlocks: {},
      currentRun: {},
      runHistory: [],
    })
  })
})
