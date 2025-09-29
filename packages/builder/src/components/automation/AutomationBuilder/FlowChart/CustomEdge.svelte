<script lang="ts">
  import {
    getSmoothStepPath,
    EdgeLabelRenderer,
    BaseEdge,
    getStraightPath,
    useSvelteFlow,
    type Position,
  } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import { ActionButton } from "@budibase/bbui"
  import { type LayoutDirection } from "@budibase/types"
  import { ActionStepID } from "@/constants/backend/automations"
  import { ViewMode } from "@/types/automations"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import DragZone from "./DragZone.svelte"
  import FlowItemActions from "./FlowItemActions.svelte"
  import type { DragView } from "./FlowChartDnD"

  export let data: any = undefined
  export let sourceX: number
  export let sourceY: number
  export let targetX: number
  export let targetY: number
  export let sourcePosition: Position
  export let targetPosition: Position
  export let target: string

  $: viewMode = $automationStore.viewMode as ViewMode
  $: block = data?.block
  $: direction = (data?.direction || "TB") as LayoutDirection
  $: passedPathTo = data?.pathTo
  $: automation = $selectedAutomation?.data

  const view = getContext<Writable<DragView>>("draggableView")
  const flow = useSvelteFlow()

  $: basePath = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  })
  $: labelX = basePath[1]
  $: labelY = basePath[2]

  $: isBranchTarget = target?.startsWith("branch-")
  $: isAnchorTarget = target?.startsWith("anchor-")
  $: path = isAnchorTarget
    ? getStraightPath({
        sourceX,
        sourceY,
        targetX: labelX,
        targetY: labelY,
      })
    : basePath

  $: blockRef = $selectedAutomation?.blockRefs?.[block?.id]
  $: sourcePathForDrop = passedPathTo
    ? passedPathTo
    : block && block.pathTo
      ? block.pathTo
      : blockRef?.pathTo

  $: collectBlockExists =
    viewMode === ViewMode.EDITOR && blockRef && $selectedAutomation?.data
      ? automationStore.actions
          .getPathSteps(blockRef.pathTo, $selectedAutomation.data)
          .some(step => step.stepId === ActionStepID.COLLECT)
      : false
  $: hideEdge = viewMode === ViewMode.EDITOR && collectBlockExists
  $: isPrimaryBranchEdge = data?.isBranchEdge && data?.isPrimaryEdge

  $: showEdgeActions =
    viewMode === ViewMode.EDITOR && !isBranchTarget && !$view?.dragging

  $: showEdgeDrop =
    viewMode === ViewMode.EDITOR && !isBranchTarget && $view?.dragging

  $: showPreBranchActions =
    viewMode === ViewMode.EDITOR &&
    isBranchTarget &&
    isPrimaryBranchEdge &&
    !$view?.dragging

  $: showPreBranchDrop =
    viewMode === ViewMode.EDITOR &&
    isBranchTarget &&
    isPrimaryBranchEdge &&
    $view?.dragging

  // For TB we keep it vertically centered under the source;
  // for LR we center horizontally and align to the source Y.
  $: preBranchLabelX =
    direction === "LR"
      ? Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
      : (sourceX ?? 0)
  $: preBranchLabelY =
    direction === "LR"
      ? (sourceY ?? 0)
      : Math.round(((sourceY ?? 0) + (targetY ?? 0)) / 2 - 20)

  const handleBranch = () => {
    const explicitTargetRef =
      isBranchTarget && data?.branchStepId
        ? $selectedAutomation?.blockRefs?.[data.branchStepId]
        : null
    const targetPath = explicitTargetRef?.pathTo || blockRef?.pathTo
    if (targetPath && automation) {
      automationStore.actions.branchAutomation(targetPath, automation)
    }
  }

  const handleAddBranch = () => {
    const targetRef = $selectedAutomation?.blockRefs?.[data.branchStepId]
    if (targetRef && automation) {
      automationStore.actions.branchAutomation(targetRef.pathTo, automation)
    }
    flow.fitView()
  }
</script>

{#if !hideEdge}
  <BaseEdge path={path[0]} />
{/if}
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

<!-- Render the Actions / dropzone above the branch fan-out on the primary branch edge -->
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
          {#if $selectedAutomation?.blockRefs?.[data?.branchStepId]}
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
    z-index: 123;
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
