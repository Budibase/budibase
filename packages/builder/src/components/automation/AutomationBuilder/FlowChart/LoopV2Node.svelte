<script lang="ts">
  import { Handle, Position, NodeToolbar } from "@xyflow/svelte"
  import { ActionButton } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import type { LayoutDirection } from "@budibase/types"

  export let data: any
  $: block = data?.block
  $: direction = (data?.direction || "TB") as LayoutDirection
  $: isHorizontal = direction === "LR"
  $: _selected = $automationStore.selectedNodeId === block?.id
  $: loopChildCount = Array.isArray(block?.inputs?.children)
    ? block.inputs.children.length
    : 0

  const addStep = () => {
    // Provide a marker so the side panel knows we're inserting inside the loop subflow
    automationStore.actions.openActionPanel({
      id: block.id,
      pathTo: $selectedAutomation?.blockRefs?.[block.id]?.pathTo,
      loopV2Children: true,
      loopStepId: block.id,
      loopChildInsertIndex: loopChildCount,
    })
  }

  const _selectSelf = async () => {
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
  isConnectable={false}
  class="custom-handle"
  type="source"
  position={isHorizontal ? Position.Right : Position.Bottom}
/>
<div style="height: 100px;">
  <NodeToolbar position={isHorizontal ? Position.Top : Position.Top}>
    <ActionButton icon="plus-circle" on:click={addStep}>Add step</ActionButton>
  </NodeToolbar>
</div>

<style>
  /* no explicit header; subflow should be minimal */

  :global(.svelte-flow__node-loop-subflow-node) {
    border: 1px dashed var(--grey-3) !important;
    border-radius: 20px !important;
  }
</style>
