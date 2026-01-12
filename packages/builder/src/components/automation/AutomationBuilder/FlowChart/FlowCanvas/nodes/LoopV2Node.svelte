<script lang="ts">
  import {
    Handle,
    Position,
    NodeToolbar,
    type NodeProps,
    type Node,
  } from "@xyflow/svelte"
  import { ActionButton, Icon } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import type { LayoutDirection } from "@budibase/types"
  import type { LoopV2NodeData } from "@/types/automations"
  import FlowItemStatus from "../../FlowItemStatus.svelte"

  type LoopV2Node = Node<LoopV2NodeData>
  let { data }: NodeProps<LoopV2Node> = $props()
  let block = $derived(data.block)
  let direction = $derived((data.direction || "TB") as LayoutDirection)
  let isHorizontal = $derived(direction === "LR")
  let selected = $derived($automationStore.selectedNodeId === block?.id)
  let loopChildCount = $derived(
    Array.isArray(block?.inputs?.children) ? block.inputs.children.length : 0
  )
  let viewMode = $derived($automationStore.viewMode)

  const addStep = () => {
    // Provide a marker so the side panel knows we're inserting inside the loop subflow
    automationStore.actions.openActionPanel({
      id: block.id,
      pathTo: $selectedAutomation?.blockRefs?.[block.id]?.pathTo,
      insertIntoLoopV2: true,
      loopStepId: block.id,
      loopChildInsertIndex: loopChildCount,
    })
  }

  const selectNode = async () => {
    if (block?.id) {
      await automationStore.actions.selectNode(block.id)
    }
  }
</script>

<Handle
  isConnectable={false}
  class="custom-handle"
  type="target"
  position={isHorizontal ? Position.Left : Position.Top}
/>

<Handle
  isConnectable={true}
  class="custom-handle source-handle"
  type="source"
  position={isHorizontal ? Position.Right : Position.Bottom}
/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="loop-wrapper">
  <div class="loop-status">
    <FlowItemStatus {block} branch={undefined} hideStatus={false} {viewMode} />
  </div>
  <div
    onclick={e => { e.stopPropagation(); selectNode() }}
    class="loop-container"
    class:selected
  >
    <div class="loop-header">
      <div class="loop-icon-wrapper">
        <Icon name="Reuse" size="S" />
      </div>
      <span class="loop-label">Loop</span>
    </div>

    <NodeToolbar
      isVisible={loopChildCount === 0}
      position={isHorizontal ? Position.Top : Position.Top}
    >
      <ActionButton icon="plus-circle" on:click={addStep}>Add step</ActionButton
      >
    </NodeToolbar>
  </div>
</div>

<style>
  .loop-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .loop-status {
    pointer-events: none;
    width: 100%;
    position: absolute;
    top: -35px;
    left: 0;
    z-index: 10;
  }

  .loop-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .loop-container.selected {
    border-color: var(--spectrum-global-color-blue-700);
    transition: border 130ms ease-out;
  }

  .loop-header {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    z-index: 10;
  }

  .loop-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
  }

  .loop-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.2px;
  }

  :global(.svelte-flow__node-loop-subflow-node) {
    background: rgba(255, 255, 255, 0.01) !important;
    border: 1.5px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    transition: all 0.2s ease !important;
  }

  :global(.svelte-flow__node-loop-subflow-node:has(.loop-container.selected)) {
    border-color: var(--spectrum-global-color-blue-700) !important;
  }

  :global(.svelte-flow__node-loop-subflow-node:hover) {
    border-color: rgba(255, 255, 255, 0.15) !important;
    background: rgba(255, 255, 255, 0.02) !important;
  }

  :global(.svelte-flow__node-loop-subflow-node::before) {
    border-radius: 14px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04),
      rgba(255, 255, 255, 0.02)
    );
    pointer-events: none;
    opacity: 0.3;
  }
</style>
