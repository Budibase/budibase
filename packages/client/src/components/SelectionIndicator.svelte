<script>
  import { builderStore } from "../store"
  import IndicatorSet from "./IndicatorSet.svelte"
</script>

<IndicatorSet
  componentId={$builderStore.selectedComponentId}
  color="rgb(66, 133, 244)"
  zIndex="910"
  transition
/>
