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
    Select,
    ActionButton,
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
  let blockComplete
  let showLooping = false

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

  $: loopingSelected =
    $automationStore.selectedAutomation?.automation.definition.steps.find(
      x => x.blockToLoop === block.id
    )

  async function removeLooping() {
    loopingSelected = false
    let loopBlock =
      $automationStore.selectedAutomation?.automation.definition.steps.find(
        x => x.blockToLoop === block.id
      )
    automationStore.actions.deleteAutomationBlock(loopBlock)
    await automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )
  }

  async function deleteStep() {
    let loopBlock =
      $automationStore.selectedAutomation?.automation.definition.steps.find(
        x => x.blockToLoop === block.id
      )

    try {
      if (loopBlock) {
        automationStore.actions.deleteAutomationBlock(loopBlock)
      }
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

  async function addLooping() {
    loopingSelected = true
    const loopDefinition = $automationStore.blockDefinitions.ACTION.LOOP

    const loopBlock = $automationStore.selectedAutomation.constructBlock(
      "ACTION",
      "LOOP",
      loopDefinition
    )
    loopBlock.blockToLoop = block.id
    block.loopBlock = loopBlock.id
    automationStore.actions.addBlockToAutomation(loopBlock, blockIdx)
    await automationStore.actions.save(
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

<div class={`block ${block.type} hoverable`} class:selected on:click={() => {}}>
  {#if loopingSelected}
    <div class="blockSection">
      <div
        on:click={() => {
          showLooping = !showLooping
        }}
        class="splitHeader"
      >
        <div class="center-items">
          <svg
            width="28px"
            height="28px"
            class="spectrum-Icon"
            style="color:grey;"
            focusable="false"
          >
            <use xlink:href="#spectrum-icon-18-Reuse" />
          </svg>
          <div class="iconAlign">
            <Detail size="S">Looping</Detail>
          </div>
        </div>

        <div class="blockTitle">
          <div
            style="margin-left: 10px;"
            on:click={() => {
              onSelect(block)
            }}
          >
            <Icon name={showLooping ? "ChevronDown" : "ChevronUp"} />
          </div>
        </div>
      </div>
    </div>

    <Divider noMargin />
    {#if !showLooping}
      <div class="blockSection">
        <div class="block-options">
          <ActionButton on:click={() => removeLooping()} icon="DeleteOutline" />
        </div>
        <Layout noPadding gap="S">
          <AutomationBlockSetup
            schemaProperties={Object.entries(
              $automationStore.blockDefinitions.ACTION.LOOP.schema.inputs
                .properties
            )}
            block={$automationStore.selectedAutomation?.automation.definition.steps.find(
              x => x.blockToLoop === block.id
            )}
            {webhookModal}
          />
        </Layout>
      </div>
      <Divider noMargin />
    {/if}
  {/if}

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
      <div class="blockTitle">
        {#if testResult && testResult[0]}
          <div style="float: right;" on:click={() => resultsModal.show()}>
            <StatusLight
              positive={isTrigger || testResult[0].outputs?.success}
              negative={!testResult[0].outputs?.success}
              ><Body size="XS">View response</Body></StatusLight
            >
          </div>
        {/if}
        <div
          style="margin-left: 10px;"
          on:click={() => {
            onSelect(block)
          }}
        >
          <Icon name={blockComplete ? "ChevronDown" : "ChevronUp"} />
        </div>
      </div>
    </div>
  </div>
  {#if !blockComplete}
    <Divider noMargin />
    <div class="blockSection">
      <Layout noPadding gap="S">
        {#if !isTrigger}
          <div>
            <div class="block-options">
              {#if !loopingSelected}
                <ActionButton on:click={() => addLooping()} icon="Reuse"
                  >Add Looping</ActionButton
                >
              {/if}
              {#if showBindingPicker}
                <Select
                  on:change={toggleFieldControl}
                  defaultValue="Use values"
                  autoWidth
                  value={block.rowControl ? "Use bindings" : "Use values"}
                  options={["Use values", "Use bindings"]}
                  placeholder={null}
                />
              {/if}
              <ActionButton
                on:click={() => deleteStep()}
                icon="DeleteOutline"
              />
            </div>
          </div>
        {/if}

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
<Icon on:click={() => actionModal.show()} hoverable name="AddCircle" size="S" />
{#if isTrigger ? totalBlocks > 1 : blockIdx !== totalBlocks - 2}
  <div class="separator" />
{/if}

<style>
  .delete-padding {
    padding-left: 30px;
  }
  .block-options {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    gap: var(--spacing-m);
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

  .blockTitle {
    display: flex;
    align-items: center;
  }
</style>
