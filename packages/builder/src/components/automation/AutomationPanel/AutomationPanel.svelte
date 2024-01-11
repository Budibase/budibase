<script>
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, notifications, Layout } from "@budibase/bbui"
  import NavHeader from "components/common/NavHeader.svelte"
  import { onMount } from "svelte"
  import {
    automationStore,
    selectedAutomation,
    userSelectedResourceMap,
  } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import EditAutomationPopover from "./EditAutomationPopover.svelte"

  export let modal
  export let webhookModal
  let searchString

  $: selectedAutomationId = $selectedAutomation?._id

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

  onMount(async () => {
    try {
      await automationStore.actions.fetch()
    } catch (error) {
      notifications.error("Error getting automations list")
    }
  })

  function selectAutomation(id) {
    automationStore.actions.select(id)
  }
</script>

<div class="side-bar">
  <div class="side-bar-controls">
    <NavHeader
      title="Automations"
      placeholder="Search for automation"
      bind:value={searchString}
      onAdd={() => modal.show()}
    />
  </div>
  <div class="side-bar-nav">
    {#if filteredAutomations.length}
      {#each filteredAutomations as automation}
        <NavItem
          text={automation.name}
          selected={automation._id === selectedAutomationId}
          on:click={() => selectAutomation(automation._id)}
          selectedBy={$userSelectedResourceMap[automation._id]}
        >
          <EditAutomationPopover {automation} />
        </NavItem>
      {/each}
    {:else}
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
    padding: 0 var(--spacing-l);
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
