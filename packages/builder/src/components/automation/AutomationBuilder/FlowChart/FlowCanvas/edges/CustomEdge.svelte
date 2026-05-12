<script lang="ts">
  import {
    getSmoothStepPath,
    BaseEdge,
    getStraightPath,
    type Position,
  } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
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
  import { FLOW_ITEM_ACTION_BAR_WIDTH } from "../FlowGeometry"
  import {
    isBranchStep,
    AutomationActionStepId,
    type AutomationResults,
    type BranchStep,
  } from "@budibase/types"
  import {
    getRunHighlight,
    isRunResults,
    didStepRun,
    isTerminalFailure,
  } from "../FlowRunHelpers"

  export let data: EdgeData
  export let sourceX: number
  export let sourceY: number
  export let targetX: number
  export let targetY: number
  export let sourcePosition: Position
  export let targetPosition: Position
  export let target: string

  let block: FlowBlockContext | undefined
  let edgeStyle: string | undefined
  $: viewMode = $automationStore.viewMode as ViewMode
  $: block = deriveBlockContext(data)
  $: passedPathTo = data?.pathTo
  $: automation = $selectedAutomation?.data

  const view = getContext<Writable<DragView>>("draggableView")

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
  $: targetBlockRef = target
    ? $selectedAutomation?.blockRefs?.[target]
    : undefined
  $: targetBlock = automationStore.actions.getBlockByRef(
    automation,
    targetBlockRef
  )
  $: isLoopTarget = targetBlock?.stepId === AutomationActionStepId.LOOP_V2
  $: isLoopSource =
    data?.block && "stepId" in data.block
      ? data.block.stepId === AutomationActionStepId.LOOP_V2
      : false
  $: isSubflowEdge = data.isSubflowEdge === true
  $: isEmptyBranchAnchor =
    isAnchorTarget && block ? isBranchContext(block) : false
  $: isPopulatedBranchTarget =
    !isAnchorTarget && block ? isBranchContext(block) : false
  $: branchLabelX = (() => {
    const bendX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    return Math.round((bendX + (targetX ?? 0)) / 2)
  })()

  $: if (isAnchorTarget || isLoopTarget || isLoopSource) {
    labelX = isEmptyBranchAnchor
      ? branchLabelX - Math.round(FLOW_ITEM_ACTION_BAR_WIDTH / 4)
      : Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    labelY = isEmptyBranchAnchor
      ? (targetY ?? 0)
      : isLoopSource
        ? (targetY ?? 0)
        : (sourceY ?? 0)
  }

  $: if (isPopulatedBranchTarget) {
    labelX = branchLabelX
    labelY = targetY ?? 0
  }

  $: loopTargetPath = isLoopTarget ? getLoopTargetPath() : undefined
  $: loopSourcePath = isLoopSource ? getLoopSourcePath() : undefined
  $: emptyBranchAnchorPath = isEmptyBranchAnchor
    ? getSmoothStepPath({
        sourceX,
        sourceY,
        targetX: targetX - Math.round(FLOW_ITEM_ACTION_BAR_WIDTH / 4) - 1,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 12,
      })[0]
    : undefined

  $: edgePath =
    emptyBranchAnchorPath ||
    (isAnchorTarget && !isEmptyBranchAnchor
      ? getStraightPath({
          sourceX,
          sourceY,
          targetX: labelX,
          targetY: labelY,
        })[0]
      : loopTargetPath || loopSourcePath || basePath[0])

  $: blockId = resolveBlockId(data?.block as FlowBlockContext | undefined)
  $: blockRef = blockId ? $selectedAutomation?.blockRefs?.[blockId] : undefined
  $: sourcePathForDrop = passedPathTo || blockRef?.pathTo
  $: edgeHighlight = getEdgeHighlight(data)
  $: if (edgeHighlight === "success") {
    edgeStyle =
      "stroke: var(--spectrum-semantic-positive-color-status); stroke-width: 2px;"
  } else if (edgeHighlight === "error") {
    edgeStyle =
      "stroke: var(--spectrum-semantic-negative-color-status); stroke-width: 2px;"
  } else if (edgeHighlight === "stopped") {
    edgeStyle =
      "stroke: var(--spectrum-global-color-orange-500); stroke-width: 2px;"
  } else {
    edgeStyle = undefined
  }

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

  // --- Dropzone sizing for LR to reduce clutter ---
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v))

  $: dx = Math.abs((targetX ?? 0) - (sourceX ?? 0))
  $: dzWidth = clamp(Math.round(dx - 140), 160, 320)
  $: dzOffsetY = 0

  // Pre-branch label sizing
  $: preDzWidth = clamp(Math.round(dx - 160), 160, 300)
  $: preDzOffsetY = 0

  $: preBranchLabelX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
  $: preBranchLabelY = sourceY ?? 0

  const resolveBlockId = (ctx: FlowBlockContext | undefined) => {
    if (!ctx) {
      return undefined
    }
    if ("branchNode" in ctx && ctx.branchNode) {
      return ctx.branchStepId
    }
    return ctx.id
  }

  const getLoopTargetPath = () => {
    const radius = 12
    const desiredBendX =
      labelX + Math.round(FLOW_ITEM_ACTION_BAR_WIDTH / 2) + radius
    const bendX = Math.max(
      sourceX + radius,
      Math.min(targetX - radius, desiredBendX)
    )
    const yDirection = targetY >= sourceY ? 1 : -1

    if (Math.abs(targetY - sourceY) <= radius * 2) {
      return [
        `M ${sourceX},${sourceY}`,
        `L ${bendX},${sourceY}`,
        `L ${bendX},${targetY}`,
        `L ${targetX},${targetY}`,
      ].join(" ")
    }

    return [
      `M ${sourceX},${sourceY}`,
      `L ${bendX - radius},${sourceY}`,
      `Q ${bendX},${sourceY} ${bendX},${sourceY + yDirection * radius}`,
      `L ${bendX},${targetY - yDirection * radius}`,
      `Q ${bendX},${targetY} ${bendX + radius},${targetY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  const getLoopSourcePath = () => {
    const radius = 12
    const desiredBendX =
      labelX - Math.round(FLOW_ITEM_ACTION_BAR_WIDTH / 2) - radius
    const bendX = Math.max(
      sourceX + radius,
      Math.min(targetX - radius, desiredBendX)
    )

    const yDirection = targetY >= sourceY ? 1 : -1

    if (Math.abs(targetY - sourceY) <= radius * 2) {
      return [
        `M ${sourceX},${sourceY}`,
        `L ${bendX},${sourceY}`,
        `L ${bendX},${targetY}`,
        `L ${targetX},${targetY}`,
      ].join(" ")
    }

    return [
      `M ${sourceX},${sourceY}`,
      `L ${bendX - radius},${sourceY}`,
      `Q ${bendX},${sourceY} ${bendX},${sourceY + yDirection * radius}`,
      `L ${bendX},${targetY - yDirection * radius}`,
      `Q ${bendX},${targetY} ${bendX + radius},${targetY}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
  }

  const getEdgeHighlight = (edgeData: EdgeData | undefined) => {
    const results =
      viewMode === ViewMode.LOGS
        ? $automationStore.selectedLog
        : $automationStore.testResults
    if (!edgeData || !isRunResults(results)) {
      return
    }
    const runHighlight = getRunHighlight(results)

    if (isBranchEdgeData(edgeData)) {
      return didBranchRun(edgeData.branchStepId, edgeData.branchIdx)
        ? runHighlight
        : undefined
    }

    if (isBranchContext(edgeData.block)) {
      return didBranchRun(edgeData.block.branchStepId, edgeData.block.branchIdx)
        ? runHighlight
        : undefined
    }

    return didTargetRun(results) ? runHighlight : undefined
  }

  const didTargetRun = (results: AutomationResults) => {
    if (target === results.trigger.id) {
      return didStepRun(results.trigger)
    }
    const targetResult = results.steps.find(step => step.id === target)
    return targetResult ? didStepRun(targetResult) : false
  }

  const didBranchRun = (branchStepId: string, branchIdx: number) => {
    const results =
      viewMode === ViewMode.LOGS
        ? $automationStore.selectedLog
        : $automationStore.testResults
    if (!isRunResults(results)) {
      return false
    }
    const branchStep = getBranchStep(branchStepId)
    const branchId = branchStep?.inputs.branches?.[branchIdx]?.id
    if (!branchId) {
      return false
    }
    const result = results.steps.find(step => step.id === branchStepId)
    if (isTerminalFailure(result)) {
      return false
    }
    const outputs = result?.outputs
    return (
      !!outputs &&
      typeof outputs === "object" &&
      "branchId" in outputs &&
      outputs.branchId === branchId
    )
  }

  const getBranchStep = (branchStepId: string): BranchStep | undefined => {
    const ref = $selectedAutomation?.blockRefs?.[branchStepId]
    const block = automationStore.actions.getBlockByRef(automation, ref)
    return block && isBranchStep(block) ? block : undefined
  }

  const isBranchContext = (
    value: FlowBlockContext
  ): value is Extract<FlowBlockContext, { branchNode: true }> => {
    return "branchNode" in value && value.branchNode === true
  }
</script>

{#if !hideEdge}
  <BaseEdge path={edgePath} style={edgeStyle} />
{/if}

<!-- Branch edge -->
{#if isBranchEdgeData(data)}
  <BranchEdgeLabels
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
    {dzWidth}
    {dzOffsetY}
  />
{/if}
