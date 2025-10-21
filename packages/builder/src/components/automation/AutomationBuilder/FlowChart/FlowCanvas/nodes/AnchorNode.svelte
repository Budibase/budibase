<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  import type { LayoutDirection } from "@budibase/types"
  import type { AnchorNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"

  export let data: AnchorNodeData
  $: direction = (data.direction || "TB") as LayoutDirection
  $: isHorizontal = direction === "LR"
</script>

<div class="anchor" style={isHorizontal ? "width:1px" : undefined}>
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
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
</style>
