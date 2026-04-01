import type { Hero, Item, EmblemSet, EmblemTier, EmblemStatValues } from '@/types'

const cache = new Map<string, unknown>()

async function fetchJson<T>(path: string): Promise<T> {
  if (cache.has(path)) return cache.get(path) as T
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  const data: T = await res.json()
  cache.set(path, data)
  return data
}

// Define an interface mapping data keys to their corresponding types
interface GameDataEndpoints {
  heroes: Hero[]
  items: Item[]
  emblemSets: EmblemSet[]
  emblemTiers: EmblemTier[]
  emblemStatValues: EmblemStatValues
}

// Define the paths for each data endpoint
const DATA_PATHS: { [K in keyof GameDataEndpoints]: string } = {
  heroes: 'data/heroes.json',
  items: 'data/items.json',
  emblemSets: 'data/emblem-sets.json',
  emblemTiers: 'data/emblem-tiers.json',
  emblemStatValues: 'data/emblem-stat-values.json',
}

export class GameDataClient {
  // A private generic method to fetch data for any defined endpoint
  private async _get<K extends keyof GameDataEndpoints>(key: K): Promise<GameDataEndpoints[K]> {
    const path = DATA_PATHS[key]
    return fetchJson<GameDataEndpoints[K]>(path)
  }

  getHeroes(): Promise<GameDataEndpoints['heroes']> {
    return this._get('heroes')
  }

  getItems(): Promise<GameDataEndpoints['items']> {
    return this._get('items')
  }

  getEmblemSets(): Promise<GameDataEndpoints['emblemSets']> {
    return this._get('emblemSets')
  }

  getEmblemTiers(): Promise<GameDataEndpoints['emblemTiers']> {
    return this._get('emblemTiers')
  }

  getEmblemStatValues(): Promise<GameDataEndpoints['emblemStatValues']> {
    return this._get('emblemStatValues')
  }
}

export const gameData = new GameDataClient()
