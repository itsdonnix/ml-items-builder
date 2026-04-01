<script lang="tsx">
import { defineComponent } from 'vue'
import { useTheme } from '@/composables/useTheme'

export default defineComponent({
  name: 'AppHeader',
  emits: ['new-build', 'open-emblems'] as const,
  setup(_props, { emit }) {
    const { toggleTheme, isDark } = useTheme()

    return () => (
      <header class="app-header">
        <div class="app-logo">
          <i class="fa-solid fa-shield-halved" />
          Mobile Legends Items Builder
        </div>
        <div class="header-actions">
          <button class="btn btn-icon" onClick={toggleTheme} title="Toggle theme">
            <i class={`fa-solid ${isDark.value ? 'fa-sun' : 'fa-moon'}`} />
          </button>
          <button class="btn btn-emblem" onClick={() => emit('open-emblems')}>
            <i class="fa-solid fa-gem" /> Emblems
          </button>
          <button class="btn btn-accent" onClick={() => emit('new-build')}>
            <i class="fa-solid fa-plus" /> New Build
          </button>
        </div>
      </header>
    )
  },
})
</script>

<style scoped>
.app-header {
  height: 56px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  z-index: 20;
  transition:
    background 0.4s,
    border 0.4s;
}
.app-logo {
  font-family: var(--font-d);
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.5px;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
