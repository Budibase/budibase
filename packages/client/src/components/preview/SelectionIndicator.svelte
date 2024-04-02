<script>
  import { builderStore } from "stores"
  import IndicatorSet from "./IndicatorSet.svelte"

  $: color = $builderStore.editMode
    ? "var(--spectrum-global-color-static-green-500)"
    : "var(--spectrum-global-color-static-blue-600)"

  $: isScreen = $builderStore.selectedComponentId?.startsWith(
    $builderStore.screen._id
  )
</script>

<IndicatorSet
  componentId={!isScreen ? $builderStore.selectedComponentId : null}
  {color}
  zIndex={900}
  allowResizeAnchors
/>
