<script lang="ts">
  import { onMount, onDestroy, setContext, tick } from "svelte"
  import { writable, get } from "svelte/store"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    Button,
    ActionButton,
    Switcher,
    StatusLight,
  } from "@budibase/bbui"
  import { memo } from "@budibase/frontend-core"
  import {
    PublishResourceState,
    AutomationStatus,
    type UIAutomation,
    type BlockRef,
  } from "@budibase/types"
  import {
    automationStore,
    automationHistoryStore,
    selectedAutomation,
    workspaceDeploymentStore,
    deploymentStore,
    contextMenuStore,
  } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { type AutomationBlock, ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    buildTopLevelGraph,
    dagreLayoutAutomation,
    type GraphBuildDeps,
  } from "./AutomationStepHelpers"
  import {
    NODE_SPACING,
    DEFAULT_NODE_WIDTH,
    DEFAULT_NODE_HEIGHT,
  } from "./FlowCanvas/FlowGeometry"

  import { createFlowChartDnD } from "./FlowCanvas/FlowChartDnD"
  import TestDataModal from "./TestDataModal.svelte"
  import NodeWrapper from "./FlowCanvas/nodes/NodeWrapper.svelte"
  import CustomEdge from "./FlowCanvas/edges/CustomEdge.svelte"
  import BranchNodeWrapper from "./FlowCanvas/nodes/BranchNodeWrapper.svelte"
  import AnchorNode from "./FlowCanvas/nodes/AnchorNode.svelte"
  import LoopV2Node from "./FlowCanvas/nodes/LoopV2Node.svelte"

  import {
    SvelteFlow,
    useSvelteFlow,
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
  let paneResizeObserver: ResizeObserver | undefined
  let changingStatus = false

  let initialViewportApplied = false
  let preserveViewport = false
  let visibleSelectionRequest: string | undefined
  let lastVisibleSelectionCheck: string | undefined
  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])
  let flowViewport = writable<Viewport>({ x: 0, y: 0, zoom: 1 })
  let focusNodeRequest = writable<{
    nodeId: string
    direction?: -1 | 1
    zoom?: number
    ensureVisible?: boolean
  } | null>(null)

  const { getViewport, setViewport } = useSvelteFlow()

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

    const deps: GraphBuildDeps = {
      xSpacing,
      ySpacing,
      blockRefs,
      newNodes,
      newEdges,
    }

    // Build graph via helpers
    buildTopLevelGraph(blocks, deps)

    const laidOut = dagreLayoutAutomation(
      { nodes: newNodes, edges: newEdges },
      {
        ranksep: xSpacing,
        nodesep: NODE_SPACING,
        compactLoops: true,
      }
    )

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

  $: if (!$automationStore.selectedNodeId && !$automationStore.selectedBranchNode) {
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

  // Check if automation has unpublished changes
  $: hasUnpublishedChanges =
    $workspaceDeploymentStore.automations[automation._id!]
      ?.unpublishedChanges === true

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

    setViewport({ x, y, zoom: 1 }, { duration: 0 })
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
      setViewport(
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

    setViewport(
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

  const ensureSelectedNodeVisible = async (nodeId: string) => {
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
    const xOverflow = nodeRight + margin - paneRect.width
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

    setViewport(
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
    closeContextMenuOnCanvasInteraction()
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
      <Button
        primary={!isLive}
        secondary={isLive}
        icon={isLive ? "stop" : "play"}
        iconColor={isLive ? "" : "var(--bb-blue)"}
        iconWeight="fill"
        disabled={!automation?.definition?.trigger || changingStatus}
        on:click={handleToggleLive}
      >
        {isLive ? "Stop" : "Set live"}
      </Button>
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
        nodesDraggable={false}
        elementsSelectable={viewMode === ViewMode.EDITOR}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        deleteKey={null}
        proOptions={{ hideAttribution: true }}
        onMoveStart={closeContextMenuOnCanvasInteraction}
        onMove={handleMove}
        on:paneclick={closeContextMenuOnCanvasInteraction}
      >
        <FlowControls historyStore={automationHistoryStore} />
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
    --automation-step-icon-data-color: var(--spectrum-global-color-blue-100);
    --automation-step-icon-flow-logic-color: var(
      --spectrum-global-color-indigo-100
    );
    --automation-step-icon-code-color: var(--spectrum-global-color-orange-100);
    --automation-step-icon-trigger-color: var(--color-green-200);
    --automation-step-icon-email-color: var(--spectrum-global-color-green-100);
    --automation-step-icon-ai-color: var(--spectrum-global-color-blue-100);
    --automation-step-icon-apps-color: var(--spectrum-global-color-orange-100);
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
    --xy-edge-stroke: var(--spectrum-global-color-gray-400);
  }

  :global(.spectrum--dark) .wrapper,
  :global(.spectrum--darkest) .wrapper,
  :global(.spectrum--midnight) .wrapper,
  :global(.spectrum--nord) .wrapper {
    --automation-step-icon-data-color: var(--color-blue-600);
    --automation-step-icon-flow-logic-color: var(--color-purple-600);
    --automation-step-icon-code-color: var(--color-orange-600);
    --automation-step-icon-trigger-color: var(--color-green-600);
    --automation-step-icon-email-color: var(--color-green-600);
    --automation-step-icon-ai-color: var(--color-brand-500);
    --automation-step-icon-apps-color: var(--color-orange-400);
    --automation-flow-item-background: var(--spectrum-global-color-gray-200);
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

  .root :global(.svelte-flow__edge-interaction) {
    stroke-width: 12;
  }

  .root :global(.svelte-flow__pane) {
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
