import { profileSchemaVersion, type PlayerProfile } from '../domain/profile'

export const profileStorageKey = 'dwarf-mountain-companion:profiles:v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface StoredProfileEnvelope {
  schemaVersion: typeof profileSchemaVersion
  profiles: PlayerProfile[]
}

export class ProfileStore {
  constructor(private readonly storage: StorageLike) {}

  load(): PlayerProfile[] {
    const rawValue = this.storage.getItem(profileStorageKey)
    if (rawValue === null) {
      return []
    }

    try {
      const parsed: unknown = JSON.parse(rawValue)
      if (!isStoredProfileEnvelope(parsed)) {
        return []
      }

      return parsed.profiles
    } catch {
      return []
    }
  }

  upsert(profile: PlayerProfile): void {
    const profiles = this.load()
    const existingIndex = profiles.findIndex((candidate) => candidate.id === profile.id)

    if (existingIndex === -1) {
      profiles.push(profile)
    } else {
      profiles[existingIndex] = profile
    }

    this.write(profiles)
  }

  ensureDefault(defaultProfile: PlayerProfile): PlayerProfile {
    const [existingProfile] = this.load()
    if (existingProfile !== undefined) {
      return existingProfile
    }

    this.upsert(defaultProfile)
    return defaultProfile
  }

  remove(profileId: string): void {
    this.write(this.load().filter((profile) => profile.id !== profileId))
  }

  replaceAll(profiles: readonly PlayerProfile[]): void {
    this.write([...profiles])
  }

  private write(profiles: PlayerProfile[]): void {
    const value: StoredProfileEnvelope = {
      schemaVersion: profileSchemaVersion,
      profiles,
    }

    this.storage.setItem(profileStorageKey, JSON.stringify(value))
  }
}

function isStoredProfileEnvelope(value: unknown): value is StoredProfileEnvelope {
  if (!isRecord(value) || value.schemaVersion !== profileSchemaVersion || !Array.isArray(value.profiles)) {
    return false
  }

  return value.profiles.every(isPlayerProfile)
}

function isPlayerProfile(value: unknown): value is PlayerProfile {
  return (
    isRecord(value) &&
    value.schemaVersion === profileSchemaVersion &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.gameDataVersion === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    isRecord(value.meta) &&
    isRecord(value.prestigeRanks) &&
    isRecord(value.artifacts) &&
    isRecord(value.keys) &&
    isRecord(value.unlocks) &&
    isRecord(value.currentRun) &&
    Array.isArray(value.runHistory)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
