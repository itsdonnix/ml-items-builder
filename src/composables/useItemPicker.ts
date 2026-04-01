import { shallowRef } from 'vue'
import type { PickerState } from '@/types'

const initial: PickerState = {
  visible: false,
  buildId: null,
  slotIndex: null,
  currentItemId: null,
  buildItemIds: [],
}

export function useItemPicker() {
  const picker = shallowRef<PickerState>({ ...initial })

  function open(
    buildId: number,
    slotIndex: number,
    currentItemId: string | null,
    buildItemIds: (string | null)[],
  ) {
    picker.value = { visible: true, buildId, slotIndex, currentItemId, buildItemIds }
  }

  function close() {
    picker.value = { ...initial }
  }

  return { picker, open, close }
}
