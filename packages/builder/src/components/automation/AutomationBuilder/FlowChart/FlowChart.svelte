<script lang="ts">
  import { onMount, onDestroy, setContext } from "svelte"
  import { get } from "svelte/store"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    Toggle,
    ActionButton,
    Switcher,
    StatusLight,
  } from "@budibase/bbui"
  import { memo } from "@budibase/frontend-core"
  import {
    PublishResourceState,
    AutomationStatus,
    type UIAutomation,
    type LayoutDirection,
    type BlockRef,
  } from "@budibase/types"
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
    workspaceDeploymentStore,
    deploymentStore,
  } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { type AutomationBlock, ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import { getBlocks as getBlocksHelper } from "./AutomationStepHelpers"
  import { buildTopLevelGraph } from "./FlowCanvas/FlowGraphBuilder"
  import {
    applyLoopContainerBounds,
    positionAnchorNodes,
    computeAutoLayout,
    isLayoutEmpty,
  } from "./FlowCanvas/FlowLayout"
  import type { AutomationLayout } from "@budibase/types"

  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { dragState } from "./FlowCanvas/DragState"
  import TestDataModal from "./TestDataModal.svelte"
  import NodeWrapper from "./FlowCanvas/nodes/NodeWrapper.svelte"
  import StandardEdge from "./FlowCanvas/edges/StandardEdge.svelte"
  import BranchEdge from "./FlowCanvas/edges/BranchEdge.svelte"
  import BranchNodeWrapper from "./FlowCanvas/nodes/BranchNodeWrapper.svelte"
  import LoopV2Node from "./FlowCanvas/nodes/LoopV2Node.svelte"

  import {
    SvelteFlow,
    SvelteFlowProvider,
    Background,
    BackgroundVariant,
    useSvelteFlow,
    type Node as FlowNode,
    type Edge as FlowEdge,
    type NodeTypes,
    type EdgeTypes,
    type OnConnectEnd,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import FlowControls from "./Controls.svelte"

  interface Props {
    automation: UIAutomation
  }

  let { automation }: Props = $props()

  const memoAutomation = memo(automation)

  const nodeTypes: NodeTypes = {
    "step-node": NodeWrapper as any,
    "branch-node": BranchNodeWrapper as any,
    "loop-subflow-node": LoopV2Node as any,
  }
  const edgeTypes: EdgeTypes = {
    "standard-edge": StandardEdge as any,
    "branch-edge": BranchEdge as any,
  }

  let testDataModal: Modal
  let confirmDeleteDialog
  let blockRefs: Record<string, BlockRef> = {}
  let prodErrors = $state<number>(0)
  let paneEl: HTMLDivElement | null = null
  let changingStatus = $state(false)

  let initialViewportApplied = false
  const layoutDirection: LayoutDirection = "LR"

  let nodes = $state.raw<FlowNode[]>([])
  let edges = $state.raw<FlowEdge[]>([])

  // Track the last block IDs to avoid unnecessary graph rebuilds on layout-only changes
  let lastBlockIds: string[] = []

  const { getViewport, setViewport } = useSvelteFlow()

  // Initialize simplified DnD state
  dragState.init({
    moveBlock: ({ sourcePath, destPath, automationData }) =>
      automationStore.actions.moveBlock(sourcePath, destPath, automationData),
    getBlockRefs: () => get(selectedAutomation)?.blockRefs,
    getAutomation: () => get(selectedAutomation)?.data,
    getViewportZoom: () => getViewport()?.zoom ?? 1,
  })
  setContext("dragState", dragState)

  let viewMode = $derived($automationStore.viewMode)

  let displayToggleValue = $derived(
    automation.publishStatus.state === PublishResourceState.PUBLISHED
  )

  // Parse the automation tree state
  let blocks = $derived(
    getBlocksHelper($selectedAutomation.data || $memoAutomation, viewMode)
      .filter(x => x.stepId !== ActionStepID.LOOP)
      .map((block, idx) => ({ ...block, __top: idx }))
  )

  // Check if automation has unpublished changes
  let hasUnpublishedChanges = $derived(
    $workspaceDeploymentStore.automations[automation._id!]
      ?.unpublishedChanges === true
  )

  // Effect to update graph when blocks change structurally
  $effect(() => {
    // Only rebuild graph if the block structure has changed, not just layout
    const currentBlockIds = blocks.map(b => b.id).join(",")
    if (currentBlockIds !== lastBlockIds.join(",")) {
      lastBlockIds = blocks.map(b => b.id)
      updateGraph(blocks)
    }
  })

  // Effect to show test modal
  $effect(() => {
    if ($automationStore.showTestModal === true) {
      testDataModal.show()
    }
  })

  // Memo auto - selectedAutomation
  $effect(() => {
    memoAutomation.set($selectedAutomation.data || automation)
  })

  // Parse the automation tree state - refresh when blockRefs change
  $effect(() => {
    if ($selectedAutomation.blockRefs) {
      refresh()
    }
  })

  // Focus on trigger when nodes are ready
  $effect(() => {
    if (nodes?.length && !initialViewportApplied && paneEl) {
      focusOnTrigger()
      initialViewportApplied = true
    }
  })

  const buildLayoutMap = (currentNodes: FlowNode[]): AutomationLayout => {
    const layout: AutomationLayout = {}
    currentNodes.forEach(node => {
      layout[node.id] = {
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      }
    })
    return layout
  }

  let layoutSaveTimeout: ReturnType<typeof setTimeout> | undefined

  const scheduleLayoutSave = (currentNodes: FlowNode[]) => {
    if (viewMode !== ViewMode.EDITOR || !$selectedAutomation.data) {
      return
    }
    const layout = buildLayoutMap(currentNodes)
    if (layoutSaveTimeout) {
      clearTimeout(layoutSaveTimeout)
    }
    layoutSaveTimeout = setTimeout(async () => {
      if (!$selectedAutomation.data) {
        return
      }
      try {
        const updatedAutomation = {
          ...$selectedAutomation.data,
          layout,
        } as UIAutomation & { layout: AutomationLayout }
        await automationStore.actions.save(updatedAutomation as any)
      } catch (error) {
        notifications.error("Unable to save node positions")
      }
    }, 500)
  }

  const updateGraph = async (blocks: AutomationBlock[]) => {
    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []
    const savedLayout =
      ($selectedAutomation.data as UIAutomation & { layout?: AutomationLayout })
        ?.layout ||
      (automation as UIAutomation & { layout?: AutomationLayout }).layout ||
      undefined

    // Get the block IDs to check if saved layout has positions for current blocks
    const blockIds = blocks.map(b => b.id)
    const needsAutoLayout = isLayoutEmpty(savedLayout, blockIds)

    const deps = {
      blockRefs,
      newNodes,
      newEdges,
      direction: layoutDirection,
      layout: needsAutoLayout ? {} : savedLayout,
      xSpacing: 0,
      ySpacing: 0,
    }

    // Build graph via helpers
    buildTopLevelGraph(blocks, deps)

    // Apply loop container bounds first (needed for layout calculations)
    applyLoopContainerBounds({ nodes: newNodes, edges: newEdges })

    const layoutCoverage = savedLayout
      ? blockIds.filter(id => savedLayout[id] !== undefined).length /
        blockIds.length
      : 0

    // If no saved layout exists, compute auto-layout
    if (needsAutoLayout && newNodes.length > 0) {
      const computedLayout = computeAutoLayout(
        { nodes: newNodes, edges: newEdges },
        layoutDirection
      )

      // Apply computed positions to nodes
      newNodes.forEach(node => {
        const pos = computedLayout[node.id]
        if (pos) {
          node.position = { x: pos.x, y: pos.y }
        }
      })

      applyLoopContainerBounds({ nodes: newNodes, edges: newEdges })

      if (viewMode === ViewMode.EDITOR && $selectedAutomation.data) {
        scheduleLayoutSave(newNodes)
      }
    }

    positionAnchorNodes({ nodes: newNodes, edges: newEdges }, layoutDirection)

    nodes = newNodes
    edges = newEdges
  }

  const handleNodeDragStop = ({
    nodes: draggedNodes,
  }: {
    nodes: FlowNode[]
  }) => {
    // Apply bounds and anchor positioning to the dragged nodes
    applyLoopContainerBounds({ nodes: draggedNodes, edges })
    positionAnchorNodes({ nodes: draggedNodes, edges }, layoutDirection)
    // Save the layout without reassigning nodes (SvelteFlow already updated them via bind:nodes)
    scheduleLayoutSave(draggedNodes)
  }

  // Keep the trigger focused on load and when changing layout
  const focusOnTrigger = () => {
    if (!paneEl || nodes.length === 0) {
      return
    }

    const triggerNode = nodes[0]

    const paneRect = paneEl.getBoundingClientRect()
    const nodeHeight = 150
    const nodeOffset = 100

    const paneHeight = paneRect.height
    const x = nodeOffset - triggerNode.position.x
    const y = paneHeight / 2 - triggerNode.position.y - nodeHeight / 2

    setViewport({ x, y, zoom: 1 }, { duration: 0 })
  }

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

  const toggleLogsPanel = () => {
    if ($automationStore.showLogsPanel) {
      automationStore.actions.closeLogsPanel()
      automationStore.actions.setViewMode(ViewMode.EDITOR)
    } else {
      automationStore.actions.openLogsPanel()
      automationStore.actions.closeLogPanel()
      automationStore.actions.setViewMode(ViewMode.LOGS)
      // Clear editor selection when switching to logs mode
      automationStore.actions.selectNode(undefined)
    }
  }

  const closeAllPanels = () => {
    automationStore.actions.closeLogsPanel()
    automationStore.actions.closeLogPanel()
    automationStore.actions.setViewMode(ViewMode.EDITOR)
  }

  const handleToggleChange = async () => {
    try {
      changingStatus = true
      await automationStore.actions.toggleDisabled(automation._id!)
    } finally {
      changingStatus = false
    }
  }

  // Handle dragging a connection from a handle and dropping on empty canvas
  const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
    // If connection landed on a valid target, do nothing (normal connection)
    if (connectionState.isValid) {
      return
    }

    // Only handle in editor mode
    if (viewMode !== ViewMode.EDITOR) {
      return
    }

    const sourceNodeId = connectionState.fromNode?.id
    if (!sourceNodeId) {
      return
    }

    const blockRef = $selectedAutomation?.blockRefs?.[sourceNodeId]

    // Check if we're inside a loop by looking at the path
    const loopHop = blockRef?.pathTo?.findLast(
      (h: { loopStepId?: string }) => h.loopStepId !== undefined
    )
    const loopStepId = loopHop?.loopStepId

    if (loopStepId) {
      // Inside a loop - pass loop context
      automationStore.actions.openActionPanel({
        id: sourceNodeId,
        pathTo: blockRef?.pathTo,
        insertIntoLoopV2: true,
        loopStepId,
      })
    } else {
      // Regular flow - just pass the block reference
      automationStore.actions.openActionPanel({
        id: sourceNodeId,
        pathTo: blockRef?.pathTo,
      })
    }
  }

  const updateContainerRect = () => {
    if (paneEl) {
      dragState.setContainerRect(paneEl.getBoundingClientRect())
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
    updateContainerRect()
  })

  onDestroy(() => {
    dragState.cancelDrag()
    if (layoutSaveTimeout) {
      clearTimeout(layoutSaveTimeout)
    }
  })
</script>

<div class="automation-heading">
  <div class="actions-right">
    <div class="actions-group">
      <Switcher
        on:left={() => {
          automationStore.actions.setViewMode(ViewMode.EDITOR)
          closeAllPanels()
        }}
        on:right={() => {
          automationStore.actions.setViewMode(ViewMode.LOGS)
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
      {#if hasUnpublishedChanges}
        <button class="unpublished-changes-btn" onclick={publishChanges}>
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
  <div class="root">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="wrapper"
      bind:this={paneEl}
      onmousedown={updateContainerRect}
    >
      <SvelteFlow
        bind:nodes
        {nodeTypes}
        bind:edges
        {edgeTypes}
        colorMode="system"
        nodesDraggable={true}
        onnodedragstop={handleNodeDragStop}
        onconnectend={handleConnectEnd}
        minZoom={0.4}
        maxZoom={1}
        deleteKey={null}
        proOptions={{ hideAttribution: true }}
      >
        <FlowControls historyStore={automationHistoryStore} />
        <Background variant={BackgroundVariant.Dots} gap={25} />
      </SvelteFlow>
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
    --xy-background-color: var(--spectrum-global-color-gray-75);
    --xy-edge-label-background-color: transparent;
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

  .root {
    height: 100%;
    width: 100%;
  }

  .root :global(.svelte-flow__edgelabel-renderer) {
    z-index: 4;
    pointer-events: none;
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

  .actions-right {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
    flex: 1 1 auto;
  }

  :global(.svelte-flow__handle.custom-handle) {
    background-color: var(--spectrum-global-color-gray-700);
    border-radius: 1px;
    width: 8px;
    height: 4px;
    border: none;
    min-width: 2px;
    min-height: 2px;
  }

  :global(.svelte-flow__handle.custom-handle:hover),
  :global(.svelte-flow__handle.custom-handle.connectionindicator:focus),
  :global(.svelte-flow__handle.custom-handle.connectingfrom),
  :global(.svelte-flow__handle.custom-handle.connectingto) {
    background-color: var(--xy-theme-edge-hover);
  }

  :global(.svelte-flow__handle-bottom.custom-handle) {
    bottom: -5px;
    transform: none;
  }

  :global(.svelte-flow__handle-top.custom-handle) {
    top: -5px;
    transform: none;
  }

  :global(.svelte-flow__handle-left.custom-handle) {
    height: 8px;
    width: 4px;
    left: -3px;
  }
  :global(.svelte-flow__handle-right.custom-handle) {
    height: 8px;
    width: 4px;
    right: -3px;
  }

  /* Source handle styling - these are draggable to add new nodes */
  :global(.svelte-flow__handle.custom-handle.source-handle) {
    cursor: crosshair;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  :global(.svelte-flow__handle.custom-handle.source-handle:hover) {
    background-color: var(--spectrum-global-color-blue-500);
    transform: scale(1.3);
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
