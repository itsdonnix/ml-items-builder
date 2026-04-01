<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Toast } from '@/types'

export default defineComponent({
  name: 'BaseToast',
  props: {
    toast: { type: Object as PropType<Toast>, required: true },
  },
  setup(props) {
    return () => <div class={['toast', `toast-${props.toast.type}`]}>{props.toast.msg}</div>
  },
})
</script>

<style scoped>
.toast {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  box-shadow: var(--shadow);
}
.toast-success {
  border-left: 3px solid var(--best);
}
.toast-warn {
  border-left: 3px solid var(--accent);
}
.toast-error {
  border-left: 3px solid var(--danger);
}
</style>
