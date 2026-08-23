import { createEmptyProfile } from '../domain/profile'
import { ProfileStore, type StorageLike } from './profileStore'

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

const profile = createEmptyProfile({
  id: 'main',
  name: 'Keean — Main Save',
  gameDataVersion: 'build 24333424',
  now: '2026-08-23T15:00:00.000Z',
})

describe('ProfileStore', () => {
  it('round-trips a profile through the supplied storage', () => {
    const store = new ProfileStore(createMemoryStorage())

    store.upsert(profile)

    expect(store.load()).toEqual([profile])
  })

  it('replaces an existing profile with the same ID instead of duplicating it', () => {
    const store = new ProfileStore(createMemoryStorage())

    store.upsert(profile)
    store.upsert({ ...profile, name: 'Keean — Revised Save' })

    expect(store.load()).toEqual([{ ...profile, name: 'Keean — Revised Save' }])
  })

  it('returns no profiles when persisted JSON is malformed', () => {
    const storage = createMemoryStorage()
    storage.setItem('dwarf-mountain-companion:profiles:v1', '{not json')

    expect(new ProfileStore(storage).load()).toEqual([])
  })

  it('uses the existing first profile before creating a default profile', () => {
    const store = new ProfileStore(createMemoryStorage())

    expect(store.ensureDefault(profile)).toEqual(profile)
    expect(store.ensureDefault({ ...profile, id: 'second', name: 'Should not be created' })).toEqual(profile)
    expect(store.load()).toEqual([profile])
  })
})
