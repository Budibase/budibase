<script>
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
  } from "stores/builder"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import {
    Icon,
    notifications,
    Modal,
    Toggle,
    Button,
    ActionButton,
  } from "@budibase/bbui"
  import { ActionStepID } from "constants/backend/automations"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
  import StepNode from "./StepNode.svelte"
  import { memo } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import DraggableCanvas from "../DraggableCanvas.svelte"

  export let automation

  const memoAutomation = memo(automation)

  let testDataModal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs = {}
  let treeEle
  let draggable

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: refresh($memoAutomation)

  $: blocks = getBlocks($memoAutomation).filter(
    x => x.stepId !== ActionStepID.LOOP
  )
  $: isRowAction = sdk.automations.isRowAction($memoAutomation)

  const refresh = () => {
    // Build global automation bindings.
    const environmentBindings =
      automationStore.actions.buildEnvironmentBindings()

    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs

    automationStore.update(state => {
      return {
        ...state,
        bindings: [...environmentBindings],
      }
    })
  }

  const getBlocks = automation => {
    let blocks = []
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
    return blocks
  }

  const deleteAutomation = async () => {
    try {
      await automationStore.actions.delete(automation)
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="header" class:scrolling>
  <div class="header-left">
    <UndoRedoControl store={automationHistoryStore} showButtonGroup />

    <div class="zoom">
      <div class="group">
        <ActionButton icon="Add" quiet on:click={draggable.zoomIn} />
        <ActionButton icon="Remove" quiet on:click={draggable.zoomOut} />
      </div>
    </div>

    <Button
      secondary
      on:click={() => {
        draggable.zoomToFit()
      }}
    >
      Zoom to fit
    </Button>
  </div>
  <div class="controls">
    <Button
      icon={"Play"}
      cta
      disabled={!automation?.definition?.trigger}
      on:click={() => {
        testDataModal.show()
      }}
    >
      Run test
    </Button>
    <div class="buttons">
      <Icon disabled={!$automationStore.testResults} size="M" name="Multiple" />
      <div
        class:disabled={!$automationStore.testResults}
        on:click={() => {
          $automationStore.showTestPanel = true
        }}
      >
        Test details
      </div>
    </div>
    {#if !isRowAction}
      <div class="toggle-active setting-spacing">
        <Toggle
          text={automation.disabled ? "Paused" : "Activated"}
          on:change={automationStore.actions.toggleDisabled(
            automation._id,
            automation.disabled
          )}
          disabled={!automation?.definition?.trigger}
          value={!automation.disabled}
        />
      </div>
    {/if}
  </div>
</div>

<div class="root" bind:this={treeEle}>
  <DraggableCanvas bind:this={draggable}>
    <span class="main-content" slot="content">
      {#if Object.keys(blockRefs).length}
        {#each blocks as block, idx (block.id)}
          <StepNode
            step={blocks[idx]}
            stepIdx={idx}
            isLast={blocks?.length - 1 === idx}
            automation={$memoAutomation}
            blocks={blockRefs}
          />
        {/each}
      {/if}
    </span>
  </DraggableCanvas>
</div>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Automation"
  onOk={deleteAutomation}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the automation
  <i>{automation.name}?</i>
  This action cannot be undone.
</ConfirmDialog>

<Modal bind:this={testDataModal} width="30%" zIndex={5}>
  <TestDataModal />
</Modal>

<style>
  .toggle-active :global(.spectrum-Switch) {
    margin: 0px;
  }

  .root :global(.main-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100%;
    height: 100%;
    width: 100%;
  }

  .header-left {
    display: flex;
    gap: var(--spacing-l);
  }

  .header-left :global(div) {
    border-right: none;
  }

  .root {
    height: 100%;
    width: 100%;
  }

  .root :global(.block) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .root :global(.blockSection) {
    width: 100%;
    box-sizing: border-box;
  }

  .header.scrolling {
    background: var(--background);
    border-bottom: var(--border-light);
    z-index: 1;
  }

  .header {
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--spacing-l);
    transition: background 130ms ease-out;
    flex: 0 0 60px;
    padding-right: var(--spacing-xl);
  }

  .controls {
    display: flex;
    gap: var(--spacing-xl);
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-s);
  }

  .buttons:hover {
    cursor: pointer;
  }

  .disabled {
    pointer-events: none;
    color: var(--spectrum-global-color-gray-500) !important;
  }

  .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
  }
  .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid var(--spectrum-global-color-gray-300);
  }
  .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .header-left .group :global(.spectrum-Button),
  .header-left .group :global(.spectrum-ActionButton),
  .header-left .group :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .header-left .group :global(.spectrum-Button),
  .header-left .group :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .header-left .group :global(.spectrum-Button:hover),
  .header-left .group :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }
</style>
