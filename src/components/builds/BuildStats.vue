<script lang="tsx">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { StatKey, StatBreakdown } from '@/types'
import { STAT_GROUPS, STAT_NAMES, fmtStat, getComparableVal } from '@/utils/stats'

export default defineComponent({
  name: 'BuildStats',
  props: {
    stats: { type: Object as PropType<Record<StatKey, StatBreakdown>>, required: true },
    bestMap: { type: Object as PropType<Record<string, number>>, default: () => ({}) },
    buildId: { type: Number, required: true },
    hasEmblem: { type: Boolean, default: false },
    hasBestMap: { type: Boolean, default: false },
  },
  setup(props) {
    function isBest(key: StatKey): boolean {
      if (!props.hasBestMap) return false
      const currentVal = getComparableVal(props.stats[key], key)
      if (currentVal <= 0) return false
      return props.bestMap[key] === props.buildId
    }

    return () => (
      <div class="deck-stats">
        {STAT_GROUPS.map((g) => (
          <div key={g.label}>
            <div class="stat-group-label">{g.label}</div>
            {g.keys.map((key) => {
              const s = props.stats[key]
              const best = isBest(key)
              return (
                <div key={key} class={['stat-row', { best }]}>
                  <span class="stat-label">{STAT_NAMES[key]}</span>
                  <span class="stat-vals">
                    <span class={s.hero ? 'stat-hero' : 'stat-zero'}>{fmtStat(key, s.hero)}</span>
                    {s.items > 0 && (
                      <>
                        <span class="stat-sep">+</span>
                        <span class="stat-build">{fmtStat(key, s.items)}</span>
                      </>
                    )}
                    {props.hasEmblem && s.emblem > 0 && (
                      <>
                        <span class="stat-sep">+</span>
                        <span class="stat-emblem">{fmtStat(key, s.emblem)}</span>
                      </>
                    )}
                    {key !== 'atkSpd' && (
                      <>
                        <span class="stat-sep">=</span>
                        <span class="stat-total">{fmtStat(key, s.total)}</span>
                      </>
                    )}
                  </span>
                  {best && (
                    <span class="best-badge">
                      <i class="fa-solid fa-caret-up" />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  },
})
</script>

<style scoped>
.deck-stats {
  flex: 1;
  overflow-y: auto;
  padding: 8px 6px;
}
.stat-group-label {
  font-family: var(--font-d);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 6px 10px 3px;
  user-select: none;
}
.stat-row {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.72rem;
  transition: background 0.15s;
  gap: 4px;
  border-left: 2px solid transparent;
}
.stat-row.best {
  background: var(--best-dim);
  border-left-color: var(--best);
}
.stat-label {
  color: var(--muted);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-vals {
  display: flex;
  align-items: center;
  gap: 3px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  font-weight: 500;
}
.stat-hero {
  color: var(--hero);
}
.stat-build {
  color: var(--build);
}
.stat-emblem {
  color: var(--emblem);
}
.stat-sep {
  color: var(--muted);
  font-weight: 300;
  font-size: 0.65rem;
}
.stat-total {
  color: var(--text);
  font-weight: 600;
}
.stat-zero {
  color: var(--muted);
  opacity: 0.5;
}
.best-badge {
  color: var(--best);
  font-size: 0.6rem;
  margin-left: 2px;
}
</style>
