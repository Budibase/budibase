<!-- routify:options index=3 -->
<script>
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import OldLayout from "./_flagged/layout.old.svelte"
  import NewLayout from "./_flagged/layout.new.svelte"
</script>

{#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
  <NewLayout>
    <slot />
  </NewLayout>
{:else}
  <OldLayout>
    <slot />
  </OldLayout>
{/if}
