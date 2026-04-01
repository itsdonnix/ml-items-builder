<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { ItemCat } from '@/types'
import { _allItems, getItem } from '@/utils/lookups'
import { getCatColor, getCatIcon, getItemSummary, CAT_LABELS } from '@/utils/items'
import ModalShell from './ModalShell.vue'

const CATEGORIES: (ItemCat | 'all')[] = ['all', 'boots', 'attack', 'magic', 'defense', 'jungle']

const props = defineProps<{
  visible: boolean
  buildItemIds: string[]
  currentItemId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'pick', id: string): void
  (e: 'remove'): void
}>()

const search = ref('')
const category = ref<ItemCat | 'all'>('all')
const searchRef = ref<HTMLInputElement | null>(null)

const currentItem = computed(() => (props.currentItemId ? getItem(props.currentItemId) : null))

const usedIds = computed(() => {
  const s = new Set(props.buildItemIds.filter(Boolean))
  if (props.currentItemId) s.delete(props.currentItemId)
  return s
})

const filteredItems = computed(() => {
  let list = _allItems()
  if (category.value !== 'all') list = list.filter((i) => i.cat === category.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (i) => i.name.toLowerCase().includes(q) || (i.passive && i.passive.toLowerCase().includes(q)),
    )
  }
  return list
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      search.value = ''
      category.value = 'all'
      nextTick(() => searchRef.value?.focus())
    }
  },
)

function onPick(id: string) {
  if (usedIds.value.has(id)) return
  emit('pick', id)
}
</script>

<template>
  <ModalShell :visible="visible" title="Select Item" width="620px" @close="emit('close')">
    <div v-if="currentItem" class="picker-current">
      <div class="picker-current-item">
        <div class="picker-current-bar" :style="{ background: getCatColor(currentItem.cat) }" />
        <span>
          <strong>{{ currentItem.name }}</strong>
        </span>
      </div>
      <button class="btn btn-danger btn-sm" @click="emit('remove')">
        <i class="fa-solid fa-xmark" /> Remove
      </button>
    </div>
    <div class="picker-search">
      <i class="fa-solid fa-magnifying-glass" />
      <input ref="searchRef" type="text" v-model="search" placeholder="Search items..." />
    </div>
    <div class="picker-cats">
      <button
        v-for="c in CATEGORIES"
        :key="c"
        :class="['cat-pill', { active: category === c }]"
        @click="category = c"
      >
        {{ c === 'all' ? 'All Items' : CAT_LABELS[c] }}
      </button>
    </div>
    <div class="picker-grid">
      <div
        v-if="!filteredItems.length"
        style="
          grid-column: 1/-1;
          text-align: center;
          color: var(--muted);
          padding: 30px;
          font-size: 0.85rem;
        "
      >
        No items found
      </div>
      <div
        v-for="it in filteredItems"
        :key="it.id"
        :class="[
          'picker-item',
          {
            disabled: usedIds.has(it.id),
            current: it.id === currentItemId,
          },
        ]"
        @click="onPick(it.id)"
      >
        <div class="picker-item-icon" :style="{ background: getCatColor(it.cat) }">
          <i :class="`fa-solid ${getCatIcon(it.cat)}`" />
        </div>
        <div class="picker-item-info">
          <div class="picker-item-name">{{ it.name }}</div>
          <div class="picker-item-stats">{{ getItemSummary(it) }}</div>
          <div v-if="it.passive" class="picker-item-passive">{{ it.passive }}</div>
        </div>
      </div>
    </div>
  </ModalShell>
</template>

<style scoped>
.picker-current {
  padding: 10px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
}
.picker-current-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.picker-current-bar {
  width: 4px;
  height: 28px;
  border-radius: 2px;
}
.picker-search {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}
.picker-search i {
  color: var(--muted);
  font-size: 0.85rem;
}
.picker-search input {
  flex: 1;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-u);
  font-size: 0.82rem;
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s;
}
.picker-search input:focus {
  border-color: var(--accent);
}
.picker-search input::placeholder {
  color: var(--muted);
}
.picker-cats {
  padding: 10px 18px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}
.cat-pill {
  font-family: var(--font-u);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.2s;
}
.cat-pill:hover {
  border-color: var(--accent);
  color: var(--text);
}
.cat-pill.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}
.picker-grid {
  padding: 14px 18px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
}
.picker-item {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.picker-item:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}
.picker-item.disabled {
  opacity: 0.35;
  pointer-events: none;
}
.picker-item.current {
  border-color: var(--accent);
  background: var(--accent-dim);
}
.picker-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.85rem;
}
.picker-item-info {
  flex: 1;
  overflow: hidden;
}
.picker-item-name {
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 2px;
}
.picker-item-stats {
  font-size: 0.65rem;
  color: var(--muted);
  line-height: 1.4;
}
.picker-item-passive {
  font-size: 0.6rem;
  color: var(--text2);
  margin-top: 3px;
  line-height: 1.3;
  display: none;
  font-style: italic;
}
.picker-item:hover .picker-item-passive {
  display: block;
}

@media (max-width: 768px) {
  .picker-grid {
    grid-template-columns: 1fr;
  }
}
</style>
