<script lang="ts">
  import {
    getSmoothStepPath,
    EdgeLabelRenderer,
    BaseEdge,
    getStraightPath,
  } from "@xyflow/svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import FlowItemActions from "./FlowItemActions.svelte"
  import DragZone from "./DragZone.svelte"
  import { ActionButton } from "@budibase/bbui"
  import { ActionStepID } from "@/constants/backend/automations"
  import { ViewMode } from "@/types/automations"
  import { getContext } from "svelte"

  export let target: string | undefined = undefined

  $: viewMode = $$props.data.viewMode
  $: block = $$props.data?.block
  $: direction = ($$props.data?.direction || "TB") as "TB" | "LR"
  $: automation = $selectedAutomation?.data

  // DnD view store (used to know when to show dropzones)
  const view: any = getContext("draggableView")

  // full path to compute label position
  $: basePath = getSmoothStepPath({
    ...(($$props as any) || {}),
    borderRadius: 12,
  })
  $: labelX = basePath[1]
  $: labelY = basePath[2]

  $: edgeTarget = target ?? $$props.target
  $: isBranchTarget = edgeTarget?.startsWith("branch-")
  $: path = edgeTarget.startsWith("anchor-")
    ? getStraightPath({
        ...(($$props as any) || {}),
        borderRadius: 12,
        targetX: labelX,
        targetY: labelY,
      })
    : basePath

  // The path to the source step for this edge. For normal edges, look up by
  // block id; for branch entry edges we carry a synthetic branch block ref with
  // a `pathTo` we can use directly.
  $: blockRefs = $selectedAutomation?.blockRefs?.[block?.id]
  $: sourcePathForDrop =
    block && (block as any).pathTo ? (block as any).pathTo : blockRefs?.pathTo
  $: pathSteps =
    blockRefs && automation
      ? automationStore.actions.getPathSteps(blockRefs.pathTo, automation)
      : []

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  // When a collect step exists in the path, no further blocks are allowed.
  // In editor mode we should not render the visual edge in this case.
  $: hideEdge = viewMode === ViewMode.EDITOR && collectBlockExists
  $: isPrimaryBranchEdge =
    $$props.data?.isBranchEdge && $$props.data?.isPrimaryEdge

  // Show action buttons only when not dragging
  $: showEdgeActions =
    viewMode === ViewMode.EDITOR && !isBranchTarget && !$view?.dragging
  // Show the dropzone when dragging over a normal edge
  $: showEdgeDrop =
    viewMode === ViewMode.EDITOR && !isBranchTarget && $view?.dragging

  $: showPreBranchActions =
    viewMode === ViewMode.EDITOR &&
    isBranchTarget &&
    isPrimaryBranchEdge &&
    !$view?.dragging

  // Show a dropzone before branch fan-out when dragging
  $: showPreBranchDrop =
    viewMode === ViewMode.EDITOR &&
    isBranchTarget &&
    isPrimaryBranchEdge &&
    $view?.dragging

  // Place pre-branch controls/dropzone centred between source and branch row
  // depending on layout direction. For TB we keep it vertically centred under
  // the source; for LR we centre horizontally and align to the source Y.
  $: preBranchLabelX =
    direction === "LR"
      ? Math.round((($$props.sourceX ?? 0) + ($$props.targetX ?? 0)) / 2)
      : ($$props.sourceX ?? 0)
  $: preBranchLabelY =
    direction === "LR"
      ? ($$props.sourceY ?? 0)
      : Math.round((($$props.sourceY ?? 0) + ($$props.targetY ?? 0)) / 2 - 20)
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
          <FlowItemActions
            {block}
            on:branch={() => {
              const explicitTargetRef =
                isBranchTarget && $$props.data?.branchStepId
                  ? $selectedAutomation?.blockRefs?.[$$props.data.branchStepId]
                  : null
              const targetPath = explicitTargetRef?.pathTo || blockRefs?.pathTo
              if (targetPath && automation) {
                automationStore.actions.branchAutomation(targetPath, automation)
              }
            }}
          />
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
          {#if $selectedAutomation?.blockRefs?.[$$props.data?.branchStepId]}
            <div class="branch-controls">
              <ActionButton
                icon="plus-circle"
                disabled={viewMode === ViewMode.LOGS}
                on:click={() => {
                  const targetRef =
                    $selectedAutomation.blockRefs[$$props.data.branchStepId]
                  if (targetRef && automation) {
                    automationStore.actions.branchAutomation(
                      targetRef.pathTo,
                      automation
                    )
                  }
                }}
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
