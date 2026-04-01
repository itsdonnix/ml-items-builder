import type { StatKey, EmblemTemplate } from '@/types'
import { fmtStat } from './stats'
import { getEmblemSet, getEmblemTier, _emblemStatValues } from './lookups'
import { STAT_NAMES } from './stats'

export function getEmblemStats(
  emblemId: number | null,
  templates: EmblemTemplate[],
): Partial<Record<StatKey, number>> {
  if (!emblemId) return {}
  const tpl = templates.find((t) => t.id === emblemId)
  if (!tpl) return {}
  const vals = _emblemStatValues()
  if (!vals) return {}
  const s: Partial<Record<StatKey, number>> = {}

  if (tpl.mainStat && vals.main[tpl.mainStat as StatKey]) {
    s[tpl.mainStat as StatKey] =
      (s[tpl.mainStat as StatKey] ?? 0) + vals.main[tpl.mainStat as StatKey][tpl.tier]
  }
  tpl.minorStats.forEach((k) => {
    if (k && vals.minor[k as StatKey]) {
      s[k as StatKey] = (s[k as StatKey] ?? 0) + vals.minor[k as StatKey][tpl.tier]
    }
  })
  return s
}

export function getEmblemSummary(tpl: EmblemTemplate | null, _templates: EmblemTemplate[]): string {
  if (!tpl) return ''
  const vals = _emblemStatValues()
  if (!vals) return ''
  const parts: string[] = []
  if (tpl.mainStat && vals.main[tpl.mainStat as StatKey]) {
    const v = vals.main[tpl.mainStat as StatKey][tpl.tier]
    parts.push(`+${fmtStat(tpl.mainStat as StatKey, v)} ${STAT_NAMES[tpl.mainStat as StatKey]}`)
  }
  tpl.minorStats.forEach((k) => {
    if (k && vals.minor[k as StatKey]) {
      const v = vals.minor[k as StatKey][tpl.tier]
      parts.push(`+${fmtStat(k as StatKey, v)} ${STAT_NAMES[k as StatKey]}`)
    }
  })
  return parts.join(' · ')
}

export function getEmblemSetInfo(setId: string) {
  return (
    getEmblemSet(setId) ?? { color: '#666', icon: 'fa-gem', name: '?', mainStats: [] as StatKey[] }
  )
}

export function getEmblemTierInfo(tierId: string) {
  return getEmblemTier(tierId) ?? { color: '#666', name: tierId, textColor: '#fff' }
}
