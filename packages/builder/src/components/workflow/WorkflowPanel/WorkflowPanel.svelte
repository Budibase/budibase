<script>
  import { onMount } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { WorkflowList, BlockList } from "./"
  import blockDefinitions from "./blockDefinitions"

  let selectedTab = "WORKFLOWS"
  let definitions = []
</script>

<header>
  <span
    data-cy="workflow-list"
    class="hoverable workflow-header"
    class:selected={selectedTab === 'WORKFLOWS'}
    on:click={() => (selectedTab = 'WORKFLOWS')}>
    Workflows
  </span>
  {#if $workflowStore.currentWorkflow}
    <span
      data-cy="add-workflow-component"
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

<style>
  header {
    font-size: 18px;
    font-weight: 600;
    background: none;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .workflow-header {
    margin-right: 20px;
  }

  span:not(.selected) {
    color: var(--grey-5);
  }

  span:not(.selected):hover {
    color: var(--ink);
  }
</style>
