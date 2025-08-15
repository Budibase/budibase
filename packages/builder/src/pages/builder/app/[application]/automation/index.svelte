<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import NewIndex from "./_flagged/index.new.svelte"
  import OldIndex from "./_flagged/index.old.svelte"

  $: layout = $featureFlags.WORKSPACE_APPS ? NewIndex : OldIndex
</script>

<svelte:component this={layout}>
  <slot />
</svelte:component>
