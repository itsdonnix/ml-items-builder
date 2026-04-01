<script lang="tsx">
import { defineComponent, computed, ref, nextTick, watch } from 'vue'
import type { PropType } from 'vue'
import type { Build, EmblemTemplate, DragState, StatKey } from '@/types'
import { calcBuildStats, getComparableVal } from '@/utils/stats'
import BuildColumn from './BuildColumn.vue'

export default defineComponent({
  name: 'BuildDeck',
  props: {
    builds: { type: Array as PropType<Build[]>, required: true },
    templates: { type: Array as PropType<EmblemTemplate[]>, required: true },
    dragState: { type: Object as PropType<DragState>, required: true },
  },
  emits: [
    'rename',
    'delete',
    'duplicate',
    'move',
    'set-hero',
    'set-emblem',
    'remove-item',
    'open-picker',
    'open-emblems',
    'drag-start',
    'drag-over',
    'drag-leave',
    'drop',
    'drag-end',
  ] as const,
  setup(props, { emit }) {
    const wrapRef = ref<HTMLElement | null>(null)

    const bestMap = computed(() => {
      if (props.builds.length < 2) return {}
      const best: Record<string, number> = {}
      const keys: StatKey[] = [
        'physAtk',
        'magPow',
        'hp',
        'mana',
        'physDef',
        'magDef',
        'atkSpd',
        'moveSpd',
        'cdr',
        'critChance',
        'hpRegen',
        'manaRegen',
        'lifesteal',
        'spellVamp',
        'physPen',
        'magPen',
      ]
      keys.forEach((key) => {
        let mx = -Infinity
        let mid = 0
        let tied = false
        props.builds.forEach((b) => {
          const s = calcBuildStats(b, props.templates)[key]
          const v = getComparableVal(s, key)
          if (v > mx) {
            mx = v
            mid = b.id
            tied = false
          } else if (v === mx && v > 0) {
            tied = true
          }
        })
        if (mx > 0 && !tied) best[key] = mid
      })
      return best
    })

    function scrollToEnd() {
      nextTick(() => {
        if (wrapRef.value)
          wrapRef.value.scrollTo({ left: wrapRef.value.scrollWidth, behavior: 'smooth' })
      })
    }

    watch(
      () => props.builds.length,
      (newLen, oldLen) => {
        if (newLen > oldLen) scrollToEnd()
      },
    )

    function onDragOver(e: DragEvent, id: number) {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const side = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right'
      emit('drag-over', id, side)
    }

    function onDragLeave(e: DragEvent, id: number) {
      if (e.relatedTarget && (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node))
        return
      emit('drag-leave', id)
    }

    function onDrop(e: DragEvent, id: number) {
      e.preventDefault()
      emit('drop', id)
    }

    return () => {
      if (!props.builds.length) {
        return (
          <div class="deck-wrap" ref={wrapRef}>
            <div class="empty-state">
              <i class="fa-solid fa-layer-group" />
              <p>No builds yet. Click "New Build" to get started.</p>
            </div>
          </div>
        )
      }

      return (
        <div class="deck-wrap" ref={wrapRef}>
          {props.builds.map((build, idx) => (
            <BuildColumn
              key={build.id}
              build={build}
              bestMap={bestMap.value}
              isFirst={idx === 0}
              isLast={idx === props.builds.length - 1}
              templates={props.templates}
              dragState={props.dragState}
              onRename={(p: { id: number; name: string }) => emit('rename', p)}
              onDelete={(id: number) => emit('delete', id)}
              onDuplicate={(id: number) => emit('duplicate', id)}
              onMove={(p: { id: number; dir: number }) => emit('move', p)}
              onSet-hero={(p: { id: number; heroId: string | null }) => emit('set-hero', p)}
              onSet-emblem={(p: { id: number; emblemId: number | null }) => emit('set-emblem', p)}
              onRemove-item={(p: { id: number; slotIndex: number }) => emit('remove-item', p)}
              onOpen-picker={(p: { id: number; slotIndex: number }) => emit('open-picker', p)}
              onOpen-emblems={() => emit('open-emblems')}
              onDrag-start={(e: DragEvent, id: number) => emit('drag-start', e, id)}
              onDrag-end={() => emit('drag-end')}
              onDrag-over={(e: DragEvent, id: number) => onDragOver(e, id)}
              onDrag-leave={(e: DragEvent, id: number) => onDragLeave(e, id)}
              onDrop={(e: DragEvent, id: number) => onDrop(e, id)}
            />
          ))}
        </div>
      )
    }
  },
})
</script>

<style scoped>
.deck-wrap {
  height: calc(100vh - 56px);
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  padding: 16px;
  gap: 14px;
  position: relative;
  z-index: 10;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--muted);
  padding: 40px;
}
.empty-state i {
  font-size: 3rem;
  opacity: 0.3;
}
.empty-state p {
  font-size: 0.9rem;
}
</style>
