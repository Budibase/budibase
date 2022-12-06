<script>
  import { automationStore } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"

  $: automation = $automationStore.selectedAutomation?.automation
</script>

{#if automation}
  <Flowchart {automation} />
{/if}
