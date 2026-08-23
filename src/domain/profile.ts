export const profileSchemaVersion = 1 as const

export type ArtifactOwnership = 'unknown' | 'discovered' | 'owned' | 'retained'
export type WorldSpireStatus = 'not_started' | 'in_progress' | 'cleared'

export interface ProfileMeta {
  availablePrestigePoints: number
  ascensionRank: number
  highestMountain: number
  highestBoss: number
  worldSpireStatus: WorldSpireStatus
}

export interface CurrentRunSnapshot {
  mountainLevel?: number
  gold?: number
  mithril?: number
  souls?: number
  faith?: number
  undergroundMapping?: number
  mountainKillSeconds?: number
  denKillSeconds?: number
  looseOreCount?: number
  runnerThroughput?: number
  artifactIds?: string[]
  buildingRanks?: Record<string, number>
}

export interface RunHistoryEntry {
  startedAt: string
  endedAt?: string
  prestigeBefore: number
  prestigeAfter?: number
  highestMountain: number
  prestigePointsEarned?: number
}

export interface PlayerProfile {
  schemaVersion: typeof profileSchemaVersion
  id: string
  name: string
  gameDataVersion: string
  createdAt: string
  updatedAt: string
  meta: ProfileMeta
  prestigeRanks: Record<string, number>
  artifacts: Record<string, ArtifactOwnership>
  keys: Record<'ruby' | 'sapphire' | 'emerald', boolean>
  unlocks: Record<string, boolean>
  currentRun: CurrentRunSnapshot
  runHistory: RunHistoryEntry[]
}

export interface CreateEmptyProfileInput {
  id: string
  name: string
  gameDataVersion: string
  now: string
}

export function createEmptyProfile(input: CreateEmptyProfileInput): PlayerProfile {
  return {
    schemaVersion: profileSchemaVersion,
    id: input.id,
    name: input.name,
    gameDataVersion: input.gameDataVersion,
    createdAt: input.now,
    updatedAt: input.now,
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
  }
}
