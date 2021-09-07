<script>
  import { automationStore } from "builderStore"
  import {
    Icon,
    Divider,
    Layout,
    Body,
    Detail,
    Modal,
    Button,
    ActionButton,
    notifications,
    StatusLight,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/shared/CreateWebhookModal.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import ActionModal from "./ActionModal.svelte"
  import { database } from "stores/backend"

  export let onSelect
  export let block

  let selected
  let webhookModal
  let testDataModal
  let actionModal
  let setupComplete
  let blockComplete
  let testToggled

  $: setupToggled = !setupComplete || false

  $: instanceId = $database._id
  $: schemaKey = Object.keys(block.schema?.inputs?.properties || {})

  $: selected = $automationStore.selectedBlock?.id === block.id
  $: steps =
    $automationStore.selectedAutomation?.automation?.definition?.steps ?? []

  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: allowDeleteTrigger = !steps.length

  function deleteStep() {
    automationStore.actions.deleteAutomationBlock(block)
  }

  async function testAutomation() {
    const result = await automationStore.actions.trigger({
      automation: $automationStore.selectedAutomation.automation,
    })
    if (result.status === 200) {
      notifications.success(
        `Automation ${$automationStore.selectedAutomation.automation.name} triggered successfully.`
      )
    } else {
      notifications.error(
        `Failed to trigger automation ${$automationStore.selectedAutomation.automation.name}.`
      )
    }
    return result
  }

  async function saveAutomation() {
    await automationStore.actions.save({
      instanceId,
      automation: $automationStore.selectedAutomation.automation,
    })
    notifications.success(
      `Automation ${$automationStore.selectedAutomation.automation.name} saved.`
    )
  }

  function onContinue() {
    const testResult = testAutomation()
    const saveResult = saveAutomation()

    if (testResult && saveResult) {
      setupComplete = true
      testToggled = true
    }
  }
</script>

<div
  class={`block ${block.type} hoverable`}
  class:selected
  on:click={() => {
    blockComplete = false
    onSelect(block)
  }}
>
  <div class="blockSection">
    <div class="splitHeader">
      <div>
        <svg
          width="35px"
          height="35px"
          class="spectrum-Icon"
          style="color:grey;"
          focusable="false"
        >
          <use xlink:href="#spectrum-icon-18-{block.icon}" />
        </svg>
        <div class="iconAlign">
          <Body size="XS">When this happens:</Body>

          <Detail size="S">{block?.name?.toUpperCase() || ""}</Detail>
        </div>
      </div>
      {#if blockComplete}
        <StatusLight positive={true} notice={false} />
      {/if}
    </div>
  </div>
  {#if !blockComplete}
    <Divider noMargin />
    <div class="blockSection">
      <Layout noPadding gap="S">
        <div class="splitHeader">
          <div
            on:click={() => {
              if (!setupComplete) {
                setupToggled = !setupToggled
              }
            }}
            class="toggle"
          >
            {#if setupToggled}
              <Icon size="M" name="ChevronDown" />
            {:else}
              <Icon size="M" name="ChevronRight" />
            {/if}
            <Detail size="S">Setup</Detail>
          </div>
          <div on:click={() => deleteStep()}>
            <Icon name="DeleteOutline" />
          </div>
        </div>

        {#if setupToggled}
          <AutomationBlockSetup {block} {webhookModal} />
          {#if block.inputs[schemaKey]}
            <Button on:click={() => onContinue()} cta
              >Continue and test trigger</Button
            >
          {/if}
        {/if}
      </Layout>
    </div>

    <Divider noMargin />
    <div class="blockSection">
      <Layout noPadding gap="S">
        <div
          on:click={() => {
            if (setupComplete) {
              testToggled = !testToggled
            }
          }}
          class="toggle"
        >
          {#if testToggled}
            <Icon size="M" name="ChevronDown" />
          {:else}
            <Icon size="M" name="ChevronRight" />
          {/if}
          <Detail size="S">Test</Detail>
        </div>
        {#if testToggled}
          <ActionButton on:click={testDataModal.show()} fullWidth icon="Add"
            >Add test data</ActionButton
          >
          <Button
            on:click={() => {
              actionModal.show()
            }}
            cta>Save trigger and continue to action</Button
          >
        {/if}
      </Layout>
    </div>
  {/if}

  <Modal bind:this={actionModal} width="30%">
    <ActionModal bind:blockComplete />
  </Modal>

  <Modal bind:this={webhookModal} width="30%">
    <CreateWebhookModal />
  </Modal>

  <Modal bind:this={testDataModal} width="30%">
    <TestDataModal />
  </Modal>
</div>

<style>
  .toggle {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }
  .block {
    width: 360px;
    font-size: 16px;
    background-color: var(--spectrum-alias-background-color-secondary);
    color: var(--grey-9);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px 4px 4px 4px;
  }

  .blockSection {
    padding: var(--spacing-xl);
  }
</style>
