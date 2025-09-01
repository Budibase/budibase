<script>
  import { selectedAutomation } from "@/stores/builder"
  import Flowchart from "./FlowChart/FlowChart.svelte"
  import { SvelteFlowProvider } from "@xyflow/svelte"
</script>

{#if $selectedAutomation?.data}
  {#key $selectedAutomation.data._id}
    <SvelteFlowProvider>
      <Flowchart automation={$selectedAutomation.data} />
    </SvelteFlowProvider>
  {/key}
{/if}
