<script lang="ts">
  import { type AutomationStep, type EnrichedBinding } from "@budibase/types"
  import { type AutomationContext } from "@/stores/builder/automations"
  import { type FormUpdate } from "@/types/automations"

  export let bindings: EnrichedBinding[] | undefined = undefined
  export let block: AutomationStep | undefined = undefined
  export let context: AutomationContext | undefined
  export let onChange: (update: FormUpdate) => void
</script>

<!-- TODO: Escalation step UI -->
