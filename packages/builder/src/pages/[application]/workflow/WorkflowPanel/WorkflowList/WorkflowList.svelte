<script>
  import Modal from "svelte-simple-modal"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import api from "builderStore/api"
  import CreateWorkflowModal from "./CreateWorkflowModal.svelte"

  const { open, close } = getContext("simple-modal")

  function newWorkflow() {
    open(
      CreateWorkflowModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  onMount(() => {
    workflowStore.actions.fetch($backendUiStore.selectedDatabase._id)
  })
</script>

<section>
  <button class="new-workflow-button hoverable" on:click={newWorkflow}>
    Create New Workflow
  </button>
  <ul>
    {#each $workflowStore.workflows as workflow}
      <li
        class="workflow-item"
        class:selected={workflow._id === $workflowStore.selectedWorkflowId}
        on:click={() => workflowStore.actions.select(workflow)}>
        <i class="ri-stackshare-line" class:live={workflow.live} />
        {workflow.name}
      </li>
    {/each}
  </ul>
</section>

<style>
  i {
    color: #adaec4;
  }

  i:hover {
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  .live {
    color: var(--primary);
  }

  li {
    font-size: 14px;
  }

  .workflow-item {
    padding: 20px;
    display: flex;
    align-items: center;
    border-radius: 3px;
    height: 40px;
    font-weight: 500;
  }

  .workflow-item i {
    font-size: 24px;
    margin-right: 10px;
  }

  .workflow-item:hover {
    cursor: pointer;
    background: var(--secondary);
  }

  .workflow-item.selected {
    background: var(--secondary);
  }

  .new-workflow-button {
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
