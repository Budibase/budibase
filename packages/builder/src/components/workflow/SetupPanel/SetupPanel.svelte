<script>
  import { fade } from "svelte/transition"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { notifier } from "@beyonk/svelte-notifications"
  import api from "builderStore/api"
  import WorkflowBlockSetup from "./WorkflowBlockSetup.svelte"
  import DeleteWorkflowModal from "./DeleteWorkflowModal.svelte"

  const { open, close } = getContext("simple-modal")

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
        class="hoverable"
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
      <button class="workflow-button hoverable" on:click={deleteWorkflowBlock}>
        Delete Block
      </button>
    {:else if $workflowStore.currentWorkflow}
      <div class="panel-body">
        <label class="uk-form-label">Workflow: {workflow.name}</label>
        <div class="uk-margin config-item">
          <label class="uk-form-label">Name</label>
          <div class="uk-form-controls">
            <input
              type="text"
              class="budibase__input"
              bind:value={workflow.name} />
          </div>
        </div>
        <div class="uk-margin config-item">
          <label class="uk-form-label">User Access</label>
          <label>
            <input class="uk-checkbox" type="checkbox" name="radio1" />
            Admin
          </label>
          <br />
          <label>
            <input class="uk-checkbox" type="checkbox" name="radio1" />
            Power User
          </label>
          <br />
        </div>
      </div>
      <button class="workflow-button hoverable" on:click={deleteWorkflow}>
        Delete Workflow
      </button>
    {/if}
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .panel-body {
    flex: 1;
  }

  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .selected {
    color: var(--font);
  }

  .config-item {
    padding: 20px;
    background: var(--light-grey);
  }

  header > span {
    color: var(--dark-grey);
    margin-right: 20px;
  }

  label {
    font-weight: 500;
    font-size: 14px;
    color: var(--font);
  }

  .workflow-button {
    font-family: Roboto;
    width: 100%;
    border: solid 1px #f2f2f2;
    border-radius: 2px;
    background: var(--white);
    height: 32px;
    font-size: 12px;
    font-weight: 500;
  }

  .test-result {
    border: none;
    width: 100%;
    border-radius: 2px;
    height: 32px;
    font-size: 12px;
    font-weight: 500;
    color: var(--white);
    text-align: center;
    margin-bottom: 10px;
  }

  .passed {
    background: #84c991;
  }

  .failed {
    background: var(--coral);
  }
</style>
