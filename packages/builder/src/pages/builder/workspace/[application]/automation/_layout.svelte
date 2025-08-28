<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import NewLayout from "./_flagged/layout.new.svelte"
  import OldLayout from "./_flagged/layout.old.svelte"

  $: layout = $featureFlags.WORKSPACES ? NewLayout : OldLayout
</script>

<!-- routify:options index=3 -->
<svelte:component this={layout}>
  <slot />
</svelte:component>
