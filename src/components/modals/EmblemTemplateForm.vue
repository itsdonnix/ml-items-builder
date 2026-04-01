<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { EmblemTemplate, StatKey } from '@/types'
import { _allEmblemSets, _allEmblemTiers, _emblemStatValues } from '@/utils/lookups'
import { STAT_NAMES, fmtStat } from '@/utils/stats'

const props = defineProps<{
  editingId: number | null
  initialData: EmblemTemplate | null
}>()

const emit = defineEmits<{
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
  (e: 'cancel'): void
}>()

const form = reactive({
  name: '',
  setId: 'assault',
  tier: 'epic',
  mainStat: '',
  minorStats: ['', '', ''] as string[],
})

watch(
  () => props.editingId,
  () => {
    if (props.initialData) {
      form.name = props.initialData.name
      form.setId = props.initialData.setId
      form.tier = props.initialData.tier
      form.mainStat = props.initialData.mainStat || ''
      form.minorStats = [...props.initialData.minorStats]
    } else {
      form.name = ''
      form.setId = 'assault'
      form.tier = 'epic'
      form.mainStat = ''
      form.minorStats = ['', '', '']
    }
  },
  { immediate: true },
)

const emblemSets = computed(() => _allEmblemSets())
const emblemTiers = computed(() => _allEmblemTiers())
const statValues = computed(() => _emblemStatValues())

const availableMainStats = computed(() => {
  const set = emblemSets.value.find((s) => s.id === form.setId)
  return set ? set.mainStats : []
})

watch(
  () => form.setId,
  () => {
    const set = emblemSets.value.find((s) => s.id === form.setId)
    if (set && !set.mainStats.includes(form.mainStat as StatKey)) form.mainStat = ''
    form.minorStats = form.minorStats.map((ms) => (ms === form.mainStat ? '' : ms))
  },
)

watch(
  () => form.mainStat,
  (v) => {
    if (!v) return
    form.minorStats = form.minorStats.map((ms) => (ms === v ? '' : ms))
  },
)

const previewStats = computed(() => {
  const list: { key: string; val: number; isMain: boolean }[] = []
  const vals = statValues.value
  if (form.mainStat) {
    list.push({
      key: form.mainStat,
      val: safeMainVal(vals, form.mainStat, form.tier),
      isMain: true,
    })
  }
  form.minorStats.forEach((k) => {
    if (k) {
      list.push({
        key: k,
        val: safeMinorVal(vals, k, form.tier),
        isMain: false,
      })
    }
  })
  return list
})

function safeMainVal(
  vals: ReturnType<typeof _emblemStatValues>,
  key: string,
  tier: string,
): number {
  return vals?.main?.[key as StatKey]?.[tier] ?? 0
}

function safeMinorVal(
  vals: ReturnType<typeof _emblemStatValues>,
  key: string,
  tier: string,
): number {
  return vals?.minor?.[key as StatKey]?.[tier] ?? 0
}

function availableMinorStats(slotIdx: number): StatKey[] {
  const excluded = new Set<string>()
  if (form.mainStat) excluded.add(form.mainStat)
  form.minorStats.forEach((s, j) => {
    if (j !== slotIdx && s) excluded.add(s)
  })
  if (!statValues.value?.minor) return []
  return Object.keys(statValues.value.minor).filter((k) => !excluded.has(k)) as StatKey[]
}

function mainStatLabel(k: string) {
  const v = safeMainVal(statValues.value, k, form.tier)
  return `${STAT_NAMES[k as StatKey]} (+${fmtStat(k as StatKey, v)})`
}

function minorStatLabel(k: string) {
  const v = safeMinorVal(statValues.value, k, form.tier)
  return `${STAT_NAMES[k as StatKey]} (+${fmtStat(k as StatKey, v)})`
}

function onSave() {
  if (!form.name.trim() || !form.mainStat) return
  emit('save', {
    editingId: props.editingId,
    name: form.name.trim(),
    setId: form.setId,
    tier: form.tier,
    mainStat: form.mainStat,
    minorStats: [...form.minorStats],
  })
}
</script>

<template>
  <div class="emblem-form-panel">
    <div class="emblem-form-title">
      {{ editingId !== null ? 'Edit Template' : 'New Template' }}
    </div>

    <div class="form-group">
      <label class="form-label">Template Name</label>
      <input
        class="form-input"
        type="text"
        v-model="form.name"
        placeholder="e.g. Fighter Burst"
        maxlength="30"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Emblem Set</label>
      <select class="form-sel" v-model="form.setId">
        <option v-for="s in emblemSets" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Tier</label>
      <div class="tier-pills">
        <button
          v-for="t in emblemTiers"
          :key="t.id"
          type="button"
          :class="['tier-pill-btn', { active: form.tier === t.id }]"
          :style="form.tier === t.id ? { background: t.color, color: t.textColor || '#fff' } : {}"
          @click="form.tier = t.id"
        >
          {{ t.name }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Main Stat</label>
      <select class="form-sel" v-model="form.mainStat">
        <option value="">-- Select --</option>
        <option v-for="k in availableMainStats" :key="k" :value="k">
          {{ mainStatLabel(k) }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Minor Stats (optional)</label>
      <div class="minor-slots">
        <div v-for="i in 3" :key="i - 1">
          <div class="minor-slot-label">Minor Stat {{ i }}</div>
          <select
            class="form-sel"
            :value="form.minorStats[i - 1]"
            @change="
              (e: Event) => {
                form.minorStats[i - 1] = (e.target as HTMLSelectElement).value
              }
            "
          >
            <option value="">-- None --</option>
            <option v-for="k in availableMinorStats(i - 1)" :key="k" :value="k">
              {{ minorStatLabel(k) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="previewStats.length > 0" class="emblem-preview">
      <div class="emblem-preview-title">Stat Preview</div>
      <div
        v-for="p in previewStats"
        :key="p.key"
        :class="['emblem-preview-stat', p.isMain ? 'main-stat' : 'minor-stat']"
      >
        <span>
          {{ p.isMain ? 'Main: ' : '' }}
          {{ STAT_NAMES[p.key as StatKey] }}
        </span>
        <span class="val">+{{ fmtStat(p.key as StatKey, p.val) }}</span>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-sm btn-danger" @click="emit('cancel')">Cancel</button>
      <button class="btn btn-accent" @click="onSave">
        <i class="fa-solid fa-check"></i> {{ editingId !== null ? 'Update' : 'Save' }} Template
      </button>
    </div>
  </div>
</template>

<style scoped>
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
.form-input {
  width: 100%;
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
.form-input:focus {
  border-color: var(--accent);
}
.form-input::placeholder {
  color: var(--muted);
}
.form-sel {
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-u);
  font-size: 0.82rem;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  transition: border 0.2s;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23686880' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.form-sel:focus {
  border-color: var(--accent);
}
.form-sel option {
  background: var(--card);
  color: var(--text);
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
.tier-pill-btn.active {
  color: #fff;
  border-color: transparent;
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
</style>
