<script>
  import { onMount } from "svelte"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    Toggle,
    Button,
    ActionButton,
    Switcher,
    StatusLight,
  } from "@budibase/bbui"
  import { memo } from "@budibase/frontend-core"
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
    workspaceDeploymentStore,
    deploymentStore,
  } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    enrichLog,
  } from "./AutomationStepHelpers"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import DraggableCanvas from "../DraggableCanvas.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import StepNode from "./StepNode.svelte"

  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { PublishResourceState } from "@budibase/types"

  export let automation

  const memoAutomation = memo(automation)

  let testDataModal
  let confirmDeleteDialog
  let blockRefs = {}
  let treeEle
  let draggable
  let prodErrors
  let viewMode = ViewMode.EDITOR

  let changingStatus = false

  $: $automationStore.showTestModal === true && testDataModal.show()

  $: displayToggleValue =
    automation.publishStatus.state === PublishResourceState.PUBLISHED

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: refresh($memoAutomation)

  $: blocks = getBlocksHelper($memoAutomation, viewMode).filter(
    x => x.stepId !== ActionStepID.LOOP
  )

  // Check if automation has unpublished changes
  $: hasUnpublishedChanges =
    $workspaceDeploymentStore.automations[automation._id]
      ?.unpublishedChanges === true

  const refresh = () => {
    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs
  }

  const deleteAutomation = async () => {
    try {
      await automationStore.actions.delete(automation)
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }

  const publishChanges = async () => {
    try {
      await deploymentStore.publishApp()
    } catch (error) {
      notifications.error("Error publishing changes")
    }
  }

  onMount(async () => {
    try {
      await automationStore.actions.initAppSelf()
      await environment.loadVariables()
      const response = await automationStore.actions.getLogs({
        automationId: automation._id,
        status: "error",
        startDate: dayjs().subtract(1, "day").toISOString(),
      })
      prodErrors = response?.data?.length || 0
    } catch (error) {
      console.error(error)
    }
  })

  function toggleLogsPanel() {
    if ($automationStore.showLogsPanel) {
      automationStore.actions.closeLogsPanel()
      viewMode = ViewMode.EDITOR
    } else {
      automationStore.actions.openLogsPanel()
      automationStore.actions.closeLogPanel()
      viewMode = ViewMode.LOGS
      // Clear editor selection when switching to logs mode
      automationStore.actions.selectNode(null)
    }
  }

  function closeAllPanels() {
    automationStore.actions.closeLogsPanel()
    automationStore.actions.closeLogPanel()
    viewMode = ViewMode.EDITOR
  }

  function handleStepSelect(stepData) {
    // Show step details when a step is selected in logs mode
    if (
      stepData &&
      viewMode === ViewMode.LOGS &&
      $automationStore.selectedLog
    ) {
      const enrichedLog =
        enrichLog(
          $automationStore.blockDefinitions,
          $automationStore.selectedLog
        ) ?? $automationStore.selectedLog
      automationStore.actions.openLogPanel(enrichedLog, stepData)
    }
  }

  async function handleToggleChange() {
    try {
      changingStatus = true
      await automationStore.actions.toggleDisabled(automation._id)
    } finally {
      changingStatus = false
    }
  }
</script>

<div class="automation-heading">
  <div class="actions-right">
    <div class="actions-group">
      <Switcher
        on:left={() => {
          viewMode = ViewMode.EDITOR
          closeAllPanels()
        }}
        on:right={() => {
          viewMode = ViewMode.LOGS
          // Clear editor selection when switching to logs mode
          automationStore.actions.selectNode(null)
          if (
            !$automationStore.showLogsPanel &&
            !$automationStore.showLogDetailsPanel
          ) {
            toggleLogsPanel()
          }
        }}
        leftIcon="Edit"
        leftText="Editor"
        rightIcon="list-checks"
        rightText="Logs"
        rightNotificationTooltip="There are errors in production"
        rightNotificationCount={prodErrors}
        selected={$automationStore.showLogsPanel ||
        $automationStore.showLogDetailsPanel
          ? "right"
          : "left"}
      />
      {#if hasUnpublishedChanges}
        <button class="unpublished-changes-btn" on:click={publishChanges}>
          <StatusLight color="var(--spectrum-global-color-blue-600)" size="L" />
          <div class="unpublished-changes-text">Unpublished changes</div>
        </button>
      {/if}
    </div>

    <ActionButton
      icon="play"
      quiet
      disabled={!automation?.definition?.trigger}
      on:click={() => {
        automationStore.update(state => ({ ...state, showTestModal: true }))
      }}
    >
      Run test
    </ActionButton>

    <PublishStatusBadge
      status={automation.publishStatus.state}
      loading={changingStatus}
    />
    <div class="toggle-active setting-spacing">
      <Toggle
        on:change={handleToggleChange}
        disabled={!automation?.definition?.trigger || changingStatus}
        value={displayToggleValue}
      />
    </div>
  </div>
</div>

<div class="main-flow">
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
              logData={$automationStore.selectedLog}
              {viewMode}
              selectedLogStepId={$automationStore.selectedLogStepData?.id}
              onStepSelect={handleStepSelect}
            />
          {/each}
        {/if}
      </span>
    </DraggableCanvas>
    <div class="canvas-footer-left">
      <UndoRedoControl store={automationHistoryStore} showButtonGroup />

      <div class="zoom">
        <div class="group">
          <ActionButton icon="plus" quiet on:click={draggable.zoomIn} />
          <ActionButton icon="minus" quiet on:click={draggable.zoomOut} />
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

  .automation-heading {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--background);
    padding: var(--spacing-m) var(--spacing-l);
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .toggle-active :global(.spectrum-Switch) {
    margin: 0px;
  }

  .root :global(.main-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .canvas-footer-left {
    position: absolute;
    left: var(--spacing-xl);
    bottom: var(--spacing-l);
    display: flex;
    gap: var(--spacing-l);
  }

  .canvas-footer-left :global(div) {
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

  .toggle-active :global(.spectrum-Switch-label) {
    margin-right: 0px;
  }

  .zoom .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
  }

  .canvas-footer-left .group :global(.spectrum-Button),
  .canvas-footer-left .group :global(.spectrum-ActionButton),
  .canvas-footer-left .group :global(i) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .zoom .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid var(--spectrum-global-color-gray-300);
  }
  .zoom .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .zoom .group :global(.spectrum-Button),
  .zoom .group :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .zoom .group :global(.spectrum-Button:hover),
  .zoom .group :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }

  .actions-right {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
    flex: 1 1 auto;
  }

  .unpublished-changes-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    padding: 0 calc(var(--spacing-m) / 2);
    color: var(--spectrum-global-color-gray-900);
    border-radius: 9px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    transition:
      background 130ms ease-out,
      border 130ms ease-out,
      color 130ms ease-out;
  }

  .unpublished-changes-btn:hover {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-200);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }

  .unpublished-changes-btn:active {
    background: var(--spectrum-global-color-gray-200);
  }

  .actions-group {
    flex: 1 1 auto;
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .unpublished-changes-text {
    padding-top: 1px;
  }
</style>
