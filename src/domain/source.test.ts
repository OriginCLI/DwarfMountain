import { validateSources, type DataSource } from './source'

describe('source validation', () => {
  it('requires at least one named source for displayed game data', () => {
    expect(validateSources([])).toEqual([
      { code: 'missing-source', message: 'At least one data source is required.' },
    ])
  })

  it('accepts a versioned local-game observation', () => {
    const source: DataSource = {
      sourceType: 'official_game',
      sourceName: 'Installed Steam build 24333424',
      gameVersion: 'build 24333424',
      verifiedAt: '2026-08-23',
      confidence: 'verified',
      notes: 'Read locally; no source file was copied.',
    }

    expect(validateSources([source])).toEqual([])
  })

  it('reports invalid source fields instead of accepting a plausible record', () => {
    const invalidSource = {
      sourceType: 'official_game',
      sourceName: ' ',
      verifiedAt: 'not-a-date',
      confidence: 'certain',
    } as unknown as DataSource

    expect(validateSources([invalidSource])).toEqual([
      { code: 'missing-source-name', message: 'Every source needs a name.' },
      { code: 'invalid-verified-at', message: 'verifiedAt must be an ISO calendar date.' },
      { code: 'invalid-confidence', message: 'confidence is not a supported value.' },
    ])
  })
})
