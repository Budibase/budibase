<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  import { Handle, Position } from "@xyflow/svelte"
  export let id
  export let data
</script>

<div class="anchor">
  <Handle type="target" position={Position.Top} />
</div>

<style>
  .anchor {
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
</style>
