<script lang="tsx">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue'
import type { Build, EmblemTemplate, DragState } from '@/types'
import { calcBuildStats } from '@/utils/stats'
import BuildHeroSelect from './BuildHeroSelect.vue'
import BuildEmblemSelect from './BuildEmblemSelect.vue'
import BuildItemSlots from './BuildItemSlots.vue'
import BuildStats from './BuildStats.vue'

export default defineComponent({
  name: 'BuildColumn',
  props: {
    build: { type: Object as PropType<Build>, required: true },
    bestMap: { type: Object as PropType<Record<string, number>>, default: () => ({}) },
    isFirst: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
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
    'drag-end',
    'drag-over',
    'drag-leave',
    'drop',
  ] as const,
  setup(props, { emit }) {
    const canDrag = ref(false)

    const stats = computed(() => calcBuildStats(props.build, props.templates))
    const hasEmblem = computed(() => !!props.templates.find((t) => t.id === props.build.emblemId))
    const hasBestMap = computed(() => Object.keys(props.bestMap).length > 0)

    function onNameChange(e: Event) {
      emit('rename', { id: props.build.id, name: (e.target as HTMLInputElement).value })
    }

    function onDragStart(e: DragEvent) {
      if (!canDrag.value) {
        e.preventDefault()
        return
      }
      canDrag.value = false
      e.dataTransfer!.effectAllowed = 'move'
      e.dataTransfer!.setData('text/plain', String(props.build.id))
      emit('drag-start', e, props.build.id)
    }

    function onDragEnd() {
      canDrag.value = false
      emit('drag-end')
    }

    function onNativeDragOver(e: DragEvent) {
      emit('drag-over', e, props.build.id)
    }

    function onNativeDragLeave(e: DragEvent) {
      emit('drag-leave', e, props.build.id)
    }

    function onNativeDrop(e: DragEvent) {
      emit('drop', e, props.build.id)
    }

    return () => (
      <div
        class={['deck-column', { dragging: props.dragState.draggingId === props.build.id }]}
        draggable="true"
        onDragstart={onDragStart}
        onDragend={onDragEnd}
        onDragover={onNativeDragOver}
        onDragleave={onNativeDragLeave}
        onDrop={onNativeDrop}
      >
        <div
          class="drop-indicator left"
          style={{
            display:
              props.dragState.overId === props.build.id && props.dragState.side === 'left'
                ? ''
                : 'none',
          }}
        />
        <div
          class="drop-indicator right"
          style={{
            display:
              props.dragState.overId === props.build.id && props.dragState.side === 'right'
                ? ''
                : 'none',
          }}
        />
        <div class="deck-header">
          <div
            class="drag-handle"
            onMousedown={() => {
              canDrag.value = true
            }}
            onMouseup={() => {
              canDrag.value = false
            }}
            onMouseleave={() => {
              canDrag.value = false
            }}
            title="Drag to reorder"
          >
            <i class="fa-solid fa-grip-vertical" />
          </div>
          <input
            class="deck-name-input"
            value={props.build.name}
            onChange={onNameChange}
            maxlength={30}
            spellcheck={false}
          />
          <div class="move-btns">
            <button
              class="move-btn"
              disabled={props.isFirst}
              onClick={() => emit('move', { id: props.build.id, dir: -1 })}
            >
              <i class="fa-solid fa-chevron-left" />
            </button>
            <button
              class="move-btn"
              disabled={props.isLast}
              onClick={() => emit('move', { id: props.build.id, dir: 1 })}
            >
              <i class="fa-solid fa-chevron-right" />
            </button>
          </div>
          <button
            class="btn btn-sm btn-icon btn-dup"
            onClick={() => emit('duplicate', props.build.id)}
            title="Duplicate"
          >
            <i class="fa-solid fa-clone" />
          </button>
          <button
            class="btn btn-sm btn-icon btn-danger"
            onClick={() => emit('delete', props.build.id)}
            title="Delete"
          >
            <i class="fa-solid fa-trash-can" />
          </button>
        </div>

        <div class="deck-section">
          <BuildHeroSelect
            heroId={props.build.heroId}
            onChange={(v: string | null) => emit('set-hero', { id: props.build.id, heroId: v })}
          />
        </div>

        <BuildEmblemSelect
          emblemId={props.build.emblemId}
          templates={props.templates}
          onChange={(v: number | null) => emit('set-emblem', { id: props.build.id, emblemId: v })}
          onOpen-emblems={() => emit('open-emblems')}
        />

        <div class="stat-legend">
          <div class="legend-item">
            <div class="legend-dot" style={{ background: 'var(--hero)' }} />
            Hero
          </div>
          <div class="legend-item">
            <div class="legend-dot" style={{ background: 'var(--build)' }} />
            Items
          </div>
          {hasEmblem.value && (
            <div class="legend-item">
              <div class="legend-dot" style={{ background: 'var(--emblem)' }} />
              Emblem
            </div>
          )}
          {hasBestMap.value && (
            <div class="legend-item">
              <div class="legend-dot" style={{ background: 'var(--best)' }} />
              Best
            </div>
          )}
        </div>

        <BuildItemSlots
          itemIds={props.build.itemIds}
          onOpen-picker={(slotIndex: number) =>
            emit('open-picker', { id: props.build.id, slotIndex })
          }
          onRemove-item={(slotIndex: number) =>
            emit('remove-item', { id: props.build.id, slotIndex })
          }
        />

        <BuildStats
          stats={stats.value}
          bestMap={props.bestMap}
          buildId={props.build.id}
          hasEmblem={hasEmblem.value}
          hasBestMap={hasBestMap.value}
        />
      </div>
    )
  },
})
</script>

<style scoped>
.deck-column {
  min-width: 340px;
  max-width: 340px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition:
    background 0.4s,
    border 0.4s,
    opacity 0.2s,
    transform 0.2s;
  animation: deckIn 0.35s ease-out;
  position: relative;
}
.deck-column.dragging {
  opacity: 0.35;
  transform: scale(0.97);
}
.drop-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent);
  border-radius: 2px;
  z-index: 50;
  pointer-events: none;
  animation: dropPulse 1s ease-in-out infinite;
}
.drop-indicator.left {
  left: -9px;
}
.drop-indicator.right {
  right: -9px;
}
.deck-header {
  padding: 12px 14px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid var(--border);
}
.drag-handle {
  cursor: grab;
  color: var(--muted);
  font-size: 0.85rem;
  padding: 4px 2px;
  border-radius: 4px;
  transition:
    color 0.2s,
    background 0.2s;
  display: flex;
  align-items: center;
  user-select: none;
  flex-shrink: 0;
}
.drag-handle:hover {
  color: var(--accent);
  background: var(--accent-dim);
}
.drag-handle:active {
  cursor: grabbing;
}
.deck-name-input {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text);
  font-family: var(--font-d);
  font-weight: 700;
  font-size: 1.05rem;
  padding: 2px 6px;
  border-radius: 5px;
  flex: 1;
  outline: none;
  transition: all 0.2s;
  min-width: 0;
}
.deck-name-input:focus {
  border-color: var(--accent);
  background: var(--bg2);
}
.move-btns {
  display: flex;
  gap: 3px;
  align-items: center;
  flex-shrink: 0;
}
.move-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.6rem;
  flex-shrink: 0;
}
.move-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}
.move-btn:disabled {
  opacity: 0.2;
  cursor: default;
}
.deck-section {
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
}
.stat-legend {
  padding: 8px 14px;
  display: flex;
  gap: 12px;
  font-size: 0.62rem;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
</style>
