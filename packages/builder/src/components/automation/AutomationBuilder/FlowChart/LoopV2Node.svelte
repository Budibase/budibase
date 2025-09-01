<script lang="ts">
  import { Handle, Position, NodeToolbar } from "@xyflow/svelte"
  import { ActionButton } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import type { LayoutDirection } from "@budibase/types"

  export let data: any
  $: console.log(data)
  $: block = data?.block
  $: direction = (data?.direction || "TB") as LayoutDirection
  $: isHorizontal = direction === "LR"
  $: selected = $automationStore.selectedNodeId === block?.id

  const addStep = () => {
    // Provide a marker so the side panel knows we're inserting inside the loop subflow
    automationStore.actions.openActionPanel({
      id: block.id,
      pathTo: $selectedAutomation?.blockRefs?.[block.id]?.pathTo,
      loopV2Children: true,
    } as any)
  }

  const selectSelf = async () => {
    if (block?.id) {
      await automationStore.actions.selectNode(block.id)
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  style="width:{data.containerWidth}px; height:{data.containerHeight}px;"
  class="loop-container"
  class:selected
  on:click|self={selectSelf}
>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="target"
    position={isHorizontal ? Position.Left : Position.Top}
  />

  <div class="loop-box" on:click|self={selectSelf}>
    <!-- children rendered via parentNode -->
  </div>

  <Handle
    isConnectable={false}
    class="custom-handle"
    type="source"
    position={isHorizontal ? Position.Right : Position.Bottom}
  />
  <div style="height: 100px;">
    <NodeToolbar position={isHorizontal ? Position.Top : Position.Top}>
      <ActionButton icon="plus-circle" on:click={addStep}>Add step</ActionButton
      >
    </NodeToolbar>
  </div>
</div>

<style>
  .loop-container {
    position: relative;
    border-radius: 8px;
    cursor: pointer;
  }
  .loop-container.selected {
    border-color: var(--spectrum-global-color-blue-700);
    box-shadow: 0 0 0 1px var(--spectrum-global-color-blue-700);
  }
  .loop-box {
    border-radius: 12px;
    box-sizing: border-box;
    position: absolute;
    inset: 0;
  }
  /* no explicit header; subflow should be minimal */

  :global(.svelte-flow__node-loop-subflow-node) {
    border: 1px solid #9e86ed !important;
  }
</style>
