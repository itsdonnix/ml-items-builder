<script lang="tsx">
import { defineComponent } from 'vue'
import { ROLES, heroesByRole } from '@/utils/lookups'

export default defineComponent({
  name: 'BuildHeroSelect',
  props: {
    heroId: { type: [String, null] as PropType<string | null>, default: null },
  },
  emits: ['change'] as const,
  setup(props, { emit }) {
    function onChange(e: Event) {
      const v = (e.target as HTMLSelectElement).value
      emit('change', v || null)
    }

    return () => (
      <select class="sel" value={props.heroId ?? ''} onChange={onChange}>
        <option value="">No Hero Selected</option>
        {ROLES.map((role) => (
          <optgroup key={role} label={role}>
            {heroesByRole(role).map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    )
  },
})
</script>
