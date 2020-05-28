<script>
  import { onMount } from "svelte"
  import { workflowStore, backendUiStore } from "builderStore"
  import Flowchart from "./svelte-flows/Flowchart.svelte"
  import api from "builderStore/api"

  let canvas
  let workflow
  let uiTree
  let instanceId = $backendUiStore.selectedDatabase._id

  $: workflow = $workflowStore.workflows.find(
    wf => wf._id === $workflowStore.selectedWorkflowId
  )

  // Build a renderable UI Tree for the flowchart generator
  function buildUiTree(block, tree = []) {
    if (!block) return tree

    tree.push({
      type: block.type, 
      heading: block.actionId,
      args: block.args,
      body: JSON.stringify(block.args),
    })

    return buildUiTree(block.next, tree)
  }

  $: if (workflow) uiTree = workflow.definition ? buildUiTree(workflow.definition.next) : []

  function onDelete(block) {
    // TODO finish
    workflowStore.actions.deleteWorkflowBlock(block);
  }

  function onSelect(block) {
    workflowStore.update(state => {
      state.selectedWorkflowBlock = block
      return state
    })
  }
</script>

<section>
  <Flowchart 
    blocks={uiTree} 
    onSelect={onSelect} 
    on:delete={onDelete}
  />
</section>
