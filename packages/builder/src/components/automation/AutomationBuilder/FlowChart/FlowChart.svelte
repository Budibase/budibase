<script lang="ts">
  import { onMount, onDestroy, setContext } from "svelte"
  import { writable, get } from "svelte/store"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    Toggle,
    Body,
    ActionButton,
    Switcher,
  } from "@budibase/bbui"
  import { memo } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
    workspaceDeploymentStore,
    deploymentStore,
  } from "@/stores/builder"
  import { environment, featureFlags } from "@/stores/portal"
  import { ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    renderBranches,
    type GraphBuildDeps,
    dagreLayoutAutomation,
  } from "./AutomationStepHelpers"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import CtaNotification from "@/components/common/CtaNotification.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import NodeWrapper from "./NodeWrapper.svelte"
  import EdgeWrapper from "./EdgeWrapper.svelte"
  import BranchNodeWrapper from "./BranchNodeWrapper.svelte"
  import AnchorNode from "./AnchorNode.svelte"
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    type Node as FlowNode,
    type Edge as FlowEdge,
    type NodeTypes,
    type EdgeTypes,
    useSvelteFlow,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import {
    AutomationStatus,
    type AutomationStep,
    AutomationActionStepId,
    type UIAutomation,
  } from "@budibase/types"

  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { PublishResourceState } from "@budibase/types"
  import { createFlowChartDnD } from "./FlowChartDnD"

  export let automation: UIAutomation

  const memoAutomation = memo(automation)

  const nodeTypes: NodeTypes = {
    "step-node": NodeWrapper as any,
    "branch-node": BranchNodeWrapper as any,
    "anchor-node": AnchorNode as any,
  }
  const edgeTypes: EdgeTypes = {
    "add-item": EdgeWrapper as any,
  }

  let testDataModal: Modal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs: Record<string, any> = {}
  let prodErrors: number
  let paneEl: HTMLDivElement | null = null
  let changingStatus = false

  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])

  const { getViewport, setViewport } = useSvelteFlow()

  // DnD helper and context stores
  const dnd = createFlowChartDnD({
    getViewport,
    setViewport,
    moveBlock: (sourcePath, destPath, automationData) =>
      automationStore.actions.moveBlock(sourcePath, destPath, automationData),
    getSelectedAutomation: () => get(selectedAutomation),
  })
  const { view, viewPos, contentPos } = dnd
  setContext("draggableView", view)
  setContext("viewPos", viewPos)
  setContext("contentPos", contentPos)

  $: updateGraph(blocks as any, viewMode)

  $: $automationStore.showTestModal === true && testDataModal.show()

  $: displayToggleValue = $featureFlags.WORKSPACES
    ? automation.publishStatus.state === PublishResourceState.PUBLISHED
    : !automation?.disabled

  // Memo auto - selectedAutomation
  $: memoAutomation.set($selectedAutomation.data || automation)

  // Parse the automation tree state
  $: $selectedAutomation.blockRefs && refresh()
  $: blocks = getBlocksHelper(
    $selectedAutomation.data || $memoAutomation,
    viewMode
  )
    .filter(x => x.stepId !== ActionStepID.LOOP)
    .map((block, idx) => ({ ...block, __top: idx }))

  $: viewMode = ViewMode.EDITOR

  $: isRowAction = sdk.automations.isRowAction($memoAutomation)

  function updateGraph(blocks: AutomationStep[], currentViewMode: ViewMode) {
    const xSpacing = 300
    const ySpacing = 240

    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []

    // helper to get or create position
    const ensurePosition = (_id: string, fallback: { x: number; y: number }) =>
      fallback

    const deps: GraphBuildDeps = {
      ensurePosition,
      xSpacing,
      ySpacing,
      blockRefs,
      viewMode: currentViewMode,
      testDataModal,
      newNodes,
      newEdges,
    }

    // Build linear chain of top-level steps first
    blocks.forEach((block, idx) => {
      const baseId = block.id
      const pos = ensurePosition(baseId, { x: 0, y: idx * ySpacing })

      const isBranchStep = block.stepId === AutomationActionStepId.BRANCH

      if (!isBranchStep) {
        newNodes.push({
          id: baseId,
          type: "step-node",
          data: {
            testDataModal,
            block,
            isTopLevel: true,
            viewMode: currentViewMode,
          },
          position: pos,
        })
      }

      if (idx > 0 && !isBranchStep) {
        const prevId = blocks[idx - 1].id
        newEdges.push({
          id: `edge-${prevId}-${baseId}`,
          type: "add-item",
          source: prevId,
          target: baseId,
          data: { block: blocks[idx - 1], viewMode: currentViewMode },
        })
      }

      // Add a terminal anchor so the add-item affordance appears when there is no next node
      if (!isBranchStep && (blocks.length === 1 || idx === blocks.length - 1)) {
        const terminalId = `anchor-${baseId}`
        const terminalPos = ensurePosition(terminalId, {
          x: pos.x,
          y: pos.y + ySpacing,
        })
        newNodes.push({
          id: terminalId,
          type: "anchor-node",
          data: { viewMode: currentViewMode },
          position: terminalPos,
        })

        newEdges.push({
          id: `edge-${baseId}-${terminalId}`,
          type: "add-item",
          source: baseId,
          target: terminalId,
          data: { block, viewMode: currentViewMode },
        })
      }

      // Branch fan-out
      if (isBranchStep) {
        const sourceForBranches = idx > 0 ? blocks[idx - 1].id : baseId
        const sourceBlock = idx > 0 ? blocks[idx - 1] : block
        renderBranches(
          block,
          sourceForBranches,
          sourceBlock,
          pos.x,
          pos.y + ySpacing,
          deps
        )
      }
    })

    // Run Dagre layout (top-to-bottom)
    const laidOut = dagreLayoutAutomation(
      { nodes: newNodes, edges: newEdges },
      { rankdir: "TB", ranksep: 150, nodesep: 300 }
    )

    nodes.set(laidOut.nodes)
    edges.set(laidOut.edges)
  }

  // Check if automation has unpublished changes
  $: hasUnpublishedChanges =
    $workspaceDeploymentStore.automations[automation._id!]
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
        status: AutomationStatus.ERROR,
        startDate: dayjs().subtract(1, "day").toISOString(),
      })
      prodErrors = response?.data?.length || 0
    } catch (error) {
      console.error(error)
    }
    dnd.setPaneEl(paneEl)
    dnd.initDnD()
  })

  onDestroy(() => {
    dnd.destroyDnD()
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
      automationStore.actions.selectNode(undefined)
    }
  }

  function closeAllPanels() {
    automationStore.actions.closeLogsPanel()
    automationStore.actions.closeLogPanel()
    viewMode = ViewMode.EDITOR
  }

  async function handleToggleChange() {
    try {
      changingStatus = true
      await automationStore.actions.toggleDisabled(automation._id!)
    } finally {
      changingStatus = false
    }
  }
</script>

<div class="automation-heading">
  {#if !$featureFlags.WORKSPACES}
    <div class="actions-left">
      <div class="automation-name">
        <Body
          size="S"
          weight="500"
          color="var(--spectrum-global-color-gray-900)"
        >
          {automation.name}
        </Body>
      </div>
    </div>
  {/if}

  <div class="actions-right" class:grow={$featureFlags.WORKSPACES}>
    <div class:grow={$featureFlags.WORKSPACES}>
      <Switcher
        on:left={() => {
          viewMode = ViewMode.EDITOR
          closeAllPanels()
        }}
        on:right={() => {
          viewMode = ViewMode.LOGS
          // Clear editor selection when switching to logs mode
          automationStore.actions.selectNode(undefined)
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

    {#if $featureFlags.WORKSPACES}
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
    {:else if !isRowAction}
      <div class="toggle-active setting-spacing">
        <Toggle
          text={automation.disabled ? "Disabled" : "Enabled"}
          on:change={() => {
            if (automation._id) {
              automationStore.actions.toggleDisabled(automation._id)
            }
          }}
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
      {#if hasUnpublishedChanges}
        <CtaNotification
          button={{ message: "Publish changes" }}
          on:click={publishChanges}
          icon="info"
        >
          <span>This automation has unpublished changes</span>
        </CtaNotification>
      {/if}
    </div>
  </div>

  <div class="root">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="wrapper"
      bind:this={paneEl}
      on:mousemove={dnd.handlePointerMove}
      on:mousedown={dnd.updatePaneRect}
    >
      <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        {edgeTypes}
        fitView
        colorMode="dark"
        nodesDraggable={false}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={25} />
        <MiniMap />
      </SvelteFlow>
    </div>
    <div class="canvas-footer-left">
      <UndoRedoControl store={automationHistoryStore} showButtonGroup />
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
  .wrapper {
    position: relative;
    height: 100%;
    --xy-background-color: var(--spectrum-global-color-gray-50);
    --xy-edge-label-background-color: var(--spectrum-global-color-gray-50);
    --xy-node-background-color: var(--background);
    --xy-node-border: 1px var(--grey-3) solid;
    --xy-node-boxshadow-selected: 0 0 0 1px
      var(--spectrum-global-color-blue-400);
    --xy-minimap-mask-background-color-props: var(
      --spectrum-global-color-gray-200
    );
    --xy-minimap-node-background-color-props: var(
      --spectrum-global-color-gray-400
    );
    --xy-controls-button-background-color: var(
      --spectrum-global-color-gray-200
    );
    --xy-edge-stroke: var(--spectrum-global-color-gray-400);
  }

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
    padding: var(--spacing-m) var(--spacing-l);
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

  .actions-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  .grow {
    flex: 1 1 auto;
  }
  .actions-right {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
  }
</style>
