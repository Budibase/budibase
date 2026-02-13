<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import { bb } from "@/stores/bb"

  export let row: any
</script>

<ActionButton
  size="S"
  on:click={() => {
    bb.settings(`/connections/${row.sourceId}`)
  }}
>
  Edit
</ActionButton>
