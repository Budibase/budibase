<script>
  import Modal from "svelte-simple-modal"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore";
  import api from "builderStore/api"
  import CreateWorkflowModal from "./CreateWorkflowModal.svelte";


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
    workflowStore.actions.fetch($backendUiStore.selectedDatabase._id);
  })
</script>

<section>
  <header>
    Workflows
    <i on:click={newWorkflow} class="ri-add-circle-fill" />
  </header>
  <ul>
    {#each $workflowStore.workflows as workflow}
      <li class="workflow-item">
        <i class="ri-stackshare-line" />
        {workflow.name}
      </li>
    {/each}
  </ul>
</section>

<style>
  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  i {
    color: var(--dark-grey);
  }

  i:hover {
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding: 0;
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
  }
  
  .workflow-item i {
    font-size: 24px;
    margin-right: 10px;
  }

  .workflow-item:hover {
    cursor: pointer;
    background: var(--secondary);
  }
</style>
