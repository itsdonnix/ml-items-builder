import { shallowRef } from 'vue'
import type { DragState } from '@/types'

const initial: DragState = { draggingId: null, overId: null, side: null }

export function useDragReorder() {
  const dragState = shallowRef<DragState>({ ...initial })

  function start(id: number) {
    dragState.value = { ...dragState.value, draggingId: id }
  }

  function over(id: number, side: 'left' | 'right') {
    if (id === dragState.value.draggingId) return
    if (dragState.value.overId !== id || dragState.value.side !== side) {
      dragState.value = { ...dragState.value, overId: id, side }
    }
  }

  function leave(id: number) {
    if (dragState.value.overId === id) {
      dragState.value = { ...dragState.value, overId: null, side: null }
    }
  }

  function end() {
    dragState.value = { ...initial }
  }

  function reset() {
    dragState.value = { ...initial }
  }

  return { dragState, start, over, leave, end, reset }
}
