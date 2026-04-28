<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  import { Handle, Position } from "@xyflow/svelte"
</script>

<div class="anchor" style={"width:1px"}>
  <Handle
    class="custom-handle"
    type="target"
    isConnectable={false}
    position={Position.Left}
  />
</div>

<style>
  .anchor {
    width: 320px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
</style>
