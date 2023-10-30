<script>
  import { selectedAutomation } from "stores/frontend"
  import Flowchart from "./FlowChart/FlowChart.svelte"
</script>

{#if $selectedAutomation}
  {#key $selectedAutomation._id}
    <Flowchart automation={$selectedAutomation} />
  {/key}
{/if}
