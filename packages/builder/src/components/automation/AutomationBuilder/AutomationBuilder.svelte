<script>
  import { selectedAutomation } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"
</script>

{#if $selectedAutomation}
  <Flowchart automation={$selectedAutomation} />
{/if}
