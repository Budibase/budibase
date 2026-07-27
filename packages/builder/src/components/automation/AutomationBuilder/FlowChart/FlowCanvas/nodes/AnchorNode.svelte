<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte"

  export let targetPosition: Position = Position.Left

  $: isVertical =
    targetPosition === Position.Top || targetPosition === Position.Bottom
</script>

<div class="anchor" class:vertical={isVertical}>
  <Handle
    class="custom-handle"
    type="target"
    isConnectable={false}
    position={targetPosition}
  />
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
</style>
