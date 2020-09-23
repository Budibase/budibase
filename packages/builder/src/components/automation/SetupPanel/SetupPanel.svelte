<script>
  import { getContext } from "svelte"
  import { backendUiStore, automationStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import AutomationBlockSetup from "./AutomationBlockSetup.svelte"
  import DeleteAutomationModal from "./DeleteAutomationModal.svelte"
  import { Button, Input, Label } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  let selectedTab = "SETUP"

  $: automation = $automationStore.selectedAutomation?.automation
  $: allowDeleteBlock =
    $automationStore.selectedBlock?.type !== "TRIGGER" ||
    !automation?.definition?.steps?.length

  function deleteAutomation() {
    open(
      DeleteAutomationModal,
      { onClosed: close },
      { styleContent: { padding: "0" } }
    )
  }

  function deleteAutomationBlock() {
    automationStore.actions.deleteAutomationBlock(
      $automationStore.selectedBlock
    )
  }

  async function testAutomation() {
    const result = await automationStore.actions.trigger({
      automation: $automationStore.selectedAutomation.automation,
    })
    if (result.status === 200) {
      notifier.success(`Automation ${automation.name} triggered successfully.`)
    } else {
      notifier.danger(`Failed to trigger automation ${automation.name}.`)
    }
  }

  async function saveAutomation() {
    await automationStore.actions.save({
      instanceId: $backendUiStore.selectedDatabase._id,
      automation,
    })
    notifier.success(`Automation ${automation.name} saved.`)
  }
</script>

<section>
  <header>
    <span
      class="hoverable"
      class:selected={selectedTab === 'SETUP'}
      on:click={() => (selectedTab = 'SETUP')}>
      Setup
    </span>
  </header>
  <div class="content">
    {#if $automationStore.selectedBlock}
      <AutomationBlockSetup bind:block={$automationStore.selectedBlock} />
    {:else if $automationStore.selectedAutomation}
      <div class="block-label">
        Automation
        <b>{automation.name}</b>
      </div>
      <Button secondary wide on:click={testAutomation}>Test Automation</Button>
    {/if}
  </div>
  <div class="buttons">
    {#if $automationStore.selectedBlock}
      <Button
        green
        wide
        data-cy="save-automation-setup"
        on:click={saveAutomation}>
        Save Automation
      </Button>
      <Button
        disabled={!allowDeleteBlock}
        red
        wide
        on:click={deleteAutomationBlock}>
        Delete Step
      </Button>
    {:else if $automationStore.selectedAutomation}
      <Button
        green
        wide
        data-cy="save-automation-setup"
        on:click={saveAutomation}>
        Save Automation
      </Button>
      <Button red wide on:click={deleteAutomation}>Delete Automation</Button>
    {/if}
  </div>

</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
    align-items: stretch;
  }

  header {
    font-size: 18px;
    font-weight: 600;
    font-family: inter, sans-serif;
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    color: var(--ink);
  }
  header > span {
    color: var(--grey-5);
    margin-right: var(--spacing-xl);
    cursor: pointer;
  }
  .selected {
    color: var(--ink);
  }

  .block-label {
    font-weight: 500;
    font-size: 14px;
    color: var(--grey-7);
    margin-bottom: var(--spacing-xl);
  }

  .content {
    flex: 1 0 auto;
  }

  .buttons {
    display: grid;
    gap: var(--spacing-m);
  }
</style>
