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
    StatusLight,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import ResultsModal from "./ResultsModal.svelte"
  import ActionModal from "./ActionModal.svelte"
  import { database } from "stores/backend"
  import { externalActions } from "./ExternalActions"

  export let onSelect
  export let block
  export let testDataModal
  let selected
  let webhookModal
  let actionModal
  let resultsModal
  let setupToggled
  let blockComplete
  $: testResult = $automationStore.selectedAutomation.testResults?.steps.filter(
    step => step.stepId === block.stepId
  )
  $: instanceId = $database._id

  $: isTrigger = block.type === "TRIGGER"

  $: selected = $automationStore.selectedBlock?.id === block.id
  $: steps =
    $automationStore.selectedAutomation?.automation?.definition?.steps ?? []

  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length

  // Logic for hiding / showing the add button.first we check if it has a child
  // then we check to see whether its inputs have been commpleted
  $: disableAddButton = isTrigger
    ? $automationStore.selectedAutomation?.automation?.definition?.steps
        .length > 0
    : !isTrigger && steps.length - blockIdx > 1
  $: hasCompletedInputs = Object.keys(
    block.schema?.inputs?.properties || {}
  ).every(x => block?.inputs[x])

  async function deleteStep() {
    automationStore.actions.deleteAutomationBlock(block)
    await automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )
  }
</script>

<div
  class={`block ${block.type} hoverable`}
  class:selected
  on:click={() => {
    onSelect(block)
  }}
>
  <div class="blockSection">
    <div
      on:click={() => {
        blockComplete = !blockComplete
      }}
      class="splitHeader"
    >
      <div class="center-items">
        {#if externalActions[block.stepId]}
          <img
            alt={externalActions[block.stepId].name}
            width="28px"
            height="28px"
            src={externalActions[block.stepId].icon}
          />
        {:else}
          <svg
            width="28px"
            height="28px"
            class="spectrum-Icon"
            style="color:grey;"
            focusable="false"
          >
            <use xlink:href="#spectrum-icon-18-{block.icon}" />
          </svg>
        {/if}
        <div class="iconAlign">
          {#if isTrigger}
            <Body size="XS">When this happens:</Body>
          {:else}
            <Body size="XS">Do this:</Body>
          {/if}

          <Detail size="S">{block?.name?.toUpperCase() || ""}</Detail>
        </div>
      </div>
      {#if testResult}
        <span on:click={() => resultsModal.show()}>
          <StatusLight
            positive={isTrigger || testResult[0].outputs?.success}
            negative={!testResult[0].outputs?.success}
            ><Body size="XS">View response</Body></StatusLight
          >
        </span>
      {/if}
    </div>
  </div>
  {#if !blockComplete}
    <Divider noMargin />
    <div class="blockSection">
      <Layout noPadding gap="S">
        <div class="splitHeader">
          <div
            on:click|stopPropagation={() => {
              setupToggled = !setupToggled
            }}
            class="center-items"
          >
            {#if setupToggled}
              <Icon size="M" name="ChevronDown" />
            {:else}
              <Icon size="M" name="ChevronRight" />
            {/if}
            <Detail size="S">Setup</Detail>
          </div>
          {#if !isTrigger}
            <div on:click={() => deleteStep()}>
              <Icon name="DeleteOutline" />
            </div>
          {/if}
        </div>

        {#if setupToggled}
          <AutomationBlockSetup
            schemaProperties={Object.entries(block.schema.inputs.properties)}
            {block}
            {webhookModal}
          />
          {#if lastStep}
            <Button on:click={() => testDataModal.show()} cta
              >Finish and test automation</Button
            >
          {/if}
          <Button
            disabled={disableAddButton ? true : !hasCompletedInputs}
            on:click={() => {
              setupToggled = false
              actionModal.show()
            }}
            primary={!isTrigger}
            cta={isTrigger}>Add Action</Button
          >
        {/if}
      </Layout>
    </div>
  {/if}

  <Modal bind:this={resultsModal} width="30%">
    <ResultsModal {isTrigger} {testResult} />
  </Modal>

  <Modal bind:this={actionModal} width="30%">
    <ActionModal bind:blockComplete />
  </Modal>

  <Modal bind:this={webhookModal} width="30%">
    <CreateWebhookModal />
  </Modal>
</div>

<style>
  .center-items {
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
