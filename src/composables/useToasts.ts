import { shallowRef } from 'vue'
import type { Toast } from '@/types'

const toasts = shallowRef<Toast[]>([])

function toast(msg: string, type: Toast['type'] = 'success') {
  const id = Date.now() + Math.random()
  toasts.value = [...toasts.value, { id, msg, type }]
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 2500)
}

export function useToasts() {
  return { toasts, toast }
}
