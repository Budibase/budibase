<script>
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
  } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
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
  import AutomationLogsPanel from "./AutomationLogsPanel.svelte"
  import LogDetailsPanel from "./LogDetailsPanel.svelte"

  export let automation

  const memoAutomation = memo(automation)

  let testDataModal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs = {}
  let treeEle
  let draggable

  let showLogsPanel = false
  let showLogDetails = false
  let selectedLog = null
  let selectedStepData = null
  let selectedLogStepId = null
  let viewMode = ViewMode.EDITOR

  $: $automationStore.showTestModal === true && testDataModal.show()

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: refresh($memoAutomation)

  $: blocks = getBlocks($memoAutomation, selectedLog).filter(
    x => x.stepId !== ActionStepID.LOOP
  )
  $: isRowAction = sdk.automations.isRowAction($memoAutomation)

  const refresh = () => {
    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs
  }
  const getBlocks = (automation, selectedLog) => {
    let blocks = []

    // In logs mode, we need to show steps from the log data
    if (viewMode === ViewMode.LOGS && selectedLog) {
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }

      // Process steps in the order they appear in the log
      // Annoyingly triggers are in the log steps, so we need to filter them out
      if (selectedLog.steps) {
        selectedLog.steps
          .filter(
            logStep => logStep.stepId !== automation.definition.trigger?.stepId
          )
          .forEach(logStep => {
            const currentStep = automation.definition.steps?.find(
              step => step.id === logStep.id
            )

            if (currentStep) {
              blocks.push(currentStep)
            } else {
              blocks.push({
                ...logStep,
              })
            }
          })
      }
    } else {
      // Normal editor mode - show current automation steps
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }
      blocks = blocks.concat(automation.definition.steps || [])
    }
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
    } catch (error) {
      console.error(error)
    }
  })

  function toggleLogsPanel() {
    showLogsPanel = !showLogsPanel
    if (showLogsPanel) {
      showLogDetails = false
      selectedLog = null
      selectedLogStepId = null
      viewMode = ViewMode.LOGS
      // Clear editor selection when switching to logs mode
      automationStore.actions.selectNode(null)
    } else {
      viewMode = ViewMode.EDITOR
      selectedLogStepId = null
    }
  }

  function enrichLog(definitions, log) {
    if (!definitions || !log || !log.steps) {
      return log
    }

    const enrichedLog = { ...log, steps: [...log.steps] }

    for (let step of enrichedLog.steps) {
      const trigger = definitions.TRIGGER[step.stepId]
      const action = definitions.ACTION[step.stepId]

      if (trigger || action) {
        step.icon = trigger ? trigger.icon : action.icon
        step.name = trigger ? trigger.name : action.name
      }
    }

    return enrichedLog
  }

  function handleSelectLog(log) {
    selectedLog = enrichLog($automationStore.blockDefinitions, log) ?? log
    selectedStepData = null
    selectedLogStepId = null
  }

  function closeAllPanels() {
    showLogsPanel = false
    showLogDetails = false
    selectedLog = null
    selectedStepData = null
    selectedLogStepId = null
    viewMode = ViewMode.EDITOR
  }

  function handleStepSelect(stepData) {
    selectedStepData = stepData
    selectedLogStepId = stepData?.stepId || stepData?.id
    // Show step details when a step is selected
    if (stepData && viewMode === ViewMode.LOGS) {
      showLogDetails = true
    }
  }
</script>

<div class="automation-heading">
  <div class="actions-left">
    <div class="automation-name">
      {automation.name}
    </div>
  </div>

  <div class="actions-right">
    <div class="view-mode-toggle">
      <div class="group">
        <ActionButton
          icon="Edit"
          quiet
          selected={viewMode === ViewMode.EDITOR}
          on:click={() => {
            viewMode = ViewMode.EDITOR
            selectedLogStepId = null
            closeAllPanels()
          }}
        >
          Editor
        </ActionButton>
        <ActionButton
          icon="AppleFiles"
          quiet
          selected={viewMode === ViewMode.LOGS ||
            showLogsPanel ||
            showLogDetails}
          on:click={() => {
            viewMode = ViewMode.LOGS
            // Clear editor selection when switching to logs mode
            automationStore.actions.selectNode(null)
            if (!showLogsPanel && !showLogDetails) {
              toggleLogsPanel()
            }
          }}
        >
          Logs
        </ActionButton>
      </div>
    </div>

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
              logData={selectedLog}
              {viewMode}
              {selectedLogStepId}
              onStepSelect={handleStepSelect}
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

{#if showLogsPanel}
  <AutomationLogsPanel
    {automation}
    onClose={closeAllPanels}
    onSelectLog={handleSelectLog}
    {selectedLog}
  />
{/if}

{#if showLogDetails && selectedLog && selectedStepData}
  <LogDetailsPanel
    log={selectedLog}
    selectedStep={selectedStepData}
    onClose={() => {
      showLogDetails = false
      selectedStepData = null
      selectedLogStepId = null
    }}
    onBack={() => {
      showLogDetails = false
      selectedStepData = null
      selectedLogStepId = null
    }}
  />
{/if}

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

  .automation-name {
    margin-right: var(--spacing-l);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
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

  .view-mode-toggle {
    display: flex;
    gap: var(--spacing-l);
    flex-shrink: 0;
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

  .view-mode-toggle .group {
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    background: var(--spectrum-global-color-gray-100);
    padding: 2px;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .view-mode-toggle .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
  .view-mode-toggle .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .zoom .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
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

  .actions-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .actions-right {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
  }

  .view-mode-toggle .group :global(.spectrum-ActionButton) {
    background: transparent !important;
    border: none !important;
    border-radius: 4px !important;
    color: var(--spectrum-global-color-gray-700) !important;
    font-weight: 500;
    padding: 6px 12px !important;
    margin: 0 !important;
    transition: all 0.15s ease;
  }

  .view-mode-toggle .group :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-200) !important;
    color: var(--spectrum-global-color-gray-900) !important;
  }

  .view-mode-toggle .group :global(.spectrum-ActionButton.is-selected) {
    background: var(--spectrum-global-color-gray-50) !important;
    color: var(--spectrum-global-color-gray-900) !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-weight: 600;
  }

  .view-mode-toggle .group :global(.spectrum-Icon) {
    color: inherit !important;
  }
</style>
