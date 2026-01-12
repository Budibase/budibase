<script lang="ts">
  import type { FlowBlockContext, FlowBlockPath } from "@/types/automations"
  import DragZone from "../../DragZone.svelte"
  import FlowItemActions from "../../FlowItemActions.svelte"
  import { EdgeLabel } from "@xyflow/svelte"

  interface Props {
    labelX: number
    labelY: number
    showEdgeActions: boolean
    showEdgeDrop: boolean
    collectBlockExists: boolean
    sourcePathForDrop: FlowBlockPath | undefined
    block: FlowBlockContext | undefined
    handleBranch: () => void
    // Orientation-aware dropzone sizing/offset in LR
    dzWidth: number | undefined
    dzOffsetY?: number
  }

  let {
    labelX,
    labelY,
    showEdgeActions,
    showEdgeDrop,
    collectBlockExists,
    sourcePathForDrop,
    block,
    handleBranch,
    dzWidth,
    dzOffsetY = 0,
  }: Props = $props()
</script>

<EdgeLabel x={labelX} y={labelY + (showEdgeDrop ? dzOffsetY : 0)}>
  {#key `${labelX}-${labelY}-${showEdgeDrop}`}
    <div class="add-item-label nodrag nopan">
      {#if showEdgeDrop && !collectBlockExists}
        <DragZone path={sourcePathForDrop} variant="edge" width={dzWidth} />
      {/if}
      {#if !collectBlockExists}
        {#if showEdgeActions}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div
            class="actions-stack"
            onmousedown={e => e.stopPropagation()}
            onclick={e => e.stopPropagation()}
          >
            <FlowItemActions {block} on:branch={handleBranch} />
          </div>
        {/if}
      {/if}
    </div>
  {/key}
</EdgeLabel>

<style>
  .add-item-label {
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
