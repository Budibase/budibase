<script>
  import { fade } from "svelte/transition"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { notifier } from "@beyonk/svelte-notifications"
  import api from "builderStore/api"
  import WorkflowBlockSetup from "./WorkflowBlockSetup.svelte"
  import DeleteWorkflowModal from "./DeleteWorkflowModal.svelte"

  const { open, close } = getContext("simple-modal")

  const ACCESS_LEVELS = [
    {
      name: "Admin",
      key: "ADMIN",
    },
    {
      name: "Power User",
      key: "POWER_USER",
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
      <button class="workflow-button hoverable" on:click={testWorkflow}>
        Test
      </button>
    </div>
  {/if}
  {#if selectedTab === 'SETUP'}
    {#if workflowBlock}
      <WorkflowBlockSetup {workflowBlock} />
      <div class="buttons">
        <button class="workflow-button hoverable" on:click={saveWorkflow}>
          Save Workflow
        </button>
        <button
          class="delete-workflow-button hoverable"
          on:click={deleteWorkflowBlock}>
          Delete Block
        </button>
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
              {#each ACCESS_LEVELS as { name, key }}
                <span class="access-level">
                  <label>{name}</label>
                  <input class="uk-checkbox" type="checkbox" />
                </span>
              {/each}
            </div>
          </div>
        </div>
        <div class="buttons">
          <button class="delete-workflow-button" on:click={deleteWorkflow}>
            Delete Workflow
          </button>
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
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    color: var(--ink);
  }

  .selected {
    color: var(--ink);
  }

  .block-label {
    font-weight: 500;
    font-size: 14px;
    color: var(--ink);
    margin: 0px 0px 16px 0px;
  }

  .config-item {
    margin: 0px 0px 4px 0px;
    padding: 12px 0px;
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
    bottom: 10px;
  }

  .delete-workflow-button {
    cursor: pointer;
    border: 1px solid var(--red);
    border-radius: 3px;
    width: 260px;
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--white);
    color: var(--red);
    font-size: 14px;
    font-weight: 500;
    transition: all 2ms;
    align-self: flex-end;
    margin-bottom: 10px;
  }

  .delete-workflow-button:hover {
    background: var(--red);
    border: 1px solid var(--red);
    color: var(--white);
  }

  .workflow-button {
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
    margin-bottom: 10px;
  }

  .workflow-button:hover {
    background: var(--grey-1);
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
    background: #84c991;
  }

  .failed {
    background: var(--red);
  }
</style>
