<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useGameData } from '@/composables/useGameData'
import { useTheme } from '@/composables/useTheme'
import { useBuilds } from '@/composables/useBuilds'
import { useEmblemTemplates } from '@/composables/useEmblemTemplates'
import { useItemPicker } from '@/composables/useItemPicker'
import { useDragReorder } from '@/composables/useDragReorder'
import AppHeader from '@/components/common/AppHeader.vue'
import BuildDeck from '@/components/builds/BuildDeck.vue'
import ItemPickerModal from '@/components/modals/ItemPickerModal.vue'
import EmblemManagerModal from '@/components/modals/EmblemManagerModal.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const { ready, loadGameData } = useGameData()
const { initTheme } = useTheme()
const {
  builds,
  newBuild,
  rename,
  removeBuild,
  duplicate,
  move,
  setHero,
  setEmblem,
  setItem,
  reorder,
} = useBuilds()
const {
  templates: emblemTemplates,
  save: saveTemplate,
  remove: removeTemplate,
} = useEmblemTemplates()
const { picker, open: openPicker, close: closePicker } = useItemPicker()
const {
  dragState,
  start: dragStart,
  over: dragOver,
  leave: dragLeave,
  end: dragEnd,
  reset: dragReset,
} = useDragReorder()

initTheme()

onMounted(async () => {
  ;(window as unknown).__showLoader?.()
  await loadGameData()
  ;(window as unknown).__hideLoader?.()

  const el = document.getElementById('app')
  if (el) el.classList.add('ready')

  const loader = document.getElementById('loader')
  if (loader) {
    loader.classList.add('hidden')
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader)
      }
    }, 600)
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (picker.value.visible) closePicker()
    if (emblemManagerVisible.value) closeEmblems()
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

function handleOpenPicker(p: { id: number; slotIndex: number }) {
  const b = builds.value.find((x) => x.id === p.id)
  if (!b) return
  openPicker(p.id, p.slotIndex, b.itemIds[p.slotIndex], b.itemIds)
}

function handlePickItem(itemId: string) {
  const bid = picker.value.buildId
  const si = picker.value.slotIndex
  if (bid === null || si === null) return
  const b = builds.value.find((x) => x.id === bid)
  if (!b) return
  if (b.itemIds.some((v, i) => i !== si && v === itemId)) {
    return
  }
  setItem(bid, si, itemId)
  closePicker()
}

function handleRemoveFromPicker() {
  const bid = picker.value.buildId
  const si = picker.value.slotIndex
  if (bid === null || si === null) return
  setItem(bid, si, null)
  closePicker()
}

function handleDragStart(e: DragEvent, id: number) {
  dragStart(id)
}

function handleDragOver(id: number, side: 'left' | 'right') {
  dragOver(id, side)
}

function handleDrop(id: number) {
  const fId = dragState.value.draggingId
  const side = dragState.value.side
  if (!fId || !side) {
    dragReset()
    return
  }
  reorder(fId, id, side)
  dragReset()
}

function handleDeleteTemplate(id: number) {
  removeTemplate(id)
  builds.value.forEach((b) => {
    if (b.emblemId === id) setEmblem(b.id, null)
  })
}

const emblemManagerVisible = ref(false)
function openEmblems() {
  emblemManagerVisible.value = true
}
function closeEmblems() {
  emblemManagerVisible.value = false
}
</script>

<template>
  <div v-if="!ready" class="loading-screen">
    <div class="loading-spinner" />
    <p>Loading game data...</p>
  </div>

  <template v-else>
    <div class="bg-blob blob-1" />
    <div class="bg-blob blob-2" />
    <div class="bg-blob blob-3" />

    <AppHeader @new-build="newBuild" @open-emblems="openEmblems" />

    <BuildDeck
      :builds="builds"
      :templates="emblemTemplates"
      :drag-state="dragState"
      @rename="(p: any) => rename(p.id, p.name)"
      @delete="removeBuild"
      @duplicate="duplicate"
      @move="(p: any) => move(p.id, p.dir)"
      @set-hero="(p: any) => setHero(p.id, p.heroId)"
      @set-emblem="(p: any) => setEmblem(p.id, p.emblemId)"
      @remove-item="(p: any) => setItem(p.id, p.slotIndex, null)"
      @open-picker="handleOpenPicker"
      @open-emblems="openEmblems"
      @drag-start="handleDragStart"
      @drag-over="handleDragOver"
      @drag-leave="dragLeave"
      @drop="handleDrop"
      @drag-end="dragEnd"
    />

    <ItemPickerModal
      :visible="picker.visible"
      :build-item-ids="picker.buildItemIds"
      :current-item-id="picker.currentItemId"
      @close="closePicker"
      @pick="handlePickItem"
      @remove="handleRemoveFromPicker"
    />

    <EmblemManagerModal
      :visible="emblemManagerVisible"
      :templates="emblemTemplates"
      @close="closeEmblems"
      @save="saveTemplate"
      @delete="handleDeleteTemplate"
    />

    <ToastContainer />
  </template>
</template>

<style scoped>
.bg-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
  animation: blobFloat 25s ease-in-out infinite;
}

.blob-1 {
  width: 500px;
  height: 500px;
  left: -150px;
  top: 15%;
  background: var(--accent);
}

.blob-2 {
  width: 350px;
  height: 350px;
  right: -80px;
  top: 55%;
  background: var(--hero);
  animation-delay: -8s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  left: 40%;
  bottom: -100px;
  background: var(--build);
  animation-delay: -15s;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  color: var(--muted);
}

.loading-screen p {
  font-size: 0.9rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
