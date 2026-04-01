import type { Item, ItemCat } from '@/types'
import { STAT_NAMES, fmtStat } from './stats'

export const CAT_ICONS: Record<ItemCat, string> = {
  boots: 'fa-shoe-prints',
  attack: 'fa-crosshairs',
  magic: 'fa-wand-magic-sparkles',
  defense: 'fa-shield-halved',
  jungle: 'fa-paw',
}

export const CAT_LABELS: Record<ItemCat, string> = {
  boots: 'Boots',
  attack: 'Attack',
  magic: 'Magic',
  defense: 'Defense',
  jungle: 'Jungle',
}

export function getCatColor(cat: ItemCat): string {
  return `var(--cat-${cat})`
}

export function getCatIcon(cat: ItemCat): string {
  return CAT_ICONS[cat] || 'fa-circle'
}

export function getItemSummary(it: Item): string {
  return Object.entries(it.stats)
    .slice(0, 3)
    .map(
      ([k, v]) =>
        `+${fmtStat(k as keyof typeof STAT_NAMES, v!)} ${STAT_NAMES[k as keyof typeof STAT_NAMES]}`,
    )
    .join(' · ')
}
