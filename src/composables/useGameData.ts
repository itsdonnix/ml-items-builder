import { shallowRef } from 'vue'
import { gameData } from '@/api/client'
import { setGameData } from '@/utils/lookups'

const ready = shallowRef(false)
const error = shallowRef<Error | null>(null)

async function loadGameData() {
  try {
    const [heroes, items, emblemSets, emblemTiers, emblemStatValues] = await Promise.all([
      gameData.getHeroes(),
      gameData.getItems(),
      gameData.getEmblemSets(),
      gameData.getEmblemTiers(),
      gameData.getEmblemStatValues(),
    ])
    setGameData(heroes, items, emblemSets, emblemTiers, emblemStatValues)
    ready.value = true
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e))
  }
}

export function useGameData() {
  return { ready, error, loadGameData }
}
