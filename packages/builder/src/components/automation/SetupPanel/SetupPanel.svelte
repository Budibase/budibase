<script>
  import { automationStore } from "builderStore"
  import { database } from 'builderStore/store/backend/'
  import { notifier } from "builderStore/store/notifications"
  import AutomationBlockSetup from "./AutomationBlockSetup.svelte"
  import { Button, Modal } from "@budibase/bbui"
  import CreateWebookModal from "../Shared/CreateWebhookModal.svelte"

  let webhookModal

  $: instanceId = $database._id
  $: automation = $automationStore.selectedAutomation?.automation
  $: automationLive = automation?.live

  function setAutomationLive(live) {
    if (automation.live === live) {
      return
    }
    automation.live = live
    automationStore.actions.save({ instanceId, automation })
    if (live) {
      notifier.info(`Automation ${automation.name} enabled.`)
    } else {
      notifier.danger(`Automation ${automation.name} disabled.`)
    }
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
      instanceId,
      automation,
    })
    notifier.success(`Automation ${automation.name} saved.`)
  }
</script>

<div class="title">
  <h1>Setup</h1>
  <i
    class:highlighted={automationLive}
    class:hoverable={automationLive}
    on:click={() => setAutomationLive(false)}
    class="ri-stop-circle-fill" />
  <i
    class:highlighted={!automationLive}
    class:hoverable={!automationLive}
    data-cy="activate-automation"
    on:click={() => setAutomationLive(true)}
    class="ri-play-circle-fill" />
</div>
{#if $automationStore.selectedBlock}
  <AutomationBlockSetup
    bind:block={$automationStore.selectedBlock}
    {webhookModal} />
{:else if $automationStore.selectedAutomation}
  <div class="block-label">{automation.name}</div>
  <Button secondary wide on:click={testAutomation}>Test Automation</Button>
{/if}
<Button
  secondary
  wide
  data-cy="save-automation-setup"
  on:click={saveAutomation}>
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
  .title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
    flex: 1 1 auto;
  }
  .title i {
    font-size: 20px;
    color: var(--grey-5);
  }
  .title i.highlighted {
    color: var(--ink);
  }
  .title i.hoverable:hover {
    cursor: pointer;
    color: var(--blue);
  }

  .block-label {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--grey-7);
  }

  .footer {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
  }
</style>
