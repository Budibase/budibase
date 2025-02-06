<script>
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
  } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import {
    notifications,
    Modal,
    Toggle,
    Button,
    ActionButton,
  } from "@budibase/bbui"
  import { ActionStepID } from "@/constants/backend/automations"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
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
    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs
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
      {#if !$automationStore.showTestPanel && $automationStore.testResults}
        <Button
          secondary
          icon={"Multiple"}
          disabled={!$automationStore.testResults}
          on:click={() => {
            $automationStore.showTestPanel = true
          }}
        >
          Test details
        </Button>
      {/if}
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
  <DraggableCanvas
    bind:this={draggable}
    draggableClasses={[
      "main-content",
      "content",
      "block",
      "branched",
      "branch",
      "flow-item",
      "branch-wrap",
    ]}
  >
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
    padding: var(--spacing-l);
    flex: 0 0 60px;
    padding-right: var(--spacing-xl);
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    pointer-events: none;
  }

  .header > * {
    pointer-events: auto;
  }

  .controls {
    display: flex;
    gap: var(--spacing-l);
  }

  .controls .toggle-active :global(.spectrum-Switch-label) {
    margin-right: 0px;
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
