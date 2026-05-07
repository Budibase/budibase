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
  import {
    isBranchStep,
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
  const layoutDirection = getContext<Writable<"LR" | "TB">>(
    "flowLayoutDirection"
  )
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
  $: isLR = $layoutDirection !== "TB"

  $: if (isAnchorTarget) {
    labelX = isLR
      ? Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
      : (sourceX ?? 0)
    labelY = isLR
      ? (sourceY ?? 0)
      : Math.round(((sourceY ?? 0) + (targetY ?? 0)) / 2)
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
  $: dy = Math.abs((targetY ?? 0) - (sourceY ?? 0))
  $: dzWidth = clamp(Math.round((isLR ? dx : dy) - 140), 160, 320)
  $: dzOffsetY = 0

  // Pre-branch label sizing
  $: preDzWidth = clamp(Math.round((isLR ? dx : dy) - 160), 160, 300)
  $: preDzOffsetY = 0

  $: preBranchLabelX = isLR
    ? Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    : (sourceX ?? 0)
  $: preBranchLabelY = isLR
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

  const getEdgeHighlight = (edgeData: EdgeData | undefined) => {
    const results =
      viewMode === ViewMode.LOGS && $automationStore.selectedLog
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
      viewMode === ViewMode.LOGS && $automationStore.selectedLog
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
  <BaseEdge path={path[0]} style={edgeStyle} />
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
