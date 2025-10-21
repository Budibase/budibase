<script lang="ts">
  import { EdgeLabelRenderer } from "@xyflow/svelte"
  import type { ViewMode } from "@/types/automations"
  import {
    type BranchEdgeData,
    type FlowBlockContext,
    type FlowBlockPath,
  } from "@/types/automations"
  import DragZone from "../../DragZone.svelte"
  import FlowItemActions from "../../FlowItemActions.svelte"

  export let data: BranchEdgeData
  export let labelX: number
  export let labelY: number
  export let preBranchLabelX: number
  export let preBranchLabelY: number
  export let showEdgeActions: boolean
  export let showEdgeDrop: boolean
  export let showPreBranchActions: boolean
  export let showPreBranchDrop: boolean
  export let collectBlockExists: boolean
  export let sourcePathForDrop: FlowBlockPath | undefined
  export let block: FlowBlockContext | undefined
  export let handleBranch: () => void
  export let handleAddBranch: () => void
  export let viewMode: ViewMode
  export let isPrimaryBranchEdge: boolean
  // LR layout sizing/offsets
  export let edgeDzWidth: number | undefined
  export let edgeDzOffsetY: number = 0
  export let preDzWidth: number | undefined
  export let preDzOffsetY: number = 0
</script>

<!-- Standard edge label (between steps) -->
<EdgeLabelRenderer>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#key `${labelX}-${labelY}-${showEdgeDrop}`}
    <div
      class="add-item-label nodrag nopan"
      style="transform:translate(-50%, -50%) translate({labelX}px,{labelY +
        (showEdgeDrop ? edgeDzOffsetY : 0)}px);"
    >
      {#if showEdgeDrop && !collectBlockExists}
        <DragZone path={sourcePathForDrop} variant="edge" width={edgeDzWidth} />
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

<!-- Pre-branch label (above branch fan-out on primary branch edge) -->
{#if !collectBlockExists && (showPreBranchActions || showPreBranchDrop)}
  <EdgeLabelRenderer>
    {#key `${preBranchLabelX}-${preBranchLabelY}-${showPreBranchDrop}`}
      <div
        class="add-item-label nodrag nopan"
        style="transform:translate(-50%, -50%) translate({preBranchLabelX}px,{preBranchLabelY +
          (showPreBranchDrop ? preDzOffsetY : 0)}px);"
      >
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
  </EdgeLabelRenderer>
{/if}

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
