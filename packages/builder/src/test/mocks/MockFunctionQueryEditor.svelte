<script lang="ts">
  import type { FunctionQueryCapabilityInput } from "@budibase/types"

  export let onSave: (
    _capabilities: FunctionQueryCapabilityInput[]
  ) => Promise<void>
</script>

<button on:click={() => onSave([])}>Save</button>
