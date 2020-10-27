<script>
  import { automationStore, backendUiStore } from "builderStore"
  import Flowchart from "./FlowChart/FlowChart.svelte"
  import BlockList from "./BlockList.svelte"

  $: automation = $automationStore.selectedAutomation?.automation
  $: automationLive = automation?.live
  $: instanceId = $backendUiStore.selectedDatabase._id
  $: automationCount = $automationStore.automations?.length ?? 0

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
{:else if automationCount === 0}
  <i>Create your first automation to get started</i>
{:else}<i>Select an automation to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
  }
</style>
