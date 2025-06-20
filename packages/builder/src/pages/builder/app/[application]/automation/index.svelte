<script>
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import OldIndex from "./_old/index.svelte"
  import NewIndex from "./_new/index.svelte"
</script>

{#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
  <NewIndex />
{:else}
  <OldIndex />
{/if}
