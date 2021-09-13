<script>
  import { automationStore } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"

  $: automation = $automationStore.selectedAutomation?.automation
  function onSelect(block) {
    automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }
</script>

{#if automation}
  <Flowchart {automation} {onSelect} />
{/if}
