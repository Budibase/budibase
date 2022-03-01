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
    ActionButton,
    Select,
    notifications,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import ResultsModal from "./ResultsModal.svelte"
  import ActionModal from "./ActionModal.svelte"
  import { externalActions } from "./ExternalActions"

  export let block
  export let testDataModal
  let selected
  let webhookModal
  let actionModal
  let resultsModal
  let setupToggled
  let blockComplete

  $: rowControl = $automationStore.selectedAutomation.automation.rowControl
  $: showBindingPicker =
    block.stepId === "CREATE_ROW" || block.stepId === "UPDATE_ROW"

  $: testResult = $automationStore.selectedAutomation.testResults?.steps.filter(
    step => (block.id ? step.id === block.id : step.stepId === block.stepId)
  )
  $: isTrigger = block.type === "TRIGGER"

  $: selected = $automationStore.selectedBlock?.id === block.id
  $: steps =
    $automationStore.selectedAutomation?.automation?.definition?.steps ?? []

  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length

  $: totalBlocks =
    $automationStore.selectedAutomation?.automation?.definition?.steps.length +
    1

  $: hasCompletedInputs = Object.keys(
    block.schema?.inputs?.properties || {}
  ).every(x => block?.inputs[x])

  async function deleteStep() {
    try {
      automationStore.actions.deleteAutomationBlock(block)
      await automationStore.actions.save(
        $automationStore.selectedAutomation?.automation
      )
    } catch (error) {
      notifications.error("Error saving notification")
    }
  }
  function toggleFieldControl(evt) {
    onSelect(block)
    let rowControl
    if (evt.detail === "Use values") {
      rowControl = false
    } else {
      rowControl = true
    }
    automationStore.actions.toggleFieldControl(rowControl)
    automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )
  }

  async function onSelect(block) {
    await automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
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
      {#if testResult && testResult[0]}
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
          <ActionButton
            on:click={() => {
              onSelect(block)
              setupToggled = !setupToggled
            }}
            quiet
            icon={setupToggled ? "ChevronDown" : "ChevronRight"}
          >
            <Detail size="S">Setup</Detail>
          </ActionButton>
          {#if !isTrigger}
            <div class="block-options">
              {#if showBindingPicker}
                <div>
                  <Select
                    on:change={toggleFieldControl}
                    quiet
                    defaultValue="Use values"
                    autoWidth
                    value={rowControl ? "Use bindings" : "Use values"}
                    options={["Use values", "Use bindings"]}
                    placeholder={null}
                  />
                </div>
              {/if}
              <div class="delete-padding" on:click={() => deleteStep()}>
                <Icon name="DeleteOutline" />
              </div>
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
        {/if}
      </Layout>
    </div>
  {/if}

  <Modal bind:this={resultsModal} width="30%">
    <ResultsModal {isTrigger} {testResult} />
  </Modal>

  <Modal bind:this={actionModal} width="30%">
    <ActionModal {blockIdx} bind:blockComplete />
  </Modal>

  <Modal bind:this={webhookModal} width="30%">
    <CreateWebhookModal />
  </Modal>
</div>
<div class="separator" />
<Icon
  on:click={() => actionModal.show()}
  disabled={!hasCompletedInputs}
  hoverable
  name="AddCircle"
  size="S"
/>
{#if isTrigger ? totalBlocks > 1 : blockIdx !== totalBlocks - 2}
  <div class="separator" />
{/if}

<style>
  .delete-padding {
    padding-left: 30px;
  }
  .block-options {
    display: flex;
    align-items: center;
  }
  .center-items {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }
  .block {
    width: 480px;
    font-size: 16px;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px 4px 4px 4px;
  }

  .blockSection {
    padding: var(--spacing-xl);
  }

  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    /* center horizontally */
    align-self: center;
  }
</style>
