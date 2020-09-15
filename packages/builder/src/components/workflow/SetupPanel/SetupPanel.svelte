<script>
  import { getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import WorkflowBlockSetup from "./WorkflowBlockSetup.svelte"
  import DeleteWorkflowModal from "./DeleteWorkflowModal.svelte"
  import { Button, Input, Label } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  let selectedTab = "SETUP"

  $: workflow = $workflowStore.selectedWorkflow && $workflowStore.selectedWorkflow.workflow

  function deleteWorkflow() {
    open(DeleteWorkflowModal, { onClosed: close }, { styleContent: { padding: "0" } })
  }

  function deleteWorkflowBlock() {
    workflowStore.actions.deleteWorkflowBlock($workflowStore.selectedBlock)
  }

  async function testWorkflow() {
    const result = await workflowStore.actions.trigger({
      workflow: $workflowStore.selectedWorkflow.workflow,
    })
    if (result.status === 200) {
      notifier.success(`Workflow ${workflow.name} triggered successfully.`)
    } else {
      notifier.danger(`Failed to trigger workflow ${workflow.name}.`)
    }
  }

  async function saveWorkflow() {
    await workflowStore.actions.save({
      instanceId: $backendUiStore.selectedDatabase._id,
      workflow,
    })
    notifier.success(`Workflow ${workflow.name} saved.`)
  }
</script>

<section>
  <header>
    <span class="hoverable" class:selected={selectedTab === 'SETUP'} on:click={() => (selectedTab = 'SETUP')}>
      Setup
    </span>
  </header>
  {#if $workflowStore.selectedBlock}
    <WorkflowBlockSetup bind:block={$workflowStore.selectedBlock} />
    <div class="buttons">
      <Button green wide data-cy="save-workflow-setup" on:click={saveWorkflow}>Save Workflow</Button>
      <Button red wide on:click={deleteWorkflowBlock}>Delete Block</Button>
    </div>
  {:else if $workflowStore.selectedWorkflow}
    <div class="panel">
      <div class="panel-body">
        <div class="block-label">
          Workflow
          <b>{workflow.name}</b>
        </div>
      </div>
      <Button secondary wide on:click={testWorkflow}>Test Workflow</Button>
      <div class="buttons">
        <Button green wide data-cy="save-workflow-setup" on:click={saveWorkflow}>Save Workflow</Button>
        <Button red wide on:click={deleteWorkflow}>Delete Workflow</Button>
      </div>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  .panel-body {
    flex: 1;
  }

  .panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  header {
    font-size: 18px;
    font-weight: 600;
    font-family: inter;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: var(--ink);
  }

  .selected {
    color: var(--ink);
  }

  .block-label {
    font-weight: 500;
    font-size: 14px;
    color: var(--grey-7);
    margin-bottom: 20px;
  }

  header > span {
    color: var(--grey-5);
    margin-right: 20px;
    cursor: pointer;
  }

  label {
    font-weight: 500;
    font-size: 14px;
    color: var(--ink);
  }

  .buttons {
    position: absolute;
    bottom: 20px;
    display: grid;
    width: 260px;
    gap: 12px;
  }

  .access-level label {
    font-weight: normal;
    color: var(--ink);
  }
</style>
