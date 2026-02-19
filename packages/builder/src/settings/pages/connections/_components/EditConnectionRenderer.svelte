<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import type { UIWorkspaceConnection } from "@/types/workspaceConnections"

  export let row: UIWorkspaceConnection
</script>

<ActionButton
  size="S"
  on:click={() => {
    bb.settings(`/connections/${row.sourceId}`)
  }}
>
  Edit
</ActionButton>
