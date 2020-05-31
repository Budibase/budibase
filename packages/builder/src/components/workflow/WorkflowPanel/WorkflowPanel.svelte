<script>
  import { onMount } from "svelte"
  import { backendUiStore, workflowStore } from "builderStore"
  import { WorkflowList, BlockList } from "./"
  import api from "builderStore/api"
  import blockDefinitions from "./blockDefinitions"

  let selectedTab = "WORKFLOWS"
  let definitions = []
</script>

<header>
  <span
    class="hoverable workflow-header"
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

<style>
  header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .workflow-header {
    margin-right: 20px;
  }

  span:not(.selected) {
    color: var(--dark-grey);
  }
</style>
