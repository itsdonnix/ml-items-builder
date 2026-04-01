import { shallowRef, watch } from 'vue'
import type { EmblemTemplate } from '@/types'
import { loadPersistedState, savePersistedState } from './usePersistence'
import { useToasts } from './useToasts'

export function useEmblemTemplates() {
  const { toast } = useToasts()
  const persisted = loadPersistedState()

  const templates = shallowRef<EmblemTemplate[]>(persisted?.emblemTemplates ?? [])
  const nextEmblemId = shallowRef(persisted?.nextEmblemId ?? 1)

  function persist() {
    savePersistedState({
      emblemTemplates: templates.value,
      nextEmblemId: nextEmblemId.value,
    })
  }

  watch(
    [templates, nextEmblemId],
    () => {
      persist()
    },
    { deep: true },
  )

  function save(data: {
    editingId: number | null
    name: string
    setId: string
    tier: string
    mainStat: string
    minorStats: string[]
  }) {
    if (data.editingId !== null) {
      templates.value = templates.value.map((t) =>
        t.id === data.editingId
          ? {
              ...t,
              name: data.name,
              setId: data.setId,
              tier: data.tier,
              mainStat: data.mainStat,
              minorStats: data.minorStats,
            }
          : t,
      )
      toast('Template updated')
    } else {
      templates.value = [
        ...templates.value,
        {
          id: nextEmblemId.value++,
          name: data.name,
          setId: data.setId,
          tier: data.tier,
          mainStat: data.mainStat,
          minorStats: data.minorStats,
        } as EmblemTemplate,
      ]
      toast('Template created')
    }
  }

  function remove(id: number) {
    templates.value = templates.value.filter((t) => t.id !== id)
    toast('Template deleted', 'warn')
  }

  return { templates, nextEmblemId, save, remove }
}
