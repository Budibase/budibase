<script lang="ts">
  import { dndIsDragging, builderStore } from "@/stores"
  import IndicatorSet from "./IndicatorSet.svelte"

  $: color = $builderStore.editMode
    ? "var(--spectrum-global-color-static-green-500)"
    : "var(--spectrum-global-color-static-blue-600)"
</script>

{#if !$dndIsDragging && $builderStore.selectedComponentId}
  <IndicatorSet
    componentId={$builderStore.selectedComponentId}
    {color}
    zIndex={900}
    allowResizeAnchors
  />
{/if}
