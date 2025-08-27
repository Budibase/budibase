<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  import { Handle, Position } from "@xyflow/svelte"

  export let data: { direction?: "TB" | "LR" } | undefined
  $: direction = (data?.direction || "TB") as "TB" | "LR"
  $: isHorizontal = direction === "LR"
</script>

<div class="anchor">
  <Handle
    class="custom-handle"
    type="target"
    isConnectable={false}
    position={isHorizontal ? Position.Left : Position.Top}
  />
</div>

<style>
  .anchor {
    width: 320px;
    height: 320px;
    opacity: 0;
    pointer-events: none;
  }
</style>
