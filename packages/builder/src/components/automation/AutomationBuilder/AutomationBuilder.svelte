<script>
  import { selectedAutomation } from "@/stores/builder"
  import Flowchart from "./FlowChart/FlowChart.svelte"
</script>

{#if $selectedAutomation?.data}
  {#key $selectedAutomation.data._id}
    <Flowchart automation={$selectedAutomation.data} />
  {/key}
{/if}
