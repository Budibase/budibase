<script lang="ts">
  import { isGridScreen, dndParent, dndSource, dndIsDragging } from "@/stores"
  import { DNDPlaceholderID } from "@/constants"
  import IndicatorSet from "./IndicatorSet.svelte"
</script>

{#if $dndIsDragging}
  {#if !$isGridScreen}
    <IndicatorSet
      componentId={$dndParent}
      color="var(--spectrum-global-color-static-green-400)"
      zIndex={920}
      prefix="Inside"
    />
  {/if}

  <IndicatorSet
    componentId={DNDPlaceholderID}
    color="var(--spectrum-global-color-static-green-500)"
    zIndex={930}
    allowResizeAnchors={false}
    background="hsl(160, 64%, 90%)"
    animate={!$isGridScreen}
    text={$dndSource?.name}
    icon={$dndSource?.icon}
  />
{/if}
