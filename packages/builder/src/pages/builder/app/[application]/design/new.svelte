<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import OldIndex from "./new/index.old.svelte"
  import NewIndex from "./new/[workspaceAppId]/index.svelte"

  $: index = $featureFlags.WORKSPACE_APPS ? NewIndex : OldIndex
</script>

<svelte:component this={index} />
