<script>
  import { automationStore } from "builderStore"
  import AutomationList from "./AutomationList/AutomationList.svelte"
  import BlockList from "./BlockList/BlockList.svelte"

  let selectedTab = "AUTOMATIONS"
</script>

<header>
  <span
    data-cy="automation-list"
    class="hoverable automation-header"
    class:selected={selectedTab === 'AUTOMATIONS'}
    on:click={() => (selectedTab = 'AUTOMATIONS')}>
    Automations
  </span>
  {#if $automationStore.selectedAutomation}
    <span
      data-cy="add-automation-component"
      class="hoverable"
      class:selected={selectedTab === 'ADD'}
      on:click={() => (selectedTab = 'ADD')}>
      Add step
    </span>
  {/if}
</header>
{#if selectedTab === 'AUTOMATIONS'}
  <AutomationList />
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

  .automation-header {
    margin-right: 20px;
  }

  span:not(.selected) {
    color: var(--grey-5);
  }

  span:not(.selected):hover {
    color: var(--ink);
  }
</style>
