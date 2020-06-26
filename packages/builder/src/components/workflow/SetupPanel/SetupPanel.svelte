<script>
  import { fade } from "svelte/transition"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import WorkflowBlockSetup from "./WorkflowBlockSetup.svelte"
  import DeleteWorkflowModal from "./DeleteWorkflowModal.svelte"
  import { Button } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  const ACCESS_LEVELS = [
    {
      name: "Admin",
      key: "ADMIN",
      canExecute: true,
      editable: false,
    },
    {
      name: "Power User",
      key: "POWER_USER",
      canExecute: true,
      editable: false,
    },
  ]

  let selectedTab = "SETUP"
  let testResult

  $: workflow =
    $workflowStore.currentWorkflow && $workflowStore.currentWorkflow.workflow
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
    workflowStore.actions.deleteWorkflowBlock(workflowBlock)
    notifier.info("Workflow block deleted.")
  }

  function testWorkflow() {
    testResult = "PASSED"
  }

  async function saveWorkflow() {
    const workflow = $workflowStore.currentWorkflow.workflow
    await workflowStore.actions.save({
      instanceId: $backendUiStore.selectedDatabase._id,
      workflow,
    })
    notifier.success(`Workflow ${workflow.name} saved.`)
  }
</script>

<section>
  <header>
    <span
      class="hoverable"
      class:selected={selectedTab === 'SETUP'}
      on:click={() => {
        selectedTab = 'SETUP'
        testResult = null
      }}>
      Setup
    </span>
    {#if !workflowBlock}
      <span
        class="test-tab"
        class:selected={selectedTab === 'TEST'}
        on:click={() => (selectedTab = 'TEST')}>
        Test
      </span>
    {/if}
  </header>
  {#if selectedTab === 'TEST'}
    <div class="uk-margin config-item">
      {#if testResult}
        <button
          transition:fade
          class:passed={testResult === 'PASSED'}
          class:failed={testResult === 'FAILED'}
          class="test-result">
          {testResult}
        </button>
      {/if}
      <Button secondary wide on:click={testWorkflow}>
        Test Workflow
      </Button>
    </div>
  {/if}
  {#if selectedTab === 'SETUP'}
    {#if workflowBlock}
      <WorkflowBlockSetup {workflowBlock} />
      <div class="buttons">
        <Button
          green wide
          data-cy="save-workflow-setup"
          on:click={saveWorkflow}>
          Save Workflow
        </Button>
        <Button
          red wide
          on:click={deleteWorkflowBlock}>
          Delete Block
        </Button>
      </div>
    {:else if $workflowStore.currentWorkflow}
      <div class="panel">
        <div class="panel-body">
          <div class="block-label">Workflow: {workflow.name}</div>
          <div class="config-item">
            <label>Name</label>
            <div class="form">
              <input
                type="text"
                class="budibase_input"
                bind:value={workflow.name} />
            </div>
          </div>
          <div class="config-item">
            <label class="uk-form-label">User Access</label>
            <div class="access-levels">
              {#each ACCESS_LEVELS as level}
                <span class="access-level">
                  <label>{level.name}</label>
                  <input
                    class="uk-checkbox"
                    type="checkbox"
                    disabled={!level.editable}
                    bind:checked={level.canExecute} />
                </span>
              {/each}
            </div>
          </div>
        </div>
        <div class="buttons">
          <Button green wide
            data-cy="save-workflow-setup"
            on:click={saveWorkflow}>
            Save Workflow
          </Button>
          <Button red wide on:click={deleteWorkflow}>
            Delete Workflow
          </Button>
        </div>
      </div>
    {/if}
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

  .config-item {
    margin-bottom: 20px;
  }

  .budibase_input {
    height: 36px;
    width: 244px;
    border-radius: 3px;
    background-color: var(--grey-2);
    border: 1px solid var(--grey-2);
    text-align: left;
    color: var(--ink);
    font-size: 14px;
    padding-left: 12px;
  }

  header > span {
    color: var(--grey-5);
    margin-right: 20px;
    cursor: pointer;
  }

  .form {
    margin-top: 12px;
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
    width: 100%;
    gap: 12px;
  }

  .access-level {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  .access-level label {
    font-weight: normal;
    color: var(--ink);
  }

  .test-result {
    border: none;
    width: 100%;
    border-radius: 3px;
    height: 32px;
    font-size: 14px;
    font-weight: 500;
    color: var(--white);
    text-align: center;
    margin-bottom: 10px;
  }

  .passed {
    background: var(--green);
  }

  .failed {
    background: var(--red);
  }
</style>
