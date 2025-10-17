<script lang="ts">
  import { onMount, onDestroy, setContext } from "svelte"
  import { writable, get } from "svelte/store"
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
  import {
    getBlocks as getBlocksHelper,
    buildTopLevelGraph,
    dagreLayoutAutomation,
    type GraphBuildDeps,
  } from "./AutomationStepHelpers"

  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { createFlowChartDnD } from "./FlowCanvas/FlowChartDnD"
  import TestDataModal from "./TestDataModal.svelte"
  import NodeWrapper from "./FlowCanvas/nodes/NodeWrapper.svelte"
  import CustomEdge from "./FlowCanvas/edges/CustomEdge.svelte"
  import BranchNodeWrapper from "./FlowCanvas/nodes/BranchNodeWrapper.svelte"
  import AnchorNode from "./FlowCanvas/nodes/AnchorNode.svelte"
  import LoopV2Node from "./FlowCanvas/nodes/LoopV2Node.svelte"

  import {
    SvelteFlow,
    Background,
    BackgroundVariant,
    useSvelteFlow,
    type Node as FlowNode,
    type Edge as FlowEdge,
    type NodeTypes,
    type EdgeTypes,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import FlowControls from "./Controls.svelte"

  export let automation: UIAutomation

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
  let confirmDeleteDialog
  let blockRefs: Record<string, BlockRef> = {}
  let prodErrors: number = 0
  let paneEl: HTMLDivElement | null = null
  let changingStatus = false

  let initialViewportApplied = false
  let preserveViewport = false
  let layoutDirection: LayoutDirection = automation.layoutDirection || "TB"

  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])

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

  $: updateGraph(blocks, layoutDirection)

  $: $automationStore.showTestModal === true && testDataModal.show()

  $: displayToggleValue =
    automation.publishStatus.state === PublishResourceState.PUBLISHED

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

  const updateGraph = async (
    blocks: AutomationBlock[],
    direction: LayoutDirection
  ) => {
    if (!preserveViewport) {
      initialViewportApplied = false
    }
    preserveViewport = true
    const xSpacing = 300
    const ySpacing = 340

    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []

    const deps: GraphBuildDeps = {
      xSpacing,
      ySpacing,
      blockRefs,
      newNodes,
      newEdges,
      direction,
    }

    // Build graph via helpers
    buildTopLevelGraph(blocks, deps)

    // Run Dagre layout with selected direction
    const laidOut = dagreLayoutAutomation(
      { nodes: newNodes, edges: newEdges },
      { rankdir: direction, ranksep: 100, nodesep: 100, compactLoops: true }
    )

    nodes.set(laidOut.nodes)
    edges.set(laidOut.edges)
  }

  $: if ($nodes?.length && !initialViewportApplied && paneEl) {
    focusOnTrigger()
    initialViewportApplied = true
  }

  // Check if automation has unpublished changes
  $: hasUnpublishedChanges =
    $workspaceDeploymentStore.automations[automation._id!]
      ?.unpublishedChanges === true

  // Keep the trigger focused on load and when changing layout
  const focusOnTrigger = () => {
    if (!paneEl || $nodes.length === 0) {
      return
    }

    const triggerNode = $nodes[0]

    const paneRect = paneEl.getBoundingClientRect()
    const nodeWidth = 320
    const nodeHeight = 150
    const nodeOffset = 100

    let x, y

    // These assume the trigger is at x=0, y=0
    if (layoutDirection === "LR") {
      // Center vertically with a slight left offset
      const paneHeight = paneRect.height
      x = nodeOffset - triggerNode.position.x
      y = paneHeight / 2 - triggerNode.position.y - nodeHeight / 2
    } else {
      // Vertical mode. Center horizontally, top offset
      const paneWidth = paneRect.width
      x = paneWidth / 2 - triggerNode.position.x - nodeWidth / 2
      y = nodeOffset - triggerNode.position.y
    }

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

  const saveDirectionChange = async (direction: LayoutDirection) => {
    layoutDirection = direction
    preserveViewport = false
    try {
      await automationStore.actions.save({
        ...automation,
        layoutDirection,
      })
      focusOnTrigger()
    } catch (error) {
      notifications.error("Unable to save layout direction")
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
        colorMode="system"
        nodesDraggable={false}
        minZoom={0.4}
        maxZoom={1}
        deleteKey={null}
        proOptions={{ hideAttribution: true }}
      >
        <FlowControls
          historyStore={automationHistoryStore}
          {layoutDirection}
          onChangeDirection={saveDirectionChange}
        />
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
