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
  } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { ViewMode } from "@/types/automations"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    getBlocks as getBlocksHelper,
    enrichLog,
  } from "./AutomationStepHelpers"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import Count from "../../SetupPanel/Count.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import NodeWrapper from "./NodeWrapper.svelte"
  import EdgeWrapper from "./EdgeWrapper.svelte"
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
  import { AutomationStatus, type AutomationStep } from "@budibase/types"

  export let automation

  const memoAutomation = memo(automation)

  const nodeTypes: NodeTypes = {
    "step-node": NodeWrapper as any,
  }
  const edgeTypes: EdgeTypes = {
    "add-item": EdgeWrapper as any,
  }

  let testDataModal: Modal
  let confirmDeleteDialog
  let scrolling = false
  let blockRefs: Record<string, any> = {}
  let treeEle
  let draggable
  let prodErrors: number
  let viewMode = ViewMode.EDITOR

  let nodes = writable<FlowNode[]>([])
  let edges = writable<FlowEdge[]>([])

  $: updateNodes(blocks as any)
  $: updateEdges($nodes)

  $: $automationStore.showTestModal === true && testDataModal.show()

  // Memo auto - selectedAutomation
  $: memoAutomation.set(automation)

  // Parse the automation tree state
  $: $memoAutomation && refresh()

  $: blocks = getBlocksHelper($memoAutomation, viewMode).filter(
    x => x.stepId !== ActionStepID.LOOP
  )
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

  const handleNodeDragStop = (event: CustomEvent) => {
    const { targetNode } = event.detail
    if (!targetNode) return

    const currentNodes = get(nodes)
    const draggedNodeIndex = currentNodes.findIndex(n => n.id === targetNode.id)

    // Calculate which position the node was dropped into based on Y position
    let newIndex = currentNodes.findIndex(node => {
      if (node.id === targetNode.id) return false
      // Check if the dragged node's Y position is before this node
      return targetNode.position.y < node.position.y
    })

    // If no node found after it, it means it's at the end
    if (newIndex === -1) {
      newIndex = currentNodes.length - 1
    } else if (newIndex > draggedNodeIndex) {
      // Adjust index if moving down
      newIndex -= 1
    }

    // Only reorder if the position actually changed
    if (newIndex !== draggedNodeIndex && newIndex >= 0) {
      // Reorder blocks array
      const reorderedBlocks = [...blocks]
      const [movedBlock] = reorderedBlocks.splice(draggedNodeIndex, 1)
      reorderedBlocks.splice(newIndex, 0, movedBlock)

      // Get the source and destination paths for the moveBlock function
      const sourceBlock = blockRefs[targetNode.id]
      if (sourceBlock) {
        const sourcePath = sourceBlock.pathTo

        // Determine destination path based on the new position
        let destPath
        if (newIndex === 0) {
          // Moving to the beginning
          const firstBlock = blockRefs[reorderedBlocks[1]?.id]
          if (firstBlock) {
            destPath = [...firstBlock.pathTo]
            destPath[destPath.length - 1] = {
              ...destPath[destPath.length - 1],
              stepIdx: 0,
            }
          }
        } else {
          // Moving after another block
          const prevBlock = blockRefs[reorderedBlocks[newIndex - 1]?.id]
          if (prevBlock) {
            destPath = [...prevBlock.pathTo]
          }
        }

        if (destPath) {
          // Use the automation store's moveBlock function
          automationStore.actions.moveBlock(
            sourcePath,
            destPath,
            $memoAutomation
          )
        }
      }
    } else {
      // Just update the position without reordering
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

  const updateNodes = (blocks: AutomationStep[]) => {
    const currentNodes = get(nodes)
    let newNodes: FlowNode[] = []
    if (blocks.length > 0) {
      blocks.forEach((block, idx) => {
        const existingBlock = currentNodes.find(x => x.id === block.id)
        let position = existingBlock?.position
        if (!position) {
          const prevNode = currentNodes[idx - 1]
          const nextNode = currentNodes[idx]
          if (nextNode) {
            position = {
              x: (prevNode.position.x + nextNode.position.x) / 2,
              y: (prevNode.position.y + nextNode.position.y) / 2,
            }
          } else if (prevNode) {
            position = {
              x: prevNode.position.x,
              y: prevNode.position.y + 400,
            }
          } else {
            position = { x: 0, y: idx * 400 }
          }
        }
        newNodes.push({
          id: block.id,
          type: "step-node",
          data: { testDataModal, block },
          position,
        })
      })
    }
    nodes.set(newNodes)
  }

  const updateEdges = (nodes: FlowNode[]) => {
    let newEdges: FlowEdge[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      newEdges.push({
        id: `${i}-${i + 1}`,
        type: "add-item",
        source: nodes[i].id,
        target: nodes[i + 1].id,
        data: nodes[i].data,
      })
    }
    edges.set(newEdges)
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
  <div class="root" bind:this={treeEle}>
    <div class="wrapper">
      <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        {edgeTypes}
        fitView
        colorMode="dark"
        on:nodedrag={handleNodeDrag}
        on:nodedragstop={handleNodeDragStop}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={25} />
        <MiniMap />
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

  .canvas-heading-left .group :global(.spectrum-Button),
  .canvas-heading-left .group :global(.spectrum-ActionButton),
  .canvas-heading-left .group :global(i) {
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
