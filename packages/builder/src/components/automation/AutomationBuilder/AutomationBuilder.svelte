<script>
  import { selectedAutomation } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"
</script>

{#if $selectedAutomation}
  {#key $selectedAutomation._id}
    <Flowchart automation={$selectedAutomation} />
  {/key}
{/if}
