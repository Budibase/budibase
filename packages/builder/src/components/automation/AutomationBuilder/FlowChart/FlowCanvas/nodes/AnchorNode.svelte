<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  import { Handle, Position } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  const layoutDirection = getContext<Writable<"LR" | "TB">>(
    "flowLayoutDirection"
  )

  $: targetPosition = $layoutDirection === "TB" ? Position.Top : Position.Left
</script>

<div class="anchor" class:vertical={$layoutDirection === "TB"}>
  <Handle
    class="custom-handle"
    type="target"
    isConnectable={false}
    position={targetPosition}
  />
</div>

<style>
  .anchor {
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .anchor.vertical {
    width: 320px;
  }
</style>
