<script>
  import { onMount } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { WorkflowList, BlockList } from "./"
  import api from "builderStore/api"
  import blockDefinitions from "./blockDefinitions"

  const WORKFLOW_TABS = [
    {
      name: "Workflows",
      key: "WORKFLOWS",
    },
    {
      name: "Add",
      key: "ADD",
    },
  ]

  let selectedTab = "WORKFLOWS"
  let definitions = []
</script>

<section>
  <header>
    <span
      class="hoverable"
      class:selected={selectedTab === 'WORKFLOWS'}
      on:click={() => (selectedTab = 'WORKFLOWS')}>
      Workflows
    </span>
    {#if $workflowStore.currentWorkflow}
      <span
        class="hoverable"
        class:selected={selectedTab === 'ADD'}
        on:click={() => (selectedTab = 'ADD')}>
        Add
      </span>
    {/if}
  </header>
  {#if selectedTab === 'WORKFLOWS'}
    <WorkflowList />
  {:else if selectedTab === 'ADD'}
    <BlockList />
  {/if}
</section>

<style>
  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  span:not(.selected) {
    color: var(--dark-grey);
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
