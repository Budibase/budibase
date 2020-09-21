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
  <Button purple wide on:click={newAutomation}>Create New Automation</Button>
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

  i {
    color: #adaec4;
  }

  i:hover {
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding: 0;
    flex: 1;
  }

  .live {
    color: var(--primary);
  }

  li {
    font-size: 14px;
  }

  .automation-item {
    display: flex;
    border-radius: 5px;
    padding-left: 12px;
    align-items: center;
    height: 36px;
    margin-bottom: 4px;
    color: var(--ink);
  }

  .automation-item i {
    font-size: 24px;
    margin-right: 10px;
  }

  .automation-item:hover {
    cursor: pointer;
    background: var(--grey-1);
  }

  .automation-item.selected {
    background: var(--grey-2);
  }

  .new-automation-button {
    cursor: pointer;
    border: 1px solid var(--grey-4);
    border-radius: 3px;
    width: 100%;
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    transition: all 2ms;
  }

  .new-automation-button:hover {
    background: var(--grey-1);
  }

  .icon {
    color: var(--ink);
    font-size: 16px;
    margin-right: 4px;
  }
</style>
