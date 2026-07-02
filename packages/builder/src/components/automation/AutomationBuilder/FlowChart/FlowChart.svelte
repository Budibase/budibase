<script lang="ts">
  import { onMount, onDestroy, setContext, tick } from "svelte"
  import { writable, get } from "svelte/store"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    ActionButton,
    Switcher,
    StatusLight,
  } from "@budibase/bbui"
  import { memo } from "@budibase/frontend-core"
  import {
    PublishResourceState,
    AutomationStatus,
    isBranchStep,
    type UIAutomation,
    type BlockRef,
  } from "@budibase/types"
  import {
    automationStore,
    automationHistoryStore,
    MAX_STICKY_NOTES_PER_AUTOMATION,
    selectedAutomation,
    workspaceDeploymentStore,
    deploymentStore,
    contextMenuStore,
  } from "@/stores/builder"
  import LiveToggleButton from "@/components/common/LiveToggleButton.svelte"
  import { environment } from "@/stores/portal"
  import { type AutomationBlock, ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    buildAutomationGraph,
    type GraphBuildDeps,
  } from "./AutomationStepHelpers"
  import {
    NODE_SPACING,
    DEFAULT_NODE_WIDTH,
    DEFAULT_NODE_HEIGHT,
  } from "./FlowCanvas/FlowGeometry"
  import {
    MIN_STICKY_NOTE_WIDTH,
    MIN_STICKY_NOTE_HEIGHT,
    getBoundsOfFlowBounds,
    getStickyNoteBounds,
    clampStickyNoteToGraphBounds,
    clampStickyNoteToViewportBounds,
    type FlowBounds,
  } from "./FlowCanvas/StickyNoteBounds"

  import { createFlowChartDnD } from "./FlowCanvas/FlowChartDnD"
  import TestDataModal from "./TestDataModal.svelte"
  import NodeWrapper from "./FlowCanvas/nodes/NodeWrapper.svelte"
  import CustomEdge from "./FlowCanvas/edges/CustomEdge.svelte"
  import BranchNodeWrapper from "./FlowCanvas/nodes/BranchNodeWrapper.svelte"
  import AnchorNode from "./FlowCanvas/nodes/AnchorNode.svelte"
  import LoopV2Node from "./FlowCanvas/nodes/LoopV2Node.svelte"
  import StickyNoteNode from "./FlowCanvas/nodes/StickyNoteNode.svelte"

  import {
    SvelteFlow,
    useSvelteFlow,
    getViewportForBounds,
    type Node as FlowNode,
    type Edge as FlowEdge,
    type NodeTypes,
    type EdgeTypes,
    type Viewport,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import FlowControls from "./Controls.svelte"

  export let automation: UIAutomation

  const VIEWPORT_ANIMATION_DURATION = 180
  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 2.5
  const ACTION_PANEL_DEFAULT_WIDTH = 480
  const ACTION_PANEL_MIN_WIDTH = 360
  const ACTION_PANEL_MAX_WIDTH_RATIO = 0.6
  const ACTION_PANEL_STORAGE_KEY = "automation-side-panel-width"

  const memoAutomation = memo(automation)

  const nodeTypes: NodeTypes = {
    "step-node": NodeWrapper as any,
    "branch-node": BranchNodeWrapper as any,
    "anchor-node": AnchorNode as any,
    "loop-subflow-node": LoopV2Node as any,
  }
  const edgeTypes: EdgeTypes = {
    "add-item": CustomEdge as any,
  }

  let testDataModal: Modal
  let blockRefs: Record<string, BlockRef> = {}
  let prodErrors: number = 0
  let paneEl: HTMLDivElement | null = null
  let flowControlsEl: HTMLDivElement | null = null
  let paneResizeObserver: ResizeObserver | undefined
  let changingStatus = false

  let initialViewportApplied = false
  let preserveViewport = false
  let visibleSelectionRequest: string | undefined
  let lastVisibleSelectionCheck: string | undefined
  let lastVisibleActionTargetCheck: string | undefined
  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])
  let flowViewport = writable<Viewport>({ x: 0, y: 0, zoom: 1 })
  let focusNodeRequest = writable<{
    nodeId: string
    direction?: -1 | 1
    zoom?: number
    ensureVisible?: boolean
  } | null>(null)

  const { getViewport, setViewport, getNodes, getNodesBounds } = useSvelteFlow()
  $: stickyNotes = $selectedAutomation?.data?.uiTree?.stickyNotes || []
  $: stickyNoteLayerTransform = `translate(${$flowViewport.x}px, ${
    $flowViewport.y
  }px) scale(${$flowViewport.zoom})`
  $: stickyNoteAddPosition =
    paneEl && $nodes ? getStickyNoteAddPosition($flowViewport) : undefined
  $: canAddMoreStickyNotes =
    stickyNotes.length < MAX_STICKY_NOTES_PER_AUTOMATION
  $: canAddStickyNote = !!stickyNoteAddPosition && canAddMoreStickyNotes
  $: addStickyNoteDisabledReason = canAddMoreStickyNotes
    ? "Move closer to add a note"
    : `Maximum of ${MAX_STICKY_NOTES_PER_AUTOMATION} notes reached`

  // DnD helper and context stores
  const dnd = createFlowChartDnD({
    getViewport,
    setViewport,
    moveBlock: ({ sourcePath, destPath, automationData }) =>
      automationStore.actions.moveBlock(sourcePath, destPath, automationData),
    getSelectedAutomation: () => get(selectedAutomation),
  })
  const { view, viewPos, contentPos } = dnd
  setContext("draggableView", view)
  setContext("viewPos", viewPos)
  setContext("contentPos", contentPos)
  setContext("focusNodeRequest", focusNodeRequest)

  $: updateGraph(blocks)

  $: $automationStore.showTestModal === true && testDataModal.show()

  $: isLive = automation.publishStatus.state === PublishResourceState.PUBLISHED

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

  $: viewMode = $automationStore.viewMode

  const updateGraph = async (blocks: AutomationBlock[]) => {
    if (!preserveViewport) {
      initialViewportApplied = false
    }
    preserveViewport = true
    const xSpacing = 0
    const ySpacing = 340

    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []
    const subflowNodePositions: GraphBuildDeps["subflowNodePositions"] = {}

    const deps: GraphBuildDeps = {
      xSpacing,
      ySpacing,
      blockRefs,
      newNodes,
      newEdges,
      subflowNodePositions,
    }

    const laidOut = buildAutomationGraph(blocks, deps)

    const selectable = viewMode === ViewMode.EDITOR

    nodes.set(
      laidOut.nodes.map(node => ({
        ...node,
        selected: false,
        selectable,
      }))
    )
    edges.set(
      laidOut.edges.map(edge => ({
        ...edge,
        selected: false,
      }))
    )
  }

  $: if ($nodes?.length && !initialViewportApplied && paneEl) {
    focusOnTrigger()
    initialViewportApplied = true
  }

  $: if ($focusNodeRequest && paneEl && $nodes?.length) {
    const targetNode = $nodes.find(
      node => node.id === $focusNodeRequest?.nodeId
    )
    if (targetNode) {
      if ($focusNodeRequest.ensureVisible) {
        ensureSelectedNodeVisible($focusNodeRequest.nodeId)
      } else {
        focusOnNode(
          targetNode,
          $focusNodeRequest.direction,
          $focusNodeRequest.zoom
        )
      }
      focusNodeRequest.set(null)
    }
  }

  $: if (
    !$automationStore.selectedNodeId &&
    !$automationStore.selectedBranchNode
  ) {
    lastVisibleSelectionCheck = undefined
  }

  $: if (
    $automationStore.selectedNodeId &&
    $automationStore.selectedNodeId !== lastVisibleSelectionCheck &&
    paneEl &&
    $nodes?.length
  ) {
    lastVisibleSelectionCheck = $automationStore.selectedNodeId
    visibleSelectionRequest = $automationStore.selectedNodeId
    ensureSelectedNodeVisible($automationStore.selectedNodeId)
  }

  $: if (
    $automationStore.selectedBranchNode?.nodeId &&
    $automationStore.selectedBranchNode.nodeId !== lastVisibleSelectionCheck &&
    paneEl &&
    $nodes?.length
  ) {
    lastVisibleSelectionCheck = $automationStore.selectedBranchNode.nodeId
    visibleSelectionRequest = $automationStore.selectedBranchNode.nodeId
    ensureSelectedNodeVisible($automationStore.selectedBranchNode.nodeId)
  }

  $: actionPanelTargetNodeId = getActionPanelTargetNodeId(
    $automationStore.actionPanelBlock
  )
  $: if (
    actionPanelTargetNodeId &&
    actionPanelTargetNodeId !== lastVisibleActionTargetCheck &&
    paneEl &&
    $nodes?.length
  ) {
    lastVisibleActionTargetCheck = actionPanelTargetNodeId
    visibleSelectionRequest = actionPanelTargetNodeId
    ensureActionPanelTargetVisible(actionPanelTargetNodeId)
  }

  // Check if automation has unpublished changes
  $: hasUnpublishedChanges =
    $workspaceDeploymentStore.automations[automation._id!]
      ?.unpublishedChanges === true

  const setSyncedViewport = (
    viewport: Viewport,
    options?: Parameters<typeof setViewport>[1]
  ) => {
    flowViewport.set(viewport)
    setViewport(viewport, options)
  }

  // Keep the trigger focused on load
  const focusOnTrigger = () => {
    if (!paneEl || $nodes.length === 0) {
      return
    }

    const triggerNode = $nodes[0]

    const paneRect = paneEl.getBoundingClientRect()
    const nodeHeight = DEFAULT_NODE_HEIGHT
    const nodeOffset = NODE_SPACING

    // These assume the trigger is at x=0, y=0
    const paneHeight = paneRect.height
    const x = nodeOffset - triggerNode.position.x
    const y = paneHeight / 2 - triggerNode.position.y - nodeHeight / 2

    setSyncedViewport({ x, y, zoom: 1 }, { duration: 0 })
  }

  const focusOnNode = (
    targetNode: FlowNode,
    direction?: -1 | 1,
    zoom?: number
  ) => {
    if (!paneEl) {
      return
    }

    const currentViewport = getViewport()
    if (!currentViewport) {
      return
    }

    const nodeWidth = targetNode.width || DEFAULT_NODE_WIDTH
    const nodeHeight = targetNode.height || DEFAULT_NODE_HEIGHT
    const desiredZoom = zoom ?? currentViewport.zoom ?? 1
    const safeZoom = Math.min(Math.max(desiredZoom, MIN_ZOOM), MAX_ZOOM)

    if (direction === -1 || direction === 1) {
      const stride = (nodeWidth + NODE_SPACING) * safeZoom
      const x = currentViewport.x - direction * stride
      const y = currentViewport.y
      setSyncedViewport(
        { x, y, zoom: safeZoom },
        { duration: VIEWPORT_ANIMATION_DURATION }
      )
      return
    }

    const paneRect = paneEl.getBoundingClientRect()
    const position = getAbsoluteNodePosition(targetNode)
    const x =
      paneRect.width / 2 - position.x * safeZoom - (nodeWidth / 2) * safeZoom
    const y =
      paneRect.height / 2 - position.y * safeZoom - (nodeHeight / 2) * safeZoom

    setSyncedViewport(
      { x, y, zoom: safeZoom },
      { duration: VIEWPORT_ANIMATION_DURATION }
    )
  }

  const getAbsoluteNodePosition = (node: FlowNode) => {
    const position = { ...node.position }
    let parentId = node.parentId
    while (parentId) {
      const parent = get(nodes).find(n => n.id === parentId)
      if (!parent) {
        break
      }
      position.x += parent.position.x
      position.y += parent.position.y
      parentId = parent.parentId
    }
    return position
  }

  const getNodeDimensions = (node: FlowNode) => {
    const data = node.data as Record<string, unknown> | undefined
    return {
      width:
        node.width ||
        (typeof data?.laneWidth === "number" ? data.laneWidth : undefined) ||
        (typeof data?.containerWidth === "number"
          ? data.containerWidth
          : undefined) ||
        DEFAULT_NODE_WIDTH,
      height:
        node.height ||
        (typeof data?.containerHeight === "number"
          ? data.containerHeight
          : undefined) ||
        DEFAULT_NODE_HEIGHT,
    }
  }

  const getAutomationViewportBounds = () => {
    const flowNodes = getNodes()
    const bounds: FlowBounds[] = []

    if (flowNodes.length) {
      bounds.push(getNodesBounds(flowNodes))
    }
    bounds.push(...stickyNotes.map(getStickyNoteBounds))

    return bounds.length ? getBoundsOfFlowBounds(bounds) : undefined
  }

  const handleAutoLayout = () => {
    if (!paneEl) {
      return
    }

    const bounds = getAutomationViewportBounds()
    if (!bounds) {
      return
    }

    const rect = paneEl.getBoundingClientRect()
    const viewport = getViewportForBounds(
      bounds,
      rect.width,
      rect.height,
      MIN_ZOOM,
      MAX_ZOOM,
      0.1
    )
    setSyncedViewport(viewport, { duration: VIEWPORT_ANIMATION_DURATION })
  }

  const getActionPanelTargetNodeId = (target: unknown) => {
    if (!target || typeof target !== "object") {
      lastVisibleActionTargetCheck = undefined
      return undefined
    }

    const block = target as Record<string, unknown>
    if (block.branchNode) {
      const branchStepId =
        typeof block.branchStepId === "string" ? block.branchStepId : undefined
      const branchIdx =
        typeof block.branchIdx === "number" ? block.branchIdx : undefined
      if (!branchStepId || branchIdx == null) {
        return undefined
      }

      const branchStep = automationStore.actions.getBlockByRef(
        $selectedAutomation.data,
        $selectedAutomation.blockRefs?.[branchStepId]
      )
      if (!branchStep || !isBranchStep(branchStep)) {
        return undefined
      }

      const branchId = branchStep.inputs.branches?.[branchIdx]?.id
      return branchId
        ? `branch-${branchStepId}-${branchIdx}-${branchId}`
        : undefined
    }

    if (typeof block.id === "string") {
      const anchorNodeId = `anchor-${block.id}`
      return get(nodes).some(node => node.id === anchorNodeId)
        ? anchorNodeId
        : block.id
    }

    return undefined
  }

  const getActionPanelWidth = () => {
    const storedWidth = Number(localStorage.getItem(ACTION_PANEL_STORAGE_KEY))
    const fallbackWidth = ACTION_PANEL_DEFAULT_WIDTH
    const rawWidth =
      Number.isFinite(storedWidth) && storedWidth > 0
        ? storedWidth
        : fallbackWidth
    const maxWidth = Math.max(
      ACTION_PANEL_MIN_WIDTH,
      Math.floor(window.innerWidth * ACTION_PANEL_MAX_WIDTH_RATIO)
    )
    return Math.max(ACTION_PANEL_MIN_WIDTH, Math.min(rawWidth, maxWidth))
  }

  const ensureSelectedNodeVisible = async (
    nodeId: string,
    options: { rightInset?: number } = {}
  ) => {
    await tick()
    if (visibleSelectionRequest !== nodeId || !paneEl) {
      return
    }

    const targetNode = get(nodes).find(node => node.id === nodeId)
    const currentViewport = getViewport()
    if (!targetNode || !currentViewport) {
      return
    }

    const paneRect = paneEl.getBoundingClientRect()
    const { width: nodeWidth, height: nodeHeight } =
      getNodeDimensions(targetNode)
    const position = getAbsoluteNodePosition(targetNode)
    const margin = 24
    const rightInset = options.rightInset ?? 0
    const visiblePaneWidth = Math.max(paneRect.width - rightInset, 0)
    const nodeRight =
      position.x * currentViewport.zoom +
      currentViewport.x +
      nodeWidth * currentViewport.zoom
    const nodeLeft = position.x * currentViewport.zoom + currentViewport.x
    const nodeBottom =
      position.y * currentViewport.zoom +
      currentViewport.y +
      nodeHeight * currentViewport.zoom
    const nodeTop = position.y * currentViewport.zoom + currentViewport.y
    const xOverflow = nodeRight + margin - visiblePaneWidth
    const xUnderflow = margin - nodeLeft
    const yOverflow = nodeBottom + margin - paneRect.height
    const yUnderflow = margin - nodeTop

    if (
      xOverflow <= 0 &&
      xUnderflow <= 0 &&
      yOverflow <= 0 &&
      yUnderflow <= 0
    ) {
      return
    }

    let nextX = currentViewport.x
    let nextY = currentViewport.y
    if (xOverflow > 0) {
      nextX -= xOverflow
    } else if (xUnderflow > 0) {
      nextX += xUnderflow
    }
    if (yOverflow > 0) {
      nextY -= yOverflow
    } else if (yUnderflow > 0) {
      nextY += yUnderflow
    }

    setSyncedViewport(
      {
        x: nextX,
        y: nextY,
        zoom: currentViewport.zoom,
      },
      { duration: VIEWPORT_ANIMATION_DURATION }
    )
  }

  const ensureActionPanelTargetVisible = async (nodeId: string) => {
    await tick()
    if (visibleSelectionRequest !== nodeId || !paneEl) {
      return
    }

    const targetNode = get(nodes).find(node => node.id === nodeId)
    const currentViewport = getViewport()
    if (!targetNode || !currentViewport) {
      return
    }

    const paneRect = paneEl.getBoundingClientRect()
    const { width: nodeWidth, height: nodeHeight } =
      getNodeDimensions(targetNode)
    const position = getAbsoluteNodePosition(targetNode)
    const margin = 24
    const visiblePaneWidth = Math.max(paneRect.width - getActionPanelWidth(), 0)
    const nodeRight =
      position.x * currentViewport.zoom +
      currentViewport.x +
      nodeWidth * currentViewport.zoom
    const nodeLeft = position.x * currentViewport.zoom + currentViewport.x
    const nodeBottom =
      position.y * currentViewport.zoom +
      currentViewport.y +
      nodeHeight * currentViewport.zoom
    const nodeTop = position.y * currentViewport.zoom + currentViewport.y
    const xOverflow = nodeRight + margin - visiblePaneWidth
    const xUnderflow = margin - nodeLeft
    const yOverflow = nodeBottom + margin - paneRect.height
    const yUnderflow = margin - nodeTop

    if (
      xOverflow <= 0 &&
      xUnderflow <= 0 &&
      yOverflow <= 0 &&
      yUnderflow <= 0
    ) {
      return
    }

    let nextX = currentViewport.x
    let nextY = currentViewport.y
    if (xOverflow > 0) {
      nextX -= xOverflow
    } else if (xUnderflow > 0) {
      nextX += xUnderflow
    }
    if (yOverflow > 0) {
      nextY -= yOverflow
    } else if (yUnderflow > 0) {
      nextY += yUnderflow
    }

    setSyncedViewport(
      {
        x: nextX,
        y: nextY,
        zoom: currentViewport.zoom,
      },
      { duration: VIEWPORT_ANIMATION_DURATION }
    )
  }

  const refresh = () => {
    // Get all processed block references
    blockRefs = $selectedAutomation.blockRefs
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

  const handleToggleLive = async () => {
    try {
      changingStatus = true
      await automationStore.actions.toggleDisabled(automation._id!, {
        publish: true,
      })
    } finally {
      changingStatus = false
    }
  }

  const closeContextMenuOnCanvasInteraction = () => {
    if (get(contextMenuStore).visible) {
      contextMenuStore.close()
    }
  }

  const handleMove = () => {
    const viewport = getViewport()
    if (viewport) {
      flowViewport.set(viewport)
    }
    closeContextMenuOnCanvasInteraction()
  }

  const getStickyNoteAddPosition = (viewport: Viewport | undefined) => {
    if (!paneEl || !viewport) {
      return undefined
    }
    const rect = paneEl.getBoundingClientRect()
    const toolbarRect = flowControlsEl?.getBoundingClientRect()
    const toolbarTop = toolbarRect ? toolbarRect.top - rect.top : rect.height
    const margin = 40
    const toolbarTopFlowY = (toolbarTop - viewport.y) / viewport.zoom
    const position = {
      x: (rect.width / 2 - viewport.x) / viewport.zoom,
      y: toolbarTopFlowY - MIN_STICKY_NOTE_HEIGHT - margin,
    }
    const flowNodes = getNodes()
    const graphPosition = flowNodes.length
      ? clampStickyNoteToGraphBounds(position, getNodesBounds(flowNodes), {
          width: MIN_STICKY_NOTE_WIDTH,
          height: MIN_STICKY_NOTE_HEIGHT,
        })
      : position

    const viewportPosition = clampStickyNoteToViewportBounds(
      graphPosition,
      viewport,
      { width: rect.width, height: rect.height },
      {
        width: MIN_STICKY_NOTE_WIDTH,
        height: MIN_STICKY_NOTE_HEIGHT,
      }
    )

    return graphPosition.x === viewportPosition.x &&
      graphPosition.y === viewportPosition.y
      ? graphPosition
      : undefined
  }

  const handleAddNote = () => {
    if (!canAddMoreStickyNotes) {
      return
    }

    const position = getStickyNoteAddPosition(getViewport())
    if (!position) {
      return
    }

    automationStore.actions.addStickyNote(position)
  }

  const handleCanvasPointerMove = (e: PointerEvent) => {
    dnd.handlePointerMove(e)
    if (e.buttons > 0) {
      closeContextMenuOnCanvasInteraction()
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
    paneResizeObserver = new ResizeObserver(() => {
      dnd.updatePaneRect()
    })
    if (paneEl) {
      paneResizeObserver.observe(paneEl)
    }
    dnd.initDnD()
  })

  onDestroy(() => {
    paneResizeObserver?.disconnect()
    dnd.destroyDnD()
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
        <button class="unpublished-changes-btn" on:click={publishChanges}>
          <StatusLight color="var(--spectrum-global-color-blue-600)" size="L" />
          <div class="unpublished-changes-text">Unpublished changes</div>
        </button>
      {/if}
    </div>

    <ActionButton
      quiet
      disabled={!automation?.definition?.trigger}
      on:click={() => {
        automationStore.update(state => ({ ...state, showTestModal: true }))
      }}
    >
      Run test
    </ActionButton>

    <div class="toggle-active setting-spacing">
      <LiveToggleButton
        live={isLive}
        disabled={!automation?.definition?.trigger || changingStatus}
        on:click={handleToggleLive}
      />
    </div>
  </div>
</div>

<div class="main-flow">
  <div class="root">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="wrapper"
      bind:this={paneEl}
      on:pointermove={handleCanvasPointerMove}
      on:mousedown={() => {
        dnd.updatePaneRect()
      }}
    >
      <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        {edgeTypes}
        viewport={flowViewport}
        colorMode="system"
        nodesDraggable={true}
        elementsSelectable={viewMode === ViewMode.EDITOR}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        deleteKey={null}
        proOptions={{ hideAttribution: true }}
        onMoveStart={closeContextMenuOnCanvasInteraction}
        onMove={handleMove}
        on:paneclick={closeContextMenuOnCanvasInteraction}
      >
        <FlowControls
          bind:controlsEl={flowControlsEl}
          historyStore={automationHistoryStore}
          canAddNote={canAddStickyNote}
          addNoteDisabledReason={addStickyNoteDisabledReason}
          onAddNote={handleAddNote}
          onAutoLayout={handleAutoLayout}
        />
        <div
          class="sticky-note-layer"
          style:transform={stickyNoteLayerTransform}
        >
          {#each stickyNotes as note (note.id)}
            <StickyNoteNode
              data={{ note }}
              positionAbsoluteX={note.x}
              positionAbsoluteY={note.y}
            />
          {/each}
        </div>
      </SvelteFlow>
    </div>
  </div>
</div>

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
    overflow: hidden;
    background-color: var(--xy-background-color);
    --automation-flow-item-background: var(--background);
    --xy-background-color: var(--spectrum-global-color-gray-75);
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
    --xy-edge-stroke: var(--spectrum-global-color-gray-300);
  }

  :global(.spectrum--dark) .wrapper,
  :global(.spectrum--darkest) .wrapper,
  :global(.spectrum--midnight) .wrapper,
  :global(.spectrum--nord) .wrapper {
    --automation-flow-item-background: var(--spectrum-global-color-gray-200);
  }

  .main-flow {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--xy-background-color);
  }

  .automation-heading {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--background);
    padding: var(--spacing-m) var(--spacing-l) var(--spacing-m) var(--spacing-l);
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
    background-color: var(--xy-background-color);
  }

  .sticky-note-layer {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
    pointer-events: none;
    z-index: 1002;
  }

  .root :global(.svelte-flow__edgelabel-renderer) {
    z-index: 4;
    pointer-events: none;
  }

  .root :global(.svelte-flow__edge-interaction) {
    stroke-width: 12;
  }

  .root :global(.svelte-flow__pane) {
    background-color: var(--xy-background-color);
  }

  .root :global(.svelte-flow) {
    background-color: var(--xy-background-color);
  }

  .root :global(.block) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .root :global(.blockSection) {
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
  }

  .toggle-active :global(.spectrum-Switch-label) {
    margin-right: 0px;
  }

  .actions-right {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
  }

  :global(.svelte-flow__handle.custom-handle) {
    background-color: var(
      --automation-flow-handle-color,
      var(--spectrum-global-color-gray-700)
    );
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
