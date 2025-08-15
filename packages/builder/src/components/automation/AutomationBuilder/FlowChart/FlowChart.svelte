<script lang="ts">
  import { onMount } from "svelte"
  import { writable, get } from "svelte/store"
  import dayjs from "dayjs"
  import {
    notifications,
    Modal,
    Toggle,
    Body,
    Button,
    ActionButton,
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
  import { environment } from "@/stores/portal"
  import { ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    enrichLog,
  } from "./AutomationStepHelpers"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"

  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import Count from "../../SetupPanel/Count.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import StepNode from "./StepNode.svelte"
  import CtaNotification from "@/components/common/CtaNotification.svelte"
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
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import {
    AutomationStatus,
    type AutomationStep,
    AutomationActionStepId,
    type Branch,
  } from "@budibase/types"
  export let automation

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
  let viewMode = ViewMode.EDITOR

  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])

  $: updateGraph(blocks as any)

  $: $automationStore.showTestModal === true && testDataModal.show()

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: $memoAutomation && refresh()

  $: blocks = getBlocksHelper($memoAutomation, viewMode)
    .filter(x => x.stepId !== ActionStepID.LOOP)
    .map((block, idx) => ({ ...block, __top: idx }))
  $: isRowAction = sdk.automations.isRowAction($memoAutomation)

  const handleNodeDrag = (event: CustomEvent) => {
    const { targetNode } = event.detail
    if (targetNode) {
      nodes.update(n => {
        return n.map(node => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              position: targetNode.position,
            }
          }
          return node
        })
      })
    }
  }

  function updateGraph(blocks: AutomationStep[]) {
    const prevNodes = get(nodes)
    const byId = new Map(prevNodes.map(n => [n.id, n]))

    const xSpacing = 400
    const ySpacing = 300

    const newNodes: FlowNode[] = []
    const newEdges: FlowEdge[] = []

    // helper to get or create position
    const ensurePosition = (id: string, fallback: { x: number; y: number }) => {
      const existing = byId.get(id)
      return existing?.position ?? fallback
    }

    // Build linear chain of top-level steps first
    let currentY = 0
    blocks.forEach((block, idx) => {
      const baseId = block.id
      const pos = ensurePosition(baseId, { x: 0, y: idx * ySpacing })

      const isBranchStep =
        (block as any)?.stepId === AutomationActionStepId.BRANCH

      if (!isBranchStep) {
        newNodes.push({
          id: baseId,
          type: "step-node",
          data: { testDataModal, block, isTopLevel: true },
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
          data: { block: blocks[idx - 1] },
        })
      }

      // Branch fan-out
      if (isBranchStep) {
        const branches: Branch[] = ((block as any)?.inputs?.branches ||
          []) as Branch[]
        const children: Record<string, AutomationStep[]> =
          (block as any)?.inputs?.children || {}

        const branchRowY = pos.y + ySpacing
        const sourceForBranches = idx > 0 ? blocks[idx - 1].id : baseId
        const sourceBlock = idx > 0 ? blocks[idx - 1] : block
        branches.forEach((branch: Branch, bIdx: number) => {
          const branchNodeId = `branch-${baseId}-${branch.id}`
          const branchX = pos.x + (bIdx - (branches.length - 1) / 2) * xSpacing
          const branchPos = ensurePosition(branchNodeId, {
            x: branchX,
            y: branchRowY,
          })

          newNodes.push({
            id: branchNodeId,
            type: "branch-node",
            data: { block, branch, branchIdx: bIdx },
            position: branchPos,
          })

          newEdges.push({
            id: `edge-${sourceForBranches}-${branchNodeId}`,
            type: "add-item",
            source: sourceForBranches,
            target: branchNodeId,
            data: { block: sourceBlock },
          })

          // Children inside branch
          const childSteps: AutomationStep[] = children?.[branch.id] || []
          let lastNodeId = branchNodeId
          let lastNodeBlock: any = {
            branchNode: true,
            pathTo: (blockRefs[baseId]?.pathTo || []).concat({
              branchIdx: bIdx,
              branchStepId: baseId,
            }),
          }

          childSteps.forEach((child, cIdx) => {
            const childId = child.id
            const childPos = ensurePosition(childId, {
              x: branchX,
              y: branchRowY + (cIdx + 1) * ySpacing,
            })
            newNodes.push({
              id: childId,
              type: "step-node",
              data: { testDataModal, block: child },
              position: childPos,
            })

            newEdges.push({
              id: `edge-${lastNodeId}-${childId}`,
              type: "add-item",
              source: lastNodeId,
              target: childId,
              data: { block: lastNodeBlock },
            })

            lastNodeId = childId
            lastNodeBlock = child
          })

          // Terminate branch visually: add anchor node so we can show the add-item affordance after last child
          const anchorId = `anchor-${branchNodeId}`
          const anchorPos = ensurePosition(anchorId, {
            x: branchX,
            y: branchRowY + (childSteps.length + 1) * ySpacing,
          })
          newNodes.push({
            id: anchorId,
            type: "anchor-node",
            data: {},
            position: anchorPos,
          })

          newEdges.push({
            id: `edge-${lastNodeId}-${anchorId}`,
            type: "add-item",
            source: lastNodeId,
            target: anchorId,
            data: { block: lastNodeBlock },
          })
        })
        currentY = Math.max(currentY, branchRowY + ySpacing)
      }
    })

    nodes.set(newNodes)
    edges.set(newEdges)
  }
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
        status: AutomationStatus.ERROR,
        startDate: dayjs().subtract(1, "day").toISOString(),
      })
      prodErrors = response?.data?.length || 0
    } catch (error) {
      console.log(error)
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
      automationStore.actions.selectNode(undefined)
    }
  }

  function closeAllPanels() {
    automationStore.actions.closeLogsPanel()
    automationStore.actions.closeLogPanel()
    viewMode = ViewMode.EDITOR
  }

  function handleStepSelect(stepData: any) {
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
</script>

<div class="automation-heading">
  <div class="actions-left">
    <div class="automation-name">
      <Body size="S" weight="500" color="var(--spectrum-global-color-gray-900)">
        {automation.name}
      </Body>
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
            closeAllPanels()
          }}
        >
          Editor
        </ActionButton>
        <Count
          count={prodErrors}
          tooltip={"There are errors in production"}
          hoverable={false}
        >
          <ActionButton
            icon="list-checks"
            quiet
            selected={viewMode === ViewMode.LOGS ||
              $automationStore.showLogsPanel ||
              $automationStore.showLogDetailsPanel}
            on:click={() => {
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
          >
            Logs
          </ActionButton>
        </Count>
      </div>
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

    {#if !isRowAction}
      <div class="toggle-active setting-spacing">
        <Toggle
          text={automation.disabled ? "Disabled" : "Enabled"}
          on:change={() => {
            automationStore.actions.toggleDisabled(
              automation._id,
              automation.disabled
            )
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
    <div class="wrapper">
      <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        {edgeTypes}
        fitView
        colorMode="dark"
        on:nodedrag={handleNodeDrag}
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

  .canvas-footer-left {
    position: absolute;
    left: var(--spacing-xl);
    bottom: var(--spacing-l);
    display: flex;
    gap: var(--spacing-l);
  }

  .view-mode-toggle {
    display: flex;
    gap: var(--spacing-l);
    flex-shrink: 0;
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
