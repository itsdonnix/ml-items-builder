<script lang="tsx">
import { defineComponent, TransitionGroup } from 'vue'
import { useToasts } from '@/composables/useToasts'
import Toast from './Toast.vue'

export default defineComponent({
  name: 'ToastContainer',
  setup() {
    const { toasts } = useToasts()
    return () => (
      <TransitionGroup name="toast" tag="div" class="toast-wrap">
        {toasts.value.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </TransitionGroup>
    )
  },
})
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
