<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import OldIndex from "./_flagged/index.old.svelte"
  import NewIndex from "./_flagged/index.new.svelte"

  $: index = $featureFlags.WORKSPACE_APPS ? NewIndex : OldIndex
</script>

<svelte:component this={index} />
