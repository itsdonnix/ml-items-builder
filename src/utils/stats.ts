import type { StatKey, StatBreakdown, Build, EmblemTemplate } from '@/types'
import { getHero, getItem } from './lookups'
import { getEmblemStats } from './emblems'

export const STAT_KEYS: StatKey[] = [
  'physAtk',
  'magPow',
  'hp',
  'mana',
  'physDef',
  'magDef',
  'atkSpd',
  'moveSpd',
  'cdr',
  'critChance',
  'hpRegen',
  'manaRegen',
  'lifesteal',
  'spellVamp',
  'physPen',
  'magPen',
]

export const STAT_NAMES: Record<StatKey, string> = {
  physAtk: 'Physical Attack',
  magPow: 'Magic Power',
  hp: 'HP',
  mana: 'Mana',
  physDef: 'Physical Defense',
  magDef: 'Magic Defense',
  atkSpd: 'Attack Speed',
  moveSpd: 'Movement Speed',
  cdr: 'CDR',
  critChance: 'Crit Chance',
  hpRegen: 'HP Regen',
  manaRegen: 'Mana Regen',
  lifesteal: 'Lifesteal',
  spellVamp: 'Spell Vamp',
  physPen: 'Phys Pen',
  magPen: 'Magic Pen',
}

export const STAT_GROUPS: { label: string; keys: StatKey[] }[] = [
  { label: 'Offense', keys: ['physAtk', 'magPow', 'atkSpd', 'critChance', 'physPen', 'magPen'] },
  { label: 'Defense', keys: ['hp', 'mana', 'physDef', 'magDef', 'hpRegen', 'manaRegen'] },
  { label: 'Utility', keys: ['moveSpd', 'cdr', 'lifesteal', 'spellVamp'] },
]

export const STAT_SUFFIX: Partial<Record<StatKey, string>> = {
  atkSpd: '%',
  cdr: '%',
  critChance: '%',
  lifesteal: '%',
  spellVamp: '%',
  physPen: '%',
  magPen: '%',
}

export function fmtStat(key: StatKey, val: number): string {
  if (!val) return '0'
  if (key === 'atkSpd') return Number.isInteger(val) ? val + '%' : val.toFixed(2)
  return STAT_SUFFIX[key] ? val + '%' : String(val)
}

export function calcBuildStats(
  build: Build,
  emblemTemplates: EmblemTemplate[],
): Record<StatKey, StatBreakdown> {
  const hero = getHero(build.heroId)
  const eStats = getEmblemStats(build.emblemId, emblemTemplates)
  const result = {} as Record<StatKey, StatBreakdown>

  STAT_KEYS.forEach((key) => {
    const hv = hero?.stats[key] ?? 0
    let iv = 0
    build.itemIds.forEach((iid) => {
      if (iid) {
        const it = getItem(iid)
        if (it?.stats[key]) iv += it.stats[key]!
      }
    })
    const ev = eStats[key] ?? 0
    result[key] = { hero: hv, items: iv, emblem: ev, total: hv + iv + ev }
  })

  return result
}

export function getComparableVal(so: StatBreakdown, key: StatKey): number {
  return key === 'atkSpd' ? (so.items ?? 0) + (so.emblem ?? 0) : (so.total ?? 0)
}
