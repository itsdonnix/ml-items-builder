export interface Hero {
  id: string
  name: string
  role: string
  stats: Partial<Record<StatKey, number>>
}

export interface Item {
  id: string
  name: string
  cat: ItemCat
  stats: Partial<Record<StatKey, number>>
  passive?: string
}

export type ItemCat = 'boots' | 'attack' | 'magic' | 'defense' | 'jungle'

export type StatKey =
  | 'physAtk'
  | 'magPow'
  | 'hp'
  | 'mana'
  | 'physDef'
  | 'magDef'
  | 'atkSpd'
  | 'moveSpd'
  | 'cdr'
  | 'critChance'
  | 'hpRegen'
  | 'manaRegen'
  | 'lifesteal'
  | 'spellVamp'
  | 'physPen'
  | 'magPen'

export interface EmblemSet {
  id: string
  name: string
  icon: string
  color: string
  mainStats: StatKey[]
}

export interface EmblemTier {
  id: string
  name: string
  color: string
  textColor?: string
}

export interface EmblemStatValues {
  main: Record<StatKey, Record<string, number>>
  minor: Record<StatKey, Record<string, number>>
}

export interface Build {
  id: number
  name: string
  heroId: string | null
  emblemId: number | null
  itemIds: (string | null)[]
}

export interface EmblemTemplate {
  id: number
  name: string
  setId: string
  tier: string
  mainStat: string
  minorStats: string[]
}

export interface StatBreakdown {
  hero: number
  items: number
  emblem: number
  total: number
}

export interface DragState {
  draggingId: number | null
  overId: number | null
  side: 'left' | 'right' | null
}

export interface Toast {
  id: number
  msg: string
  type: 'success' | 'warn' | 'error'
}

export interface PickerState {
  visible: boolean
  buildId: number | null
  slotIndex: number | null
  currentItemId: string | null
  buildItemIds: (string | null)[]
}

export interface PersistedState {
  builds: Build[]
  nextBuildId: number
  emblemTemplates: EmblemTemplate[]
  nextEmblemId: number
}
