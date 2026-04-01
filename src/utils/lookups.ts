import type { Hero, Item, EmblemSet, EmblemTier, EmblemStatValues } from '@/types'

export const ROLES = ['Marksman', 'Fighter', 'Assassin', 'Mage', 'Tank']

let _heroes: Hero[] = []
let _items: Item[] = []
let _emblemSets: EmblemSet[] = []
let _emblemTiers: EmblemTier[] = []
let _statValues: EmblemStatValues | null = null

export function setGameData(
  heroes: Hero[],
  items: Item[],
  sets: EmblemSet[],
  tiers: EmblemTier[],
  statValues: EmblemStatValues,
) {
  _heroes = heroes
  _items = items
  _emblemSets = sets
  _emblemTiers = tiers
  _statValues = statValues
}

export function _allHeroes() {
  return _heroes
}
export function _allItems() {
  return _items
}
export function _allEmblemSets() {
  return _emblemSets
}
export function _allEmblemTiers() {
  return _emblemTiers
}
export function _emblemStatValues() {
  return _statValues
}

export function getHero(id: string | null): Hero | null {
  if (!id) return null
  return _heroes.find((h) => h.id === id) ?? null
}

export function getItem(id: string | null): Item | null {
  if (!id) return null
  return _items.find((i) => i.id === id) ?? null
}

export function getEmblemSet(id: string): EmblemSet | null {
  return _emblemSets.find((s) => s.id === id) ?? null
}

export function getEmblemTier(id: string): EmblemTier | null {
  return _emblemTiers.find((t) => t.id === id) ?? null
}

export function heroesByRole(role: string): Hero[] {
  return _heroes.filter((h) => h.role === role)
}
