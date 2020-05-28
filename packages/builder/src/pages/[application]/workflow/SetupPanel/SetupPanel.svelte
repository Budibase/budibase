<script>
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import api from "builderStore/api"
  import WorkflowBlockSetup from "./WorkflowBlockSetup.svelte"
  import DeleteWorkflowModal from "./DeleteWorkflowModal.svelte"

  const { open, close } = getContext("simple-modal")

  $: workflow = $workflowStore.currentWorkflow
  $: workflowBlock = $workflowStore.selectedWorkflowBlock

  function deleteWorkflow() {
    open(
      DeleteWorkflowModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  function deleteWorkflowBlock() {
    // TODO: implement, need to put IDs against workflow blocks
    workflowStore.actions.deleteWorkflowBlock(workflowBlock)
  }
</script>

<section>
  <header>
    <span>Setup</span>
  </header>
  <div class="panel-body">
    {#if workflowBlock}
      <WorkflowBlockSetup {workflowBlock} />
      <button
        class="delete-workflow-button hoverable"
        on:click={deleteWorkflowBlock}>
        Delete Block
      </button>
    {:else if $workflowStore.currentWorkflow}
      <label class="uk-form-label">Workflow: {workflow.name}</label>
      <div class="uk-margin">
        <label class="uk-form-label">Name</label>
        <div class="uk-form-controls">
          <input
            type="text"
            class="budibase__input"
            bind:value={workflow.name} />
        </div>
      </div>
      <div class="uk-margin">
        <label class="uk-form-label">User Access</label>
        Some User Access Stuff Here
      </div>
      <button
        class="delete-workflow-button hoverable"
        on:click={deleteWorkflow}>
        Delete Workflow
      </button>
    {/if}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
  }

  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  span:not(.selected) {
    color: var(--dark-grey);
  }

  label {
    font-weight: 500;
    font-size: 14px;
    color: var(--font);
  }

  .delete-workflow-button {
    font-family: Roboto;
    width: 100%;
    border: solid 1px #f2f2f2;
    border-radius: 2px;
    background: var(--white);
    height: 32px;
    font-size: 12px;
    font-weight: 500;
  }
</style>
