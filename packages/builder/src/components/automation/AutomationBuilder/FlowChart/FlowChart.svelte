<script>
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
    appStore,
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
  import { onMount } from "svelte"
  import { environment } from "@/stores/portal"
  import Count from "../../SetupPanel/Count.svelte"

  export let automation

  const memoAutomation = memo(automation)

  let testDataModal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs = {}
  let treeEle
  let draggable

  let prodErrors

  $: $automationStore.showTestModal === true && testDataModal.show()

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

  onMount(async () => {
    try {
      await automationStore.actions.initAppSelf()
      await environment.loadVariables()
      const response = await automationStore.actions.getLogs({
        automationId: automation._id,
        status: "error",
      })
      prodErrors = response?.data?.length || 0
    } catch (error) {
      console.error(error)
    }
  })
</script>

<div class="automation-heading">
  <div class="actions-left">
    <div class="automation-name">
      {automation.name}
    </div>
  </div>
  <div class="actions-right">
    <ActionButton
      icon="Play"
      quiet
      disabled={!automation?.definition?.trigger}
      on:click={() => {
        automationStore.update(state => ({ ...state, showTestModal: true }))
      }}
    >
      Run test
    </ActionButton>
    <Count
      count={prodErrors}
      tooltip={"There are errors in production"}
      hoverable={false}
    >
      <ActionButton
        icon="Folder"
        quiet
        selected={prodErrors}
        on:click={() => {
          const params = new URLSearchParams({
            ...(prodErrors ? { open: "error" } : {}),
            automationId: automation._id,
          })
          window.open(
            `/builder/app/${
              $appStore.appId
            }/settings/automations?${params.toString()}`,
            "_blank"
          )
        }}
      >
        Logs
      </ActionButton>
    </Count>

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

<div class="main-flow">
  <div class="canvas-heading" class:scrolling>
    <div class="canvas-controls">
      <div class="canvas-heading-left">
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

<Modal
  bind:this={testDataModal}
  zIndex={5}
  on:hide={() => {
    automationStore.update(state => ({ ...state, showTestModal: false }))
  }}
>
  <TestDataModal />
</Modal>

<style>
  .main-flow {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .canvas-heading {
    position: absolute;
    z-index: 1;
    width: 100%;
    pointer-events: none;
  }

  .automation-heading {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--background);
    padding: var(--spacing-m) var(--spacing-l) var(--spacing-s);
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .automation-heading .actions-right {
    display: flex;
    gap: var(--spacing-xl);
  }

  .automation-name :global(.spectrum-Heading) {
    font-weight: 600;
  }

  .toggle-active :global(.spectrum-Switch) {
    margin: 0px;
  }

  .root :global(.main-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .canvas-heading-left {
    display: flex;
    gap: var(--spacing-l);
  }

  .canvas-heading-left :global(div) {
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

  .canvas-heading.scrolling {
    background: var(--background);
    border-bottom: var(--border-light);
    z-index: 1;
  }

  .canvas-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-l);
    padding-right: var(--spacing-xl);
    width: 100%;
    box-sizing: border-box;
    pointer-events: none;
  }

  .canvas-controls > * {
    pointer-events: auto;
  }

  .toggle-active :global(.spectrum-Switch-label) {
    margin-right: 0px;
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

  .canvas-heading-left .group :global(.spectrum-Button),
  .canvas-heading-left .group :global(.spectrum-ActionButton),
  .canvas-heading-left .group :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .canvas-heading-left .group :global(.spectrum-Button),
  .canvas-heading-left .group :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .canvas-heading-left .group :global(.spectrum-Button:hover),
  .canvas-heading-left .group :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }
</style>
