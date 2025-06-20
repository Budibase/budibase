<script>
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import OldIndex from "./_flagged/index.old.svelte"
  import NewIndex from "./_flagged/index.new.svelte"
</script>

{#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
  <NewIndex />
{:else}
  <OldIndex />
{/if}
