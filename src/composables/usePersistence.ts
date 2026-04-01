import type { PersistedState } from '@/types'

const STORAGE_KEY = 'mlb-v3'

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const d = JSON.parse(raw)
    return {
      builds: d.builds ?? [],
      nextBuildId: d.nextBuildId ?? 2,
      emblemTemplates: d.emblemTemplates ?? [],
      nextEmblemId: d.nextEmblemId ?? 1,
    }
  } catch {
    return null
  }
}

export function savePersistedState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}
