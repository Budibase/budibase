<script>
  import { afterUpdate } from "svelte"
  import { workflowStore, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import Flowchart from "./flowchart/FlowChart.svelte"

  let section

  $: workflow =
    $workflowStore.selectedWorkflow && $workflowStore.selectedWorkflow.workflow
  $: workflowLive = workflow && workflow.live
  $: instanceId = $backendUiStore.selectedDatabase._id

  function onSelect(block) {
    workflowStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }

  function setWorkflowLive(live) {
    workflow.live = live
    workflowStore.actions.save({ instanceId, workflow })
    if (live) {
      notifier.info(`Workflow ${workflow.name} enabled.`)
    } else {
      notifier.danger(`Workflow ${workflow.name} disabled.`)
    }
  }

  afterUpdate(() => {
    section.scrollTo(0, section.scrollHeight)
  })
</script>

<section bind:this={section}>
  <Flowchart {workflow} {onSelect} />
</section>
<footer>
  {#if workflow}
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
      data-cy="activate-workflow"
      on:click={() => setWorkflowLive(true)}>
      <i class="ri-play-fill" />
    </button>
  {/if}
</footer>

<style>
  section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    height: 100%;
    position: relative;
  }

  footer {
    position: absolute;
    bottom: 20px;
    right: 30px;
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
  }
  footer > button:first-child {
    margin-right: 20px;
  }

  .play-button.highlighted {
    background: var(--purple);
  }

  .stop-button.highlighted {
    background: var(--red);
  }
</style>
