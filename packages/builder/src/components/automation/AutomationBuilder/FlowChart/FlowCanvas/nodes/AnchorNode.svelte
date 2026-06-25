<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte"
  import type { AnchorNodeData } from "@/types/automations"

  export let data: AnchorNodeData = {}
  export let targetPosition: Position = Position.Left

  $: isVertical =
    targetPosition === Position.Top || targetPosition === Position.Bottom
  $: isJunction = data.variant === "junction"
</script>

<div class="anchor" class:vertical={isVertical} class:junction={isJunction}>
  <Handle
    class="custom-handle"
    type="target"
    isConnectable={false}
    position={targetPosition}
  />
  {#if isJunction}
    <Handle
      class="custom-handle"
      type="source"
      isConnectable={false}
      position={targetPosition}
    />
  {/if}
</div>

<style>
  .anchor {
    width: 320px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
  .anchor.vertical {
    width: 1px;
    height: 320px;
  }
  .anchor.junction {
    width: 1px;
    height: 1px;
  }
</style>
