<script lang="tsx">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { EmblemTemplate } from '@/types'
import { getEmblemSetInfo, getEmblemTierInfo } from '@/utils/emblems'
import { getEmblemSummary } from '@/utils/emblems'

export default defineComponent({
  name: 'BuildEmblemSelect',
  props: {
    emblemId: { type: [Number, null] as PropType<number | null>, default: null },
    templates: { type: Array as PropType<EmblemTemplate[]>, required: true },
  },
  emits: ['change', 'open-emblems'] as const,
  setup(props, { emit }) {
    const emblemTpl = computed(() =>
      props.emblemId ? (props.templates.find((t) => t.id === props.emblemId) ?? null) : null,
    )
    const emblemSet = computed(() =>
      emblemTpl.value ? getEmblemSetInfo(emblemTpl.value.setId) : null,
    )
    const emblemTier = computed(() =>
      emblemTpl.value ? getEmblemTierInfo(emblemTpl.value.tier) : null,
    )
    const emblemSummary = computed(() => getEmblemSummary(emblemTpl.value, props.templates))

    const templatesBySet = computed(() => {
      const map: Record<string, EmblemTemplate[]> = {}
      props.templates.forEach((t) => {
        const sn = getEmblemSetInfo(t.setId).name
        if (!map[sn]) map[sn] = []
        map[sn].push(t)
      })
      return map
    })

    function onChange(e: Event) {
      const v = (e.target as HTMLSelectElement).value
      emit('change', v ? Number(v) : null)
    }

    return () => (
      <div class="emblem-section">
        <div class="emblem-row">
          <i class="fa-solid fa-gem" />
          <select class="sel" value={props.emblemId ?? ''} onChange={onChange}>
            <option value="">No Emblem (optional)</option>
            {Object.entries(templatesBySet.value).map(([setName, tpls]) => (
              <optgroup key={setName} label={setName}>
                {tpls.map((tpl) => (
                  <option key={tpl.id} value={String(tpl.id)}>
                    {tpl.name} ({getEmblemTierInfo(tpl.tier).name})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            class="emblem-gear"
            onClick={() => emit('open-emblems')}
            title="Manage emblem templates"
          >
            <i class="fa-solid fa-gear" />
          </button>
        </div>
        {emblemTpl.value && emblemSet.value && emblemTier.value && (
          <div class="emblem-info">
            <span class="emblem-set-tag" style={{ background: emblemSet.value.color }}>
              <i
                class={`fa-solid ${emblemSet.value.icon}`}
                style={{ marginRight: '3px', fontSize: '.55rem' }}
              />
              {emblemSet.value.name}
            </span>
            <span
              class="emblem-tier-tag"
              style={{
                background: emblemTier.value.color,
                color: emblemTier.value.textColor || '#fff',
              }}
            >
              {emblemTier.value.name}
            </span>
            <span class="emblem-stats-text">{emblemSummary.value}</span>
          </div>
        )}
      </div>
    )
  },
})
</script>

<style scoped>
.emblem-section {
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
}
.emblem-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.emblem-row > i {
  color: var(--emblem);
  font-size: 0.72rem;
  flex-shrink: 0;
}
.emblem-row .sel {
  flex: 1;
}
.emblem-gear {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.65rem;
  flex-shrink: 0;
}
.emblem-gear:hover {
  border-color: var(--emblem);
  color: var(--emblem);
  background: var(--emblem-dim);
}
.emblem-info {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.emblem-set-tag {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  color: #fff;
  line-height: 1.3;
}
.emblem-tier-tag {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  line-height: 1.3;
}
.emblem-stats-text {
  font-size: 0.6rem;
  color: var(--muted);
  line-height: 1.3;
}
</style>
