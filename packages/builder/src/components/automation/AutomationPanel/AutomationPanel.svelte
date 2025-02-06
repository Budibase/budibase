<script>
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, notifications, Layout } from "@budibase/bbui"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import { onMount } from "svelte"
  import { automationStore, tables } from "@/stores/builder"
  import AutomationNavItem from "./AutomationNavItem.svelte"
  import { TriggerStepID } from "@/constants/backend/automations"

  export let modal
  export let webhookModal
  let searchString

  const dsTriggers = [
    TriggerStepID.ROW_SAVED,
    TriggerStepID.ROW_UPDATED,
    TriggerStepID.ROW_DELETED,
    TriggerStepID.ROW_ACTION,
  ]

  $: filteredAutomations = $automationStore.automations
    .filter(automation => {
      return (
        !searchString ||
        automation.name.toLowerCase().includes(searchString.toLowerCase())
      )
    })
    .sort((a, b) => {
      const lowerA = a.name.toLowerCase()
      const lowerB = b.name.toLowerCase()
      return lowerA > lowerB ? 1 : -1
    })

  $: groupedAutomations = groupAutomations(filteredAutomations)

  $: showNoResults = searchString && !filteredAutomations.length

  const groupAutomations = automations => {
    let groups = {}

    for (let auto of automations) {
      let category = null
      let dataTrigger = false

      // Group by datasource if possible
      if (dsTriggers.includes(auto.definition?.trigger?.stepId)) {
        if (auto.definition.trigger.inputs?.tableId) {
          const tableId = auto.definition.trigger.inputs?.tableId
          category = $tables.list.find(x => x._id === tableId)?.name
        }
      }
      // Otherwise group by trigger
      if (!category) {
        category = auto.definition?.trigger?.name || "No Trigger"
      } else {
        dataTrigger = true
      }
      groups[category] ??= {
        icon: auto.definition?.trigger?.icon || "AlertCircle",
        name: category.toUpperCase(),
        entries: [],
        dataTrigger,
      }
      groups[category].entries.push(auto)
    }

    return Object.values(groups).sort((a, b) => {
      if (a.dataTrigger === b.dataTrigger) {
        return a.name < b.name ? -1 : 1
      }
      return a.dataTrigger ? -1 : 1
    })
  }

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
    padding-top: 24px;
  }
  .nav-group:first-child {
    padding-top: var(--spacing-s);
  }
  .nav-group-header {
    color: var(--spectrum-global-color-gray-600);
    padding: 0px calc(var(--spacing-l) + 4px);
    padding-bottom: var(--spacing-m);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 600;
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
