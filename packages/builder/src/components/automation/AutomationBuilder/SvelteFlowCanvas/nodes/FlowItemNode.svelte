<script>
  import { Handle, Position } from "@xyflow/svelte"
  import FlowItem from "../../FlowChart/FlowItem.svelte"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { ViewMode } from "@/types/automations"
  import { selectedAutomation } from "@/stores/builder"

  export let data
  export let selected = false

  // Create mock context for FlowItem compatibility
  const draggableView = writable({ dragging: false, scale: 1 })
  const viewPos = writable({ x: 0, y: 0 })
  const contentPos = writable({ scrollX: 0, scrollY: 0 })

  setContext("draggableView", draggableView)
  setContext("viewPos", viewPos)
  setContext("contentPos", contentPos)

  // Mock blockRef for FlowItem
  $: blockRef = {
    pathTo: [],
    terminating: false,
  }

  // FlowItem expects the block to have these fields
  $: block = {
    ...data,
    id: data.id,
    name: data.label || data.name,
    stepId: data.stepId,
    type: data.type, // TRIGGER or ACTION
    inputs: data.inputs || {},
  }

  // Use the automation passed through data or fallback to store
  $: automation = data.automation ||
    $selectedAutomation?.data || {
      definition: {
        steps: [],
        trigger: {},
      },
    }
</script>

<div class="flow-item-node" class:selected>
  <!-- Input handle at the top -->
  {#if data.type !== "TRIGGER"}
    <Handle
      type="target"
      position={Position.Top}
      class="flow-handle flow-handle-target"
    />
  {/if}

  <!-- Use the existing FlowItem component -->
  <FlowItem
    {block}
    {blockRef}
    {automation}
    draggable={false}
    viewMode={ViewMode.EDITOR}
    logStepData={null}
    selectedLogStepId={null}
    unexecuted={false}
    onStepSelect={() => {}}
  />

  <!-- Output handle at the bottom -->
  <Handle
    type="source"
    position={Position.Bottom}
    class="flow-handle flow-handle-source"
  />

  <!-- Additional handles for branches -->
  {#if data.stepId === "BRANCH" && data.inputs?.branches}
    {#each data.inputs.branches as branch, i}
      <Handle
        id={`branch-${branch.id}`}
        type="source"
        position={Position.Right}
        style="top: {50 + i * 30}%"
        class="flow-handle flow-handle-branch"
      />
    {/each}
  {/if}
</div>

<style>
  .flow-item-node {
    position: relative;
  }

  .flow-item-node :global(.separator) {
    display: none;
  }

  .flow-item-node :global(.action-bar) {
    display: none;
  }

  :global(.flow-handle) {
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid var(--spectrum-global-color-gray-400);
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  :global(.flow-handle:hover) {
    border-color: var(--spectrum-global-color-blue-400);
    transform: scale(1.1);
  }

  :global(.flow-handle-target) {
    top: -6px;
  }

  :global(.flow-handle-source) {
    bottom: -6px;
  }

  :global(.flow-handle-branch) {
    right: -6px;
  }

  .flow-item-node.selected :global(.flow-handle) {
    border-color: var(--spectrum-global-color-blue-700);
  }
</style>
