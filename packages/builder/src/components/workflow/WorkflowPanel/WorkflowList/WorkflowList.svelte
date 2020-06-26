<script>
  import Modal from "svelte-simple-modal"
  import { notifier } from "builderStore/store/notifications"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import CreateWorkflowModal from "./CreateWorkflowModal.svelte"
  import { Button } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  $: currentWorkflowId =
    $workflowStore.currentWorkflow &&
    $workflowStore.currentWorkflow.workflow._id

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
    workflowStore.actions.fetch()
  })
</script>

<section>
  <Button purple wide on:click{newWorkflow}>
    Create New Workflow
  </Button>
  <ul>
    {#each $workflowStore.workflows as workflow}
      <li
        class="workflow-item"
        class:selected={workflow._id === currentWorkflowId}
        on:click={() => workflowStore.actions.select(workflow)}>
        <i class="ri-stackshare-line" class:live={workflow.live} />
        {workflow.name}
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
  }

  i {
    color: #adaec4;
  }

  i:hover {
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding: 0;
    flex: 1;
  }

  .live {
    color: var(--primary);
  }

  li {
    font-size: 14px;
  }

  .workflow-item {
    display: flex;
    border-radius: 5px;
    padding-left: 12px;
    align-items: center;
    height: 36px;
    margin-bottom: 4px;
    color: var(--ink);
  }

  .workflow-item i {
    font-size: 24px;
    margin-right: 10px;
  }

  .workflow-item:hover {
    cursor: pointer;
    background: var(--grey-1);
  }

  .workflow-item.selected {
    background: var(--blue-light);
  }

  .new-workflow-button {
    cursor: pointer;
    border: 1px solid var(--grey-4);
    border-radius: 3px;
    width: 100%;
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    transition: all 2ms;
  }

  .new-workflow-button:hover {
    background: var(--grey-1);
  }

  .icon {
    color: var(--ink);
    font-size: 16px;
    margin-right: 4px;
  }
</style>
