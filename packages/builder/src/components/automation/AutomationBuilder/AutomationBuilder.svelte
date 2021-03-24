<script>
  import { automationStore } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"
  import BlockList from "./BlockList.svelte"

  $: automation = $automationStore.selectedAutomation?.automation

  function onSelect(block) {
    automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }
</script>

{#if automation}
  <BlockList />
  <Flowchart {automation} {onSelect} />
{/if}
