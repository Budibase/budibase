<script lang="ts">
  import type { ViewMode } from "@/types/automations"
  import {
    type BranchEdgeData,
    type FlowBlockContext,
    type FlowBlockPath,
  } from "@/types/automations"
  import DragZone from "../../DragZone.svelte"
  import FlowItemActions from "../../FlowItemActions.svelte"
  import { EdgeLabel } from "@xyflow/svelte"

  interface Props {
    data: BranchEdgeData
    labelX: number
    labelY: number
    preBranchLabelX: number
    preBranchLabelY: number
    showEdgeActions: boolean
    showEdgeDrop: boolean
    showPreBranchActions: boolean
    showPreBranchDrop: boolean
    collectBlockExists: boolean
    sourcePathForDrop: FlowBlockPath | undefined
    block: FlowBlockContext | undefined
    handleBranch: () => void
    handleAddBranch: () => void
    viewMode: ViewMode
    isPrimaryBranchEdge: boolean
    edgeDzWidth: number | undefined
    edgeDzOffsetY?: number
    preDzWidth: number | undefined
    preDzOffsetY?: number
  }

  let {
    data,
    labelX,
    labelY,
    preBranchLabelX,
    preBranchLabelY,
    showEdgeActions,
    showEdgeDrop,
    showPreBranchActions,
    showPreBranchDrop,
    collectBlockExists,
    sourcePathForDrop,
    block,
    handleBranch,
    handleAddBranch,
    viewMode,
    isPrimaryBranchEdge,
    edgeDzWidth,
    edgeDzOffsetY = 0,
    preDzWidth,
    preDzOffsetY = 0,
  }: Props = $props()
</script>

<!-- Standard edge label (between steps) -->
<EdgeLabel x={labelX} y={labelY + (showEdgeDrop ? edgeDzOffsetY : 0)}>
  {#key `${labelX}-${labelY}-${showEdgeDrop}`}
    <div class="add-item-label nodrag nopan">
      {#if showEdgeDrop && !collectBlockExists}
        <DragZone path={sourcePathForDrop} variant="edge" width={edgeDzWidth} />
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

<!-- Pre-branch label (above branch fan-out on primary branch edge) -->
{#if !collectBlockExists && (showPreBranchActions || showPreBranchDrop)}
  <EdgeLabel
    x={preBranchLabelX}
    y={preBranchLabelY + (showPreBranchDrop ? preDzOffsetY : 0)}
  >
    {#key `${preBranchLabelX}-${preBranchLabelY}-${showPreBranchDrop}`}
      <div class="add-item-label nodrag nopan">
        {#if showPreBranchDrop}
          <DragZone
            path={sourcePathForDrop}
            variant="edge"
            width={preDzWidth}
          />
        {/if}
        <div class="actions-stack">
          <FlowItemActions
            {block}
            hideBranch
            showAddBranch={isPrimaryBranchEdge}
            branchStepId={data.branchStepId}
            {viewMode}
            on:addBranch={handleAddBranch}
          />
        </div>
      </div>
    {/key}
  </EdgeLabel>
{/if}

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
