<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import BuildItemSlot from './BuildItemSlot.vue'

export default defineComponent({
  name: 'BuildItemSlots',
  props: {
    itemIds: { type: Array as PropType<(string | null)[]>, required: true },
  },
  emits: ['open-picker', 'remove-item'] as const,
  setup(props, { emit }) {
    return () => (
      <div class="deck-items">
        {props.itemIds.map((iid, i) => (
          <BuildItemSlot
            key={i}
            itemId={iid}
            onClick={() => emit('open-picker', i)}
            onRemove={() => emit('remove-item', i)}
          />
        ))}
      </div>
    )
  },
})
</script>

<style scoped>
.deck-items {
  padding: 10px 14px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  border-bottom: 1px solid var(--border);
}
</style>
