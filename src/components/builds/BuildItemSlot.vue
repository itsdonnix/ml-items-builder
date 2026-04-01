<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { getCatColor, getItemSummary } from '@/utils/items'
import { getItem } from '@/utils/lookups'

export default defineComponent({
  name: 'BuildItemSlot',
  props: {
    itemId: { type: String as PropType<string | null>, default: null },
  },
  emits: ['click', 'remove'] as const,
  setup(props, { emit }) {
    const item = () => getItem(props.itemId ?? '')

    return () => {
      const it = item()
      if (it) {
        return (
          <div class="item-slot filled" onClick={() => emit('click')}>
            <div class="item-cat-bar" style={{ background: getCatColor(it.cat) }} />
            <div class="item-slot-info">
              <span class="item-slot-name">{it.name}</span>
              <span class="item-slot-stats">{getItemSummary(it)}</span>
            </div>
            <button
              class="item-remove"
              onClick={(e) => {
                e.stopPropagation()
                emit('remove')
              }}
            >
              <i class="fa-solid fa-xmark" />
            </button>
          </div>
        )
      }
      return (
        <div class="item-slot" onClick={() => emit('click')}>
          <i class="fa-solid fa-plus" />
        </div>
      )
    }
  },
})
</script>

<style scoped>
.item-slot {
  border: 2px dashed var(--border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 72px;
  gap: 4px;
}
.item-slot:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
}
.item-slot i {
  color: var(--muted);
  font-size: 0.85rem;
  transition: color 0.2s;
}
.item-slot:hover i {
  color: var(--accent);
}
.item-slot.filled {
  border-style: solid;
  border-color: var(--border);
  flex-direction: row;
  padding: 6px 8px;
  gap: 7px;
  align-items: center;
  overflow: hidden;
}
.item-slot.filled:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
}
.item-cat-bar {
  width: 4px;
  min-height: 38px;
  border-radius: 2px;
  flex-shrink: 0;
}
.item-slot-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.item-slot-name {
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-slot-stats {
  font-size: 0.6rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-remove {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--danger);
  color: #fff;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  z-index: 5;
}
.item-slot.filled:hover .item-remove {
  display: flex;
}
</style>
