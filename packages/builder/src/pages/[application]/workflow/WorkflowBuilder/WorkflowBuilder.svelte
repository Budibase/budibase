<script>
  import { onMount } from "svelte"
  import { workflowStore, backendUiStore } from "builderStore"
  import Flowchart from "./svelte-flows/Flowchart.svelte"
  import api from "builderStore/api"

  let canvas
  let workflow
  let uiTree
  let instanceId = $backendUiStore.selectedDatabase._id

  $: workflow = $workflowStore.currentWorkflow

  $: if (workflow) uiTree = workflow ? workflow.createUiTree() : []

  function onDelete(block) {
    // TODO finish
    workflowStore.actions.deleteWorkflowBlock(block)
  }

  function onSelect(block) {
    workflowStore.update(state => {
      state.selectedWorkflowBlock = block
      return state
    })
  }
</script>

<section>
  <Flowchart blocks={uiTree} {onSelect} on:delete={onDelete} />
  <footer>
    <button class="stop-button hoverable">
      <i class="ri-stop-fill" />
    </button>
    <button class="play-button hoverable">
      <i class="ri-play-fill" />
    </button>
  </footer>
</section>

<style>
  footer {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
  }

  footer > button {
    border-radius: 100%;
    color: var(--white);
    width: 76px;
    height: 76px;
    border: none;
    background: #adaec4;
    font-size: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
  }

  .play-button:hover {
    background: var(--primary);
  }

  .stop-button:hover {
    background: var(--coral);
  }
</style>
