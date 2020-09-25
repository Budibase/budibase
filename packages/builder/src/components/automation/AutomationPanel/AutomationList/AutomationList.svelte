<script>
  import Modal from "svelte-simple-modal"
  import { notifier } from "builderStore/store/notifications"
  import { onMount, getContext } from "svelte"
  import { backendUiStore, automationStore } from "builderStore"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Button } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  $: selectedAutomationId = $automationStore.selectedAutomation?.automation?._id

  function newAutomation() {
    open(
      CreateAutomationModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  onMount(() => {
    automationStore.actions.fetch()
  })
</script>

<section>
  <Button primary wide on:click={newAutomation}>Create New Automation</Button>
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
    color: var(--purple);
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
