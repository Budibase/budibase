<script>
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import NewLayout from "./_flagged/layout.new.svelte"
  import OldLayout from "./_flagged/layout.old.svelte"
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
