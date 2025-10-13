<script lang="ts">
  import { EdgeLabelRenderer } from "@xyflow/svelte"
  import type { FlowBlockContext, FlowBlockPath } from "@/types/automations"
  import DragZone from "../../DragZone.svelte"
  import FlowItemActions from "../../FlowItemActions.svelte"

  export let labelX: number
  export let labelY: number
  export let showEdgeActions: boolean
  export let showEdgeDrop: boolean
  export let collectBlockExists: boolean
  export let sourcePathForDrop: FlowBlockPath | undefined
  export let block: FlowBlockContext | undefined
  export let handleBranch: () => void
  // Orientation-aware dropzone sizing/offset in LR
  export let dzWidth: number | undefined
  export let dzOffsetY: number = 0
</script>

<EdgeLabelRenderer>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#key `${labelX}-${labelY}-${showEdgeDrop}`}
    <div
      class="add-item-label nodrag nopan"
      style="transform:translate(-50%, -50%) translate({labelX}px,{labelY +
        (showEdgeDrop ? dzOffsetY : 0)}px);"
    >
      {#if showEdgeDrop && !collectBlockExists}
        <DragZone path={sourcePathForDrop} variant="edge" width={dzWidth} />
      {/if}
      {#if !collectBlockExists}
        {#if showEdgeActions}
          <div
            class="actions-stack"
            on:mousedown|stopPropagation
            on:click|stopPropagation
          >
            <FlowItemActions {block} on:branch={handleBranch} />
          </div>
        {/if}
      {/if}
    </div>
  {/key}
</EdgeLabelRenderer>

<style>
  .add-item-label {
    position: absolute;
    color: white;
    pointer-events: all;
    cursor: default;
  }
  .actions-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    pointer-events: all;
  }
</style>
