<script lang="ts">
  import { EdgeLabelRenderer } from "@xyflow/svelte"
  import { ActionButton } from "@budibase/bbui"
  import { selectedAutomation } from "@/stores/builder"
  import {
    ViewMode,
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
</script>

<!-- Standard edge label (between steps) -->
<EdgeLabelRenderer>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="add-item-label nodrag nopan"
    style="transform:translate(-50%, -50%) translate({labelX}px,{labelY}px);"
  >
    {#if showEdgeDrop && !collectBlockExists}
      <DragZone path={sourcePathForDrop} variant="edge" />
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
</EdgeLabelRenderer>

<!-- Pre-branch label (above branch fan-out on primary branch edge) -->
{#if !collectBlockExists && (showPreBranchActions || showPreBranchDrop)}
  <EdgeLabelRenderer>
    <div
      class="add-item-label nodrag nopan"
      style="transform:translate(-50%, -50%) translate({preBranchLabelX}px,{preBranchLabelY}px);"
    >
      {#if showPreBranchDrop}
        <DragZone path={sourcePathForDrop} variant="edge" />
      {/if}
      <div class="actions-stack">
        <FlowItemActions {block} hideBranch />

        {#if isPrimaryBranchEdge}
          {#if $selectedAutomation?.blockRefs?.[data.branchStepId]}
            <div class="branch-controls">
              <ActionButton
                icon="plus-circle"
                disabled={viewMode === ViewMode.LOGS}
                on:click={handleAddBranch}
              >
                Add branch
              </ActionButton>
            </div>
          {/if}
        {/if}
      </div>
    </div>
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
  .branch-controls :global(.spectrum-ActionButton) {
    margin-top: 4px;
    cursor: pointer;
  }
</style>
