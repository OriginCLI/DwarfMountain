import { assetManifest, resolveAssetPath } from './assetManifest'

describe('asset manifest', () => {
  it('keeps game paths and fallbacks centralized for each semantic asset', () => {
    const entry = assetManifest['prestige-default']

    expect(entry.gamePath).toBe('/assets/game/prestige/default.png')
    expect(entry.fallbackPath).toBe('/assets/placeholders/prestige-default.svg')
  })

  it('uses the fallback until a local game asset is explicitly available', () => {
    expect(resolveAssetPath('prestige-default', false)).toBe('/assets/placeholders/prestige-default.svg')
    expect(resolveAssetPath('prestige-default', true)).toBe('/assets/game/prestige/default.png')
  })
})
