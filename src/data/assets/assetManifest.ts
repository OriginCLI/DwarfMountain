export interface AssetManifestEntry {
  gamePath: string
  fallbackPath: string
  alt: string
}

export const assetManifest = {
  'prestige-default': {
    gamePath: '/assets/game/prestige/default.png',
    fallbackPath: '/assets/placeholders/prestige-default.svg',
    alt: 'Prestige upgrade placeholder',
  },
} as const satisfies Record<string, AssetManifestEntry>

export type AssetId = keyof typeof assetManifest

export function resolveAssetPath(assetId: AssetId, hasLocalGameAsset: boolean): string {
  const entry = assetManifest[assetId]
  return hasLocalGameAsset ? entry.gamePath : entry.fallbackPath
}
