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
    type Automation,
  } from "@budibase/types"

  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { PublishResourceState } from "@budibase/types"

  export let automation: Automation

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
  $: viewMode = ViewMode.EDITOR

  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])

  // Drag/drop contexts (ported from DraggableCanvas, simplified for Svelte Flow)
  type DragView = {
    dragging: boolean
    moveStep: null | {
      id: string
      offsetX: number
      offsetY: number
      w?: number
      h?: number
      mouse?: { x: number; y: number }
    }
    dragSpot: { x: number; y: number } | null
    scale: number
    dropzones: Record<string, { dims: DOMRect; path: any }>
    droptarget: string | null
    focusEle?: any
  }

  const view = writable<DragView>({
    dragging: false,
    moveStep: null,
    dragSpot: null,
    scale: 1,
    dropzones: {},
    droptarget: null,
  })
  const viewPos = writable({ x: 0, y: 0 })
  const contentPos = writable({ scrollX: 0, scrollY: 0 })

  setContext("draggableView", view)
  setContext("viewPos", viewPos)
  setContext("contentPos", contentPos)

  // Svelte Flow viewport helpers
  const { getViewport, setViewport } = useSvelteFlow()

  // Local refs for pointer math and auto-scroll
  let paneEl: HTMLDivElement | null = null
  let paneRect: DOMRect | null = null
  let scrollInterval: any
  let scrollZones: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  } | null = null

  $: updateGraph(blocks as any, viewMode)

  let changingStatus = false

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

    // Run Dagre layout (top-to-bottom, tighter spacing)
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
    // Register global mouseup to finish drag / drop
    const onDocMouseUp = () => {
      const current = get(view)
      if (current.dragging) {
        if (current.droptarget) {
          try {
            const sourceBlock =
              $selectedAutomation.blockRefs[current.moveStep?.id as string]
            const sourcePath = sourceBlock?.pathTo
            const drop = current.dropzones[current.droptarget]
            const destPath = drop?.path
            if (sourcePath && destPath && $selectedAutomation.data) {
              automationStore.actions.moveBlock(
                sourcePath,
                destPath,
                $selectedAutomation.data
              )
            }
          } catch (e) {
            console.error("Drag drop move failed", e)
          }
        }
        view.update(s => ({
          ...s,
          dragging: false,
          moveStep: null,
          dragSpot: null,
          dropzones: {},
          droptarget: null,
        }))
        contentPos.set({ scrollX: 0, scrollY: 0 })
        clearScrollInterval()
      }
    }
    document.addEventListener("mouseup", onDocMouseUp)
  })

  onDestroy(() => {
    clearScrollInterval()
  })

  function updatePaneRect() {
    if (paneEl) paneRect = paneEl.getBoundingClientRect()
  }

  function clearScrollInterval() {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = undefined
      scrollZones = null
    }
  }

  function handlePointerMove(e: MouseEvent) {
    if (!paneEl) return
    if (!paneRect) updatePaneRect()
    if (!paneRect) return

    const localX = Math.round(e.clientX - paneRect.left)
    const localY = Math.round(e.clientY - paneRect.top)
    viewPos.set({ x: Math.max(localX, 0), y: Math.max(localY, 0) })

    const v = get(view)
    if (v.moveStep && !v.dragging) {
      view.update(s => ({ ...s, dragging: true }))
    }

    if (v.dragging && v.moveStep) {
      const vp = getViewport()
      const scale = vp?.zoom || 1
      if (scale !== v.scale) {
        view.update(s => ({ ...s, scale }))
      }

      const adjustedX = (e.clientX - paneRect.left - v.moveStep.offsetX) / scale
      const adjustedY = (e.clientY - paneRect.top - v.moveStep.offsetY) / scale
      view.update(s => ({ ...s, dragSpot: { x: adjustedX, y: adjustedY } }))

      // Hover detection over DragZones
      let hovering = false
      const zones = get(view).dropzones
      for (const [dzKey, dz] of Object.entries(zones)) {
        const rect: DOMRect = dz.dims
        if (
          e.clientX < rect.right &&
          e.clientX > rect.left &&
          e.clientY < rect.bottom &&
          e.clientY > rect.top
        ) {
          hovering = true
          view.update(s => ({ ...s, droptarget: dzKey }))
          break
        }
      }
      if (!hovering && get(view).droptarget) {
        view.update(s => ({ ...s, droptarget: null }))
      }

      // Auto-scroll near edges using Svelte Flow viewport
      const buffer = 100
      const rightEdge = paneRect.width - (v.moveStep.w || 0)
      const zonesState = {
        top: localY < buffer,
        bottom: localY > paneRect.height - buffer,
        left: localX < buffer,
        right: localX > rightEdge,
      }
      const anyActive = Object.values(zonesState).some(Boolean)

      if (anyActive) {
        if (!scrollInterval) {
          scrollZones = zonesState
          scrollInterval = setInterval(() => {
            const active = scrollZones || zonesState
            const bump = 30
            const xInterval = active.right ? -bump : active.left ? bump : 0
            const yInterval = active.bottom ? -bump : active.top ? bump : 0

            const current = getViewport()
            if (current) {
              setViewport({
                x: (current.x || 0) + xInterval,
                y: (current.y || 0) + yInterval,
                zoom: current.zoom,
              })
            }
            contentPos.update(s => ({
              scrollX: s.scrollX + xInterval,
              scrollY: s.scrollY + yInterval,
            }))
          }, 30)
        } else {
          scrollZones = zonesState
        }
      } else {
        clearScrollInterval()
      }
    } else {
      clearScrollInterval()
    }
  }

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
    <div
      class="wrapper"
      role="region"
      aria-label="Automation flow viewport"
      bind:this={paneEl}
      on:mousemove={handlePointerMove}
      on:mousedown={updatePaneRect}
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
