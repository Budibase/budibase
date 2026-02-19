<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import type { UIWorkspaceConnection } from "@/types/workspaceConnections"

  export let row: UIWorkspaceConnection

  $: icon = row?.icon
</script>

<div class="connection-icon">
  {#if icon?.type == "icon"}
    <Icon name={icon.value} />
  {:else if icon?.type == "asset"}
    <img src={icon.value} alt="icon" height={18} width={18} />
  {:else}
    <Icon name="lock-simple" />
  {/if}
</div>
