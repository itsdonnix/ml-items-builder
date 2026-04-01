<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EmblemTemplate } from '@/types'
import ModalShell from './ModalShell.vue'
import EmblemTemplateList from './EmblemTemplateList.vue'
import EmblemTemplateForm from './EmblemTemplateForm.vue'

const props = defineProps<{
  visible: boolean
  templates: EmblemTemplate[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    data: {
      editingId: number | null
      name: string
      setId: string
      tier: string
      mainStat: string
      minorStats: string[]
    },
  ): void
  (e: 'delete', id: number): void
}>()

const editingId = ref<number | null>(null)

const initialData = computed(() => {
  if (editingId.value === null) return null
  return props.templates.find((t) => t.id === editingId.value) ?? null
})

function createNew() {
  editingId.value = null
}

function editTemplate(id: number) {
  editingId.value = id
}

function onSave(data: {
  editingId: number | null
  name: string
  setId: string
  tier: string
  mainStat: string
  minorStats: string[]
}) {
  emit('save', data)
  editingId.value = null
}

function onDelete(id: number) {
  emit('delete', id)
  if (editingId.value === id) editingId.value = null
}

function closeEmblems() {
  emit('close')
}
</script>

<template>
  <ModalShell
    :visible="visible"
    title="Emblem Templates"
    title-icon="fa-gem"
    title-icon-color="var(--emblem)"
    width="740px"
    @close="closeEmblems"
  >
    <div class="emblem-body">
      <div class="emblem-list-panel">
        <div class="emblem-list-header">
          <span>Templates</span>
          <button class="btn btn-sm btn-accent" @click="createNew">
            <i class="fa-solid fa-plus" /> New
          </button>
        </div>
        <div class="emblem-list-scroll">
          <EmblemTemplateList
            :templates="templates"
            :editing-id="editingId"
            @select="editTemplate"
            @delete="onDelete"
          />
        </div>
      </div>
      <EmblemTemplateForm
        :key="editingId ?? 'new'"
        :editing-id="editingId"
        :initial-data="initialData"
        @save="onSave"
        @cancel="closeEmblems"
      />
    </div>
  </ModalShell>
</template>

<style scoped>
.emblem-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.emblem-list-panel {
  width: 255px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.emblem-list-header {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}
.emblem-list-header span {
  font-family: var(--font-d);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.emblem-list-scroll {
  flex: 1;
  overflow-y: auto;
}

.emblem-form-panel {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px;
}
.emblem-form-title {
  font-family: var(--font-d);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.form-group {
  margin-bottom: 14px;
}
.form-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 5px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tier-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tier-pill-btn {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  transition: all 0.2s;
}
.tier-pill-btn:hover {
  border-color: var(--text2);
}
.minor-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.minor-slot-label {
  font-size: 0.65rem;
  color: var(--muted);
  font-weight: 500;
}
.emblem-preview {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 16px;
}
.emblem-preview-title {
  font-family: var(--font-d);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.emblem-preview-stat {
  font-size: 0.75rem;
  padding: 2px 0;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.emblem-preview-stat.main-stat {
  color: var(--accent);
  font-weight: 600;
}
.emblem-preview-stat.minor-stat {
  color: var(--text2);
}
.emblem-preview-stat .val {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .emblem-body {
    flex-direction: column;
  }
  .emblem-list-panel {
    width: 100%;
    max-height: 180px;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>
