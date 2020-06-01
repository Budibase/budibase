<script>
  import { onMount } from "svelte"
  import { workflowStore, backendUiStore } from "builderStore"
  import { notifier } from "@beyonk/svelte-notifications"
  import Flowchart from "./flowchart/Flowchart.svelte"
  import api from "builderStore/api"

  let selectedWorkflow
  let uiTree
  let instanceId = $backendUiStore.selectedDatabase._id

  $: selectedWorkflow = $workflowStore.currentWorkflow

  $: workflowLive = selectedWorkflow && selectedWorkflow.workflow.live

  $: uiTree = selectedWorkflow ? selectedWorkflow.createUiTree() : []

  $: instanceId = $backendUiStore.selectedDatabase._id

  function onSelect(block) {
    workflowStore.update(state => {
      state.selectedWorkflowBlock = block
      return state
    })
  }

  function setWorkflowLive(live) {
    const { workflow } = selectedWorkflow
    workflow.live = live
    workflowStore.actions.save({ instanceId, workflow })
    if (live) {
      notifier.info(`Workflow ${workflow.name} enabled.`)
    } else {
      notifier.danger(`Workflow ${workflow.name} disabled.`)
    }
  }
</script>

<section>
  <Flowchart blocks={uiTree} {onSelect} />
  <footer>
    {#if selectedWorkflow}
      <button
        class:highlighted={workflowLive}
        class:hoverable={workflowLive}
        class="stop-button hoverable">
        <i class="ri-stop-fill" on:click={() => setWorkflowLive(false)} />
      </button>
      <button
        class:highlighted={!workflowLive}
        class:hoverable={!workflowLive}
        class="play-button hoverable"
        on:click={() => setWorkflowLive(true)}>
        <i class="ri-play-fill" />
      </button>
    {/if}
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

  .play-button.highlighted {
    background: var(--primary);
  }

  .stop-button.highlighted {
    background: var(--coral);
  }
</style>
