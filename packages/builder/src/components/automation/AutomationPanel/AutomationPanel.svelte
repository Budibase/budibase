<script>
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, notifications, Layout } from "@budibase/bbui"
  import NavHeader from "components/common/NavHeader.svelte"
  import { onMount } from "svelte"
  import { automationStore } from "stores/builder"
  import AutomationNavItem from "./AutomationNavItem.svelte"

  export let modal
  export let webhookModal
  let searchString

  $: filteredAutomations = $automationStore.automations
    .filter(automation => {
      return (
        !searchString ||
        automation.name.toLowerCase().includes(searchString.toLowerCase())
      )
    })
    .map(automation => ({
      ...automation,
      displayName:
        $automationStore.automationDisplayData[automation._id].displayName ||
        automation.name,
    }))
    .sort((a, b) => {
      const lowerA = a.displayName.toLowerCase()
      const lowerB = b.displayName.toLowerCase()
      return lowerA > lowerB ? 1 : -1
    })

  $: groupedAutomations = filteredAutomations.reduce((acc, auto) => {
    acc[auto.definition.trigger.event] ??= {
      icon: auto.definition.trigger.icon,
      name: (auto.definition.trigger?.name || "").toUpperCase(),
      entries: [],
    }
    acc[auto.definition.trigger.event].entries.push(auto)
    return acc
  }, {})

  $: showNoResults = searchString && !filteredAutomations.length

  onMount(async () => {
    try {
      await automationStore.actions.fetch()
    } catch (error) {
      notifications.error("Error getting automations list")
    }
  })
</script>

<div class="side-bar">
  <div class="side-bar-controls">
    <NavHeader
      title="Automations"
      placeholder="Search for automations"
      bind:value={searchString}
      onAdd={() => modal.show()}
    />
  </div>
  <div class="side-bar-nav">
    {#each Object.values(groupedAutomations || {}) as triggerGroup}
      <div class="nav-group">
        <div class="nav-group-header" title={triggerGroup?.name}>
          {triggerGroup?.name}
        </div>
        {#each triggerGroup.entries as automation}
          <AutomationNavItem {automation} icon={triggerGroup.icon} />
        {/each}
      </div>
    {/each}

    {#if showNoResults}
      <Layout paddingY="none" paddingX="L">
        <div class="no-results">
          There aren't any automations matching that name
        </div>
      </Layout>
    {/if}
  </div>
</div>

<Modal bind:this={modal}>
  <CreateAutomationModal {webhookModal} />
</Modal>

<style>
  .nav-group {
    padding-top: var(--spacing-l);
  }
  .nav-group-header {
    color: var(--spectrum-global-color-gray-600);
    padding: 0px calc(var(--spacing-l) + 4px);
    padding-bottom: var(--spacing-l);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .side-bar {
    flex: 0 0 260px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-right: var(--border-light);
    background: var(--spectrum-global-color-gray-100);
    overflow: hidden;
    transition: margin-left 300ms ease-out;
  }
  @media (max-width: 640px) {
    .side-bar {
      margin-left: -262px;
    }
  }

  .side-bar-controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    padding: 0 calc(var(--spacing-l) + 4px);
  }
  .side-bar-nav {
    flex: 1 1 auto;
    overflow: auto;
    overflow-x: hidden;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
