import { shallowRef, watch } from 'vue'
import type { Build } from '@/types'
import { loadPersistedState, savePersistedState } from './usePersistence'
import { useToasts } from './useToasts'

const DEFAULT_BUILD: Build = {
  id: 1,
  name: 'Build 1',
  heroId: null,
  emblemId: null,
  itemIds: [null, null, null, null, null, null],
}

function createDefaultState() {
  return {
    builds: [{ ...DEFAULT_BUILD, itemIds: [...DEFAULT_BUILD.itemIds] }],
    nextBuildId: 2,
  }
}

export function useBuilds() {
  const { toast } = useToasts()
  const persisted = loadPersistedState()

  const builds = shallowRef<Build[]>(
    persisted?.builds?.length
      ? persisted.builds.map((b) => ({ ...b, itemIds: [...b.itemIds] }))
      : createDefaultState().builds,
  )
  const nextBuildId = shallowRef(persisted?.nextBuildId ?? 2)

  function persist() {
    savePersistedState({
      builds: builds.value,
      nextBuildId: nextBuildId.value,
    })
  }

  watch(
    [builds, nextBuildId],
    () => {
      persist()
    },
    { deep: true },
  )

  function newBuild() {
    const id = nextBuildId.value++
    builds.value = [
      ...builds.value,
      {
        id,
        name: `Build ${id}`,
        heroId: null,
        emblemId: null,
        itemIds: [null, null, null, null, null, null],
      },
    ]
    toast('New build created')
    return id
  }

  function rename(id: number, name: string) {
    builds.value = builds.value.map((b) =>
      b.id === id ? { ...b, name: name.trim() || `Build ${id}` } : b,
    )
  }

  function removeBuild(id: number) {
    if (builds.value.length <= 1) {
      toast('Cannot delete the last build', 'error')
      return
    }
    builds.value = builds.value.filter((b) => b.id !== id)
    toast('Build deleted', 'warn')
  }

  function duplicate(id: number) {
    const src = builds.value.find((b) => b.id === id)
    if (!src) return
    const nid = nextBuildId.value++
    builds.value = [
      ...builds.value,
      {
        ...src,
        id: nid,
        name: src.name + ' (copy)',
        itemIds: [...src.itemIds],
      },
    ]
    toast('Build duplicated')
    return nid
  }

  function move(id: number, dir: number) {
    const arr = [...builds.value]
    const i = arr.findIndex((b) => b.id === id)
    if (i < 0) return
    const ni = i + dir
    if (ni < 0 || ni >= arr.length) return
    ;[arr[i], arr[ni]] = [arr[ni], arr[i]]
    builds.value = arr
    toast('Build reordered')
  }

  function setHero(id: number, heroId: string | null) {
    builds.value = builds.value.map((b) => (b.id === id ? { ...b, heroId } : b))
  }

  function setEmblem(id: number, emblemId: number | null) {
    builds.value = builds.value.map((b) => (b.id === id ? { ...b, emblemId } : b))
  }

  function setItem(buildId: number, slotIndex: number, itemId: string | null) {
    builds.value = builds.value.map((b) =>
      b.id === buildId
        ? { ...b, itemIds: b.itemIds.map((v, i) => (i === slotIndex ? itemId : v)) }
        : b,
    )
  }

  function reorder(dragId: number, overId: number, side: 'left' | 'right') {
    const arr = [...builds.value]
    const fi = arr.findIndex((b) => b.id === dragId)
    if (fi < 0) return
    const [moved] = arr.splice(fi, 1)
    let ni = arr.findIndex((b) => b.id === overId)
    if (side === 'right') ni++
    arr.splice(ni, 0, moved)
    builds.value = arr
    toast('Build reordered')
  }

  function getNextBuildId() {
    return nextBuildId.value
  }

  return {
    builds,
    newBuild,
    rename,
    removeBuild,
    duplicate,
    move,
    setHero,
    setEmblem,
    setItem,
    reorder,
    getNextBuildId,
    nextBuildId,
  }
}
