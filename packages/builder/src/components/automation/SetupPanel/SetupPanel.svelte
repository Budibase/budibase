<script>
  import { automationStore } from "builderStore"
  import { database } from "stores/backend"
  import { notifications, Button, Modal, Heading, Toggle } from "@budibase/bbui"
  import AutomationBlockSetup from "./AutomationBlockSetup.svelte"
  import CreateWebookModal from "../Shared/CreateWebhookModal.svelte"

  let webhookModal

  $: instanceId = $database._id
  $: automation = $automationStore.selectedAutomation?.automation
  $: automationLive = automation?.live

  function setAutomationLive(live) {
    if (automationLive === live) {
      return
    }
    automation.live = live
    automationStore.actions.save({ instanceId, automation })
    if (live) {
      notifications.info(`Automation ${automation.name} enabled.`)
    } else {
      notifications.error(`Automation ${automation.name} disabled.`)
    }
  }

  async function testAutomation() {
    const result = await automationStore.actions.trigger({
      automation: $automationStore.selectedAutomation.automation,
    })
    if (result.status === 200) {
      notifications.success(
        `Automation ${automation.name} triggered successfully.`
      )
    } else {
      notifications.error(`Failed to trigger automation ${automation.name}.`)
    }
  }

  async function saveAutomation() {
    await automationStore.actions.save({
      instanceId,
      automation,
    })
    notifications.success(`Automation ${automation.name} saved.`)
  }
</script>

<div class="title">
  <Heading size="S">Setup</Heading>
  <Toggle
    value={automationLive}
    on:change={() => setAutomationLive(!automationLive)}
    data-cy="activate-automation"
    text="Live"
  />
</div>
{#if $automationStore.selectedBlock}
  <AutomationBlockSetup
    bind:block={$automationStore.selectedBlock}
    {webhookModal}
  />
{:else if $automationStore.selectedAutomation}
  <div class="block-label">{automation.name}</div>
  <Button secondary on:click={testAutomation}>Test Automation</Button>
{/if}
<Button
  secondary
  wide
  data-cy="save-automation-setup"
  on:click={saveAutomation}
>
  Save Automation
</Button>
<Modal bind:this={webhookModal} width="30%">
  <CreateWebookModal />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .title :global(h1) {
    flex: 1 1 auto;
  }

  .block-label {
    font-size: var(--spectrum-global-dimension-font-size-75);
    font-weight: 600;
    color: var(--grey-7);
  }
</style>
