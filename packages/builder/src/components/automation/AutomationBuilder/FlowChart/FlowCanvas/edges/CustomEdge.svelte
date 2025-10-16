<script lang="ts">
  import {
    getSmoothStepPath,
    BaseEdge,
    getStraightPath,
    useSvelteFlow,
    type Position,
  } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import { type LayoutDirection } from "@budibase/types"
  import { ActionStepID } from "@/constants/backend/automations"
  import {
    ViewMode,
    type EdgeData,
    type BranchEdgeData,
    type FlowBlockContext,
  } from "@/types/automations"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import StandardEdgeLabel from "./StandardEdgeLabel.svelte"
  import BranchEdgeLabels from "./BranchEdgeLabels.svelte"
  import type { DragView } from "../FlowChartDnD"

  export let data: EdgeData
  export let sourceX: number
  export let sourceY: number
  export let targetX: number
  export let targetY: number
  export let sourcePosition: Position
  export let targetPosition: Position
  export let target: string

  let block: FlowBlockContext | undefined
  $: viewMode = $automationStore.viewMode as ViewMode
  $: block = deriveBlockContext(data)
  $: direction = (data?.direction || "TB") as LayoutDirection
  $: passedPathTo = data?.pathTo
  $: automation = $selectedAutomation?.data

  const view = getContext<Writable<DragView>>("draggableView")
  const flow = useSvelteFlow()

  const deriveBlockContext = (
    edgeData: EdgeData | undefined
  ): FlowBlockContext | undefined => {
    if (edgeData && "loopStepId" in edgeData) {
      const loopChildInsertIndex = edgeData.loopChildInsertIndex
      return {
        ...edgeData.block,
        insertIntoLoopV2: true,
        loopStepId: edgeData.loopStepId,
        ...(loopChildInsertIndex !== undefined ? { loopChildInsertIndex } : {}),
      } as any
    }
    return edgeData?.block
  }

  /*
  Need a type guard here because there can be different properties
  coming in here depending on if it's a branch edge or not.  
  */
  $: isBranchEdgeData = (d: EdgeData): d is BranchEdgeData =>
    "isBranchEdge" in d && d.isBranchEdge === true

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
  $: isSubflowEdge = data.isSubflowEdge === true

  $: if (isAnchorTarget && direction === "LR") {
    labelX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    labelY = sourceY ?? 0
  }

  $: path = isAnchorTarget
    ? getStraightPath({
        sourceX,
        sourceY,
        targetX: labelX,
        targetY: labelY,
      })
    : basePath

  $: blockId = resolveBlockId(data?.block as FlowBlockContext | undefined)
  $: blockRef = blockId ? $selectedAutomation?.blockRefs?.[blockId] : undefined
  $: sourcePathForDrop = passedPathTo || blockRef?.pathTo

  $: collectBlockExists =
    viewMode === ViewMode.EDITOR && blockRef && $selectedAutomation?.data
      ? automationStore.actions
          .getPathSteps(blockRef.pathTo, $selectedAutomation.data)
          .some(step => step.stepId === ActionStepID.COLLECT)
      : false
  $: hideEdge = viewMode === ViewMode.EDITOR && collectBlockExists
  $: isPrimaryBranchEdge = isBranchEdgeData(data) && data.isPrimaryEdge

  $: showEdgeActions =
    viewMode === ViewMode.EDITOR &&
    !isBranchTarget &&
    !$view?.dragging &&
    !isSubflowEdge

  $: showEdgeDrop =
    viewMode === ViewMode.EDITOR &&
    !isBranchTarget &&
    $view?.dragging &&
    !isSubflowEdge

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

  // --- Dropzone sizing & offsets for LR to reduce clutter ---
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v))

  $: isLR = direction === "LR"
  $: dx = Math.abs((targetX ?? 0) - (sourceX ?? 0))
  $: dzWidth = isLR ? clamp(Math.round(dx - 140), 160, 320) : 320
  $: baseOffset = isLR ? -18 : 0
  $: nudge = isLR ? ((Math.round(sourceX + targetX) % 3) - 1) * 6 : 0
  $: dzOffsetY = baseOffset + nudge

  // Pre-branch label sizing/offset
  $: preDzWidth = isLR ? clamp(Math.round(dx - 160), 160, 300) : 320
  $: preDzOffsetY = isLR ? -24 + nudge : 0

  // For TB we keep it vertically centered under the source;
  // for LR we center horizontally and align to the source Y.
  $: preBranchLabelX =
    direction === "LR"
      ? Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
      : (sourceX ?? 0)
  $: preBranchLabelY =
    direction === "LR"
      ? (sourceY ?? 0)
      : Math.round(((sourceY ?? 0) + (targetY ?? 0)) / 2)

  const resolveBlockId = (ctx: FlowBlockContext | undefined) => {
    if (!ctx) {
      return undefined
    }
    if ("branchNode" in ctx && ctx.branchNode) {
      return ctx.branchStepId
    }
    return ctx.id
  }

  const handleBranch = () => {
    const targetPath = blockRef?.pathTo
    if (targetPath && automation) {
      automationStore.actions.branchAutomation(targetPath, automation)
    }
  }

  const handleAddBranch = () => {
    if (!isBranchEdgeData(data)) return
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

<!-- Branch edge -->
{#if isBranchEdgeData(data)}
  <BranchEdgeLabels
    {data}
    {labelX}
    {labelY}
    {preBranchLabelX}
    {preBranchLabelY}
    {showEdgeActions}
    {showEdgeDrop}
    {showPreBranchActions}
    {showPreBranchDrop}
    {collectBlockExists}
    {sourcePathForDrop}
    {block}
    {handleBranch}
    {handleAddBranch}
    {viewMode}
    {isPrimaryBranchEdge}
    edgeDzWidth={dzWidth}
    edgeDzOffsetY={dzOffsetY}
    {preDzWidth}
    {preDzOffsetY}
  />
  <!-- Standard and Loop edges -->
{:else}
  <StandardEdgeLabel
    {labelX}
    {labelY}
    {showEdgeActions}
    {showEdgeDrop}
    {collectBlockExists}
    {sourcePathForDrop}
    {block}
    {handleBranch}
    {dzWidth}
    {dzOffsetY}
  />
{/if}
