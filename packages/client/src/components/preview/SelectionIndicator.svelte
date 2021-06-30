<script>
  import { builderStore } from "../../store"
  import IndicatorSet from "./IndicatorSet.svelte"
</script>

<IndicatorSet
  componentId={$builderStore.selectedComponentId}
  color="var(--spectrum-global-color-blue-900)"
  zIndex="910"
  transition
/>
