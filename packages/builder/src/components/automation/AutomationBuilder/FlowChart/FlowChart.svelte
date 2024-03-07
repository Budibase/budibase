<script>
  import { automationStore, automationHistoryStore } from "stores/builder"
  import FlowItem from "./FlowItem.svelte"
  import TestDataModal from "./TestDataModal.svelte"
  import { Icon, Modal } from "@budibase/bbui"
  import { ActionStepID } from "constants/backend/automations"
  import UndoRedoControl from "components/common/UndoRedoControl.svelte"
  import { writable, get } from "svelte/store"
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
  } from "@xyflow/svelte"
  import "@xyflow/svelte/dist/style.css"
  import AddItemEdge from "components/automation/AutomationBuilder/FlowChart/AddItemEdge.svelte"

  export let automation

  const snapGrid = [25, 25]
  const nodeTypes = {
    "flow-item": FlowItem,
  }
  const edgeTypes = {
    "add-item": AddItemEdge,
  }

  let testDataModal
  let scrolling = false
  let nodes = writable([])
  let edges = writable([])

  $: updateNodes(automation)
  $: updateEdges($nodes)

  const updateNodes = automation => {
    const currentNodes = get(nodes)
    const blocks = getBlocks(automation).filter(
      x => x.stepId !== ActionStepID.LOOP
    )

    let newNodes = []
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
        type: "flow-item",
        data: { testDataModal, block },
        position,
      })
    })

    nodes.set(newNodes)
  }

  const updateEdges = nodes => {
    let newEdges = []
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

  const getBlocks = automation => {
    let blocks = []
    if (automation.definition.trigger) {
      blocks.push(automation.definition.trigger)
    }
    blocks = blocks.concat(automation.definition.steps || [])
    return blocks
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper">
  <SvelteFlow
    {nodes}
    {nodeTypes}
    {edges}
    {edgeTypes}
    {snapGrid}
    fitView
    colorMode="dark"
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>

  <div class="header" class:scrolling>
    <div class="header-left">
      <UndoRedoControl store={automationHistoryStore} />
    </div>
    <div class="controls">
      <div
        on:click={() => {
          testDataModal.show()
        }}
        class="buttons"
      >
        <Icon size="M" name="Play" />
        <div>Run test</div>
      </div>
      <div class="buttons">
        <Icon
          disabled={!$automationStore.testResults}
          size="M"
          name="Multiple"
        />
        <div
          class:disabled={!$automationStore.testResults}
          on:click={() => {
            $automationStore.showTestPanel = true
          }}
        >
          Test details
        </div>
      </div>
    </div>
  </div>
</div>

<Modal bind:this={testDataModal} width="30%">
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
  .wrapper :global(.svelte-flow__minimap-svg) {
    background: var(--spectrum-global-color-gray-50);
  }

  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 2 * var(--spacing-l));
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--background);
    padding: 0 var(--spacing-l);
    height: 48px;
    border-bottom: var(--border-light);
  }
  .header-left :global(div) {
    border-right: none;
  }
  .controls {
    display: flex;
    gap: var(--spacing-xl);
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-s);
  }
  .buttons:hover {
    cursor: pointer;
  }

  .disabled {
    pointer-events: none;
    color: var(--spectrum-global-color-gray-500) !important;
  }
</style>
