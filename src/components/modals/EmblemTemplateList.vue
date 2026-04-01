<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmblemTemplate, StatKey } from '@/types'
import { _emblemStatValues } from '@/utils/lookups'
import { getEmblemSetInfo, getEmblemTierInfo } from '@/utils/emblems'
import { fmtStat, STAT_NAMES } from '@/utils/stats'

export default defineComponent({
  name: 'EmblemTemplateList',
  props: {
    templates: { type: Array as PropType<EmblemTemplate[]>, required: true },
    editingId: { type: Number as any, default: null },
  },
  emits: ['select', 'delete', 'duplicate'] as const,
  setup(props, { emit }) {
    function mainVal(tpl: EmblemTemplate): number {
      const vals = _emblemStatValues()
      if (!vals || !tpl.mainStat) return 0
      return vals.main[tpl.mainStat as StatKey]?.[tpl.tier] ?? 0
    }

    return () => (
      <>
        {props.templates.length === 0 && (
          <div class="emblem-list-empty">
            <i class="fa-solid fa-gem" />
            <p>
              No emblem templates yet.
              <br />
              Click "New" to create one.
            </p>
          </div>
        )}
        {props.templates.map((t) => {
          const set = getEmblemSetInfo(t.setId)
          const tier = getEmblemTierInfo(t.tier)
          return (
            <div
              key={t.id}
              class={['emblem-tpl', { active: props.editingId === t.id }]}
              onClick={() => emit('select', t.id)}
            >
              <div class="emblem-tpl-top">
                <div class="emblem-tpl-icon" style={{ background: set.color }}>
                  <i class={`fa-solid ${set.icon}`} />
                </div>
                <span class="emblem-tpl-name">{t.name}</span>
                <span
                  class="emblem-tpl-tier"
                  style={{ background: tier.color, color: tier.textColor || '#fff' }}
                >
                  {tier.name}
                </span>
              </div>
              <div class="emblem-tpl-main">
                {t.mainStat
                  ? `Main: +${fmtStat(t.mainStat as StatKey, mainVal(t))} ${STAT_NAMES[t.mainStat as StatKey]}`
                  : 'No main stat'}
              </div>
              <div class="emblem-tpl-actions" onClick={(e: MouseEvent) => e.stopPropagation()}>
                <button
                  class="btn btn-sm btn-secondary"
                  onClick={() => emit('duplicate', t.id)}
                  title="Duplicate"
                >
                  <i class="fa-solid fa-copy" />
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  onClick={() => emit('select', t.id)}
                  title="Edit"
                >
                  <i class="fa-solid fa-pen" />
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  onClick={() => emit('delete', t.id)}
                  title="Delete"
                >
                  <i class="fa-solid fa-trash-can" />
                </button>
              </div>
            </div>
          )
        })}
      </>
    )
  },
})
</script>

<style scoped>
.emblem-list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  gap: 10px;
  color: var(--muted);
  text-align: center;
}
.emblem-list-empty i {
  font-size: 1.5rem;
  opacity: 0.3;
}
.emblem-list-empty p {
  font-size: 0.75rem;
  line-height: 1.4;
}
.emblem-tpl {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s;
}
.emblem-tpl:hover {
  background: var(--bg2);
}
.emblem-tpl.active {
  background: var(--accent-dim);
  border-left: 3px solid var(--accent);
}
.emblem-tpl-top {
  display: flex;
  align-items: center;
  gap: 7px;
}
.emblem-tpl-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.65rem;
  flex-shrink: 0;
}
.emblem-tpl-name {
  font-size: 0.8rem;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.emblem-tpl-tier {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  color: #fff;
  line-height: 1.4;
}
.emblem-tpl-main {
  font-size: 0.65rem;
  color: var(--muted);
  margin-top: 3px;
  padding-left: 33px;
}
.emblem-tpl-actions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  padding-left: 33px;
}
.emblem-tpl-actions .btn {
  padding: 2px 8px;
  font-size: 0.7rem;
}
</style>
