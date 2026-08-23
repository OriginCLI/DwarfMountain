export const sourceTypes = [
  'official_patch',
  'official_game',
  'wiki',
  'community',
  'derived',
  'estimated',
] as const

export const sourceConfidences = ['verified', 'high', 'medium', 'low'] as const

export type SourceType = (typeof sourceTypes)[number]
export type SourceConfidence = (typeof sourceConfidences)[number]

export interface DataSource {
  sourceType: SourceType
  sourceName: string
  gameVersion?: string
  verifiedAt?: string
  confidence: SourceConfidence
  notes?: string
}

export interface SourceValidationIssue {
  code: 'missing-source' | 'missing-source-name' | 'invalid-source-type' | 'invalid-verified-at' | 'invalid-confidence'
  message: string
}

export function validateSources(sources: readonly DataSource[]): SourceValidationIssue[] {
  if (sources.length === 0) {
    return [{ code: 'missing-source', message: 'At least one data source is required.' }]
  }

  const issues: SourceValidationIssue[] = []

  for (const source of sources) {
    if (source.sourceName.trim().length === 0) {
      issues.push({ code: 'missing-source-name', message: 'Every source needs a name.' })
    }

    if (!sourceTypes.includes(source.sourceType)) {
      issues.push({ code: 'invalid-source-type', message: 'sourceType is not a supported value.' })
    }

    if (source.verifiedAt !== undefined && !isIsoCalendarDate(source.verifiedAt)) {
      issues.push({ code: 'invalid-verified-at', message: 'verifiedAt must be an ISO calendar date.' })
    }

    if (!sourceConfidences.includes(source.confidence)) {
      issues.push({ code: 'invalid-confidence', message: 'confidence is not a supported value.' })
    }
  }

  return issues
}

function isIsoCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
}
