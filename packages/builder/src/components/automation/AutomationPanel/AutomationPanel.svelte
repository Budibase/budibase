<script>
  import { automationStore } from "builderStore"
  import AutomationList from "./AutomationList/AutomationList.svelte"
  import BlockList from "./BlockList/BlockList.svelte"
  import { Heading } from "@budibase/bbui"
  import { Spacer } from "@budibase/bbui"

  let selectedTab = "AUTOMATIONS"
</script>

<Heading black small>
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
      Steps
    </span>
  {/if}
</Heading>
<Spacer medium />
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
    margin-bottom: var(--spacing-xl);
  }

  .automation-header {
    margin-right: var(--spacing-xl);
  }

  span:not(.selected) {
    color: var(--grey-5);
  }

  span:not(.selected):hover {
    color: var(--ink);
  }
</style>
