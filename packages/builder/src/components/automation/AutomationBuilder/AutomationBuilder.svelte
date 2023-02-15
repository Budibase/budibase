<script>
  import { selectedAutomation } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"

  $: console.log($selectedAutomation)
</script>

{#if $selectedAutomation}
  <Flowchart automation={$selectedAutomation} />
{/if}
