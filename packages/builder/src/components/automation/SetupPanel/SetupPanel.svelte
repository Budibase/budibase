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
    automationStore.actions.deleteAutomationBlock($automationStore.selectedBlock)
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
  {#if $automationStore.selectedBlock}
    <AutomationBlockSetup bind:block={$automationStore.selectedBlock} />
    <div class="buttons">
      <Button green wide data-cy="save-automation-setup" on:click={saveAutomation}>
        Save Automation
      </Button>
      <Button
        disabled={!allowDeleteBlock}
        red
        wide
        on:click={deleteAutomationBlock}>
        Delete Block
      </Button>
    </div>
  {:else if $automationStore.selectedAutomation}
    <div class="panel">
      <div class="panel-body">
        <div class="block-label">
          Automation
          <b>{automation.name}</b>
        </div>
      </div>
      <Button secondary wide on:click={testAutomation}>Test Automation</Button>
      <div class="buttons">
        <Button
          green
          wide
          data-cy="save-automation-setup"
          on:click={saveAutomation}>
          Save Automation
        </Button>
        <Button red wide on:click={deleteAutomation}>Delete Automation</Button>
      </div>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  .panel-body {
    flex: 1;
  }

  .panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  header {
    font-size: 18px;
    font-weight: 600;
    font-family: inter;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: var(--ink);
  }

  .selected {
    color: var(--ink);
  }

  .block-label {
    font-weight: 500;
    font-size: 14px;
    color: var(--grey-7);
    margin-bottom: 20px;
  }

  header > span {
    color: var(--grey-5);
    margin-right: 20px;
    cursor: pointer;
  }

  label {
    font-weight: 500;
    font-size: 14px;
    color: var(--ink);
  }

  .buttons {
    position: absolute;
    bottom: 20px;
    display: grid;
    width: 260px;
    gap: 12px;
  }

  .access-level label {
    font-weight: normal;
    color: var(--ink);
  }
</style>
