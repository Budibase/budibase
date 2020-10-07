<script>
  import { onMount } from "svelte"
  import { automationStore } from "builderStore"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Button } from "@budibase/bbui"
  import { Modal } from "components/common/Modal"

  let modalVisible = false

  $: selectedAutomationId = $automationStore.selectedAutomation?.automation?._id

  onMount(() => {
    automationStore.actions.fetch()
  })
</script>

<section>
  <Button primary wide on:click={() => (modalVisible = true)}>
    Create New Automation
  </Button>
  <ul>
    {#each $automationStore.automations as automation}
      <li
        class="automation-item"
        class:selected={automation._id === selectedAutomationId}
        on:click={() => automationStore.actions.select(automation)}>
        <i class="ri-stackshare-line" class:live={automation.live} />
        {automation.name}
      </li>
    {/each}
  </ul>
</section>
{#if modalVisible}
  <CreateAutomationModal bind:visible={modalVisible} />
{/if}

<style>
  section {
    display: flex;
    flex-direction: column;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: var(--spacing-xl) 0 0 0;
    flex: 1;
  }

  i {
    color: var(--grey-6);
  }
  i.live {
    color: var(--ink);
  }

  li {
    font-size: 14px;
  }

  .automation-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: var(--border-radius-m);
    padding: var(--spacing-s) var(--spacing-m);
    margin-bottom: var(--spacing-xs);
    color: var(--ink);
  }
  .automation-item i {
    font-size: 24px;
    margin-right: var(--spacing-m);
  }
  .automation-item:hover {
    cursor: pointer;
    background: var(--grey-1);
  }
  .automation-item.selected {
    background: var(--grey-2);
  }
</style>
