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
    BRANCH_LOOP_INSERT_ACTION_OFFSET,
    LOOP_INSERT_ACTION_OFFSET,
  } from "../FlowGeometry"
  import { getLoopEdgePath, getPrimaryBranchPath } from "../FlowEdgePaths"
  import {
    isBranchStep,
    AutomationActionStepId,
    AutomationStatus,
    type AutomationResults,
    type AutomationStepResult,
    type AutomationTriggerResult,
    type BranchStep,
  } from "@budibase/types"
  import {
    getRunHighlight,
    isRunResults,
    didStepRun,
    isTerminalFailure,
    didBranchStopWithoutMatch,
    didRunStopWithoutBranchMatch,
    type RunHighlight,
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
  $: runResults =
    viewMode === ViewMode.LOGS
      ? $automationStore.selectedLog
      : $automationStore.testResults

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

  const getMergeJunctionTargetPath = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: {
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
  }) => {
    const radius = 12
    const verticalDirection = targetY > sourceY ? 1 : -1
    const cornerRadius = Math.min(
      radius,
      Math.abs(targetX - sourceX),
      Math.abs(targetY - sourceY)
    )

    if (cornerRadius === 0) {
      return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
    }

    return [
      `M ${sourceX},${sourceY}`,
      `L ${targetX - cornerRadius},${sourceY}`,
      `Q ${targetX},${sourceY} ${targetX},${sourceY + cornerRadius * verticalDirection}`,
      `L ${targetX},${targetY}`,
    ].join(" ")
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
  $: isMergeJunctionEdge = data?.mergeJunctionEdge === true
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
  $: isLoopInsertAnchor = data?.insertIntoLoopV2 === true && isAnchorTarget
  $: isSubflowEdge = data.isSubflowEdge === true
  $: hideActions = data?.hideActions === true
  $: continueThroughActions = data?.continueThroughActions === true
  $: isMergeJunctionTarget = isAnchorTarget && hideActions
  $: isBranchSource =
    data?.block && "branchNode" in data.block && data.block.branchNode === true

  $: if (isAnchorTarget || isLoopTarget || isLoopSource) {
    labelX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
    labelY = isLoopSource ? (targetY ?? 0) : (sourceY ?? 0)
  }
  $: if (isLoopSource) {
    labelX = sourceX + LOOP_INSERT_ACTION_OFFSET
    labelY = sourceY
  }
  $: if (isLoopInsertAnchor && !isBranchSource) {
    labelX = sourceX + LOOP_INSERT_ACTION_OFFSET
    labelY = sourceY
  }
  $: if (isLoopInsertAnchor && isBranchSource) {
    labelX = sourceX + BRANCH_LOOP_INSERT_ACTION_OFFSET
    labelY = sourceY
  }
  $: if (isMergeJunctionEdge && !isAnchorTarget) {
    labelX = sourceX
    labelY = sourceY
  }

  $: loopTargetPath = isLoopTarget
    ? getLoopEdgePath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        labelX,
        side: "target",
      })
    : undefined
  $: loopSourcePath = isLoopSource
    ? getLoopEdgePath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        labelX: isBranchTarget ? preBranchLabelX : labelX,
        side: isBranchTarget ? "branch-source" : "source",
      })
    : undefined
  $: primaryBranchPath =
    isBranchTarget && isPrimaryBranchEdge
      ? getPrimaryBranchPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          preBranchLabelX,
        })
      : undefined

  $: edgePath = isMergeJunctionEdge
    ? `M ${sourceX},${sourceY} L ${targetX},${targetY}`
    : isMergeJunctionTarget
      ? getMergeJunctionTargetPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
        })
      : isAnchorTarget && continueThroughActions
        ? [
            `M ${sourceX},${sourceY}`,
            `L ${labelX},${sourceY}`,
            `L ${labelX},${targetY}`,
            `L ${targetX},${targetY}`,
          ].join(" ")
        : isAnchorTarget
          ? getStraightPath({
              sourceX,
              sourceY,
              targetX: labelX,
              targetY: labelY,
            })[0]
          : loopTargetPath || loopSourcePath || primaryBranchPath || basePath[0]

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
    !isSubflowEdge &&
    !hideActions
  $: terminalBranchStepId = data?.terminalBranchStepId
  $: terminalBranchIdx = data?.terminalBranchIdx
  $: showMergeAction =
    showEdgeActions &&
    typeof terminalBranchStepId === "string" &&
    typeof terminalBranchIdx === "number"

  $: showEdgeDrop =
    viewMode === ViewMode.EDITOR &&
    !isBranchTarget &&
    $view?.dragging &&
    !isSubflowEdge &&
    !hideActions

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
    if (viewMode !== ViewMode.LOGS) {
      const progressHighlight = getProgressEdgeHighlight(edgeData)
      if (progressHighlight) {
        return progressHighlight
      }
    }

    if (!edgeData || !isRunResults(runResults)) {
      return
    }
    const runHighlight = getRunHighlight(runResults)

    if (isBranchEdgeData(edgeData)) {
      if (didBranchStepStopWithoutMatch(edgeData.branchStepId)) {
        return "stopped"
      }
      if (
        runHighlight !== "stopped" &&
        didBranchStepFail(edgeData.branchStepId)
      ) {
        return runHighlight
      }
      return didBranchRun(edgeData.branchStepId, edgeData.branchIdx)
        ? runHighlight
        : undefined
    }

    if (isBranchContext(edgeData.block)) {
      if (didBranchStepStopWithoutMatch(edgeData.block.branchStepId)) {
        return
      }
      if (
        runHighlight !== "stopped" &&
        didBranchStepFail(edgeData.block.branchStepId)
      ) {
        return runHighlight
      }
      return didBranchRun(edgeData.block.branchStepId, edgeData.block.branchIdx)
        ? runHighlight
        : undefined
    }

    if (didBranchStepStopWithoutMatch(target)) {
      return "stopped"
    }

    if (!didTargetRun(runResults)) {
      return
    }
    return didRunStopWithoutBranchMatch(runResults) ? "stopped" : runHighlight
  }

  const getProgressEdgeHighlight = (
    edgeData: EdgeData | undefined
  ): RunHighlight | undefined => {
    if (!edgeData) {
      return
    }

    if (isBranchEdgeData(edgeData)) {
      return didProgressBranchRun(edgeData.branchStepId, edgeData.branchIdx)
    }

    const progress = getProgressResult(target)
    if (!progress || !didStepRun(progress)) {
      return
    }
    if (isTerminalFailure(progress)) {
      return progress.outputs.status === AutomationStatus.STOPPED
        ? "stopped"
        : "error"
    }
    return "success"
  }

  const didTargetRun = (results: AutomationResults) => {
    if (target === results.trigger.id) {
      return didStepRun(results.trigger)
    }
    const targetResult = results.steps.find(step => step.id === target)
    return targetResult ? didStepRun(targetResult) : false
  }

  const didBranchRun = (branchStepId: string, branchIdx: number) => {
    if (!isRunResults(runResults)) {
      return false
    }
    const branchStep = getBranchStep(branchStepId)
    const branchId = branchStep?.inputs.branches?.[branchIdx]?.id
    if (!branchId) {
      return false
    }
    const result = runResults.steps.find(step => step.id === branchStepId)
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

  const didBranchStepFail = (branchStepId: string) => {
    if (!isRunResults(runResults)) {
      return false
    }
    return isTerminalFailure(
      runResults.steps.find(step => step.id === branchStepId)
    )
  }

  const didBranchStepStopWithoutMatch = (branchStepId: string) => {
    if (!isRunResults(runResults)) {
      return false
    }
    return didBranchStopWithoutMatch(
      runResults.steps.find(step => step.id === branchStepId)
    )
  }

  const didProgressBranchRun = (
    branchStepId: string,
    branchIdx: number
  ): RunHighlight | undefined => {
    const result = getProgressResult(branchStepId)
    if (!result || !didStepRun(result)) {
      return
    }
    const branchStep = getBranchStep(branchStepId)
    const branchId = branchStep?.inputs.branches?.[branchIdx]?.id
    const outputs = result.outputs
    const ranBranch =
      !!outputs &&
      typeof outputs === "object" &&
      "branchId" in outputs &&
      outputs.branchId === branchId
    if (!ranBranch) {
      return
    }
    if (isTerminalFailure(result)) {
      return result.outputs.status === AutomationStatus.STOPPED
        ? "stopped"
        : "error"
    }
    return "success"
  }

  const getProgressResult = (
    blockId: string
  ): AutomationStepResult | AutomationTriggerResult | undefined => {
    const result = $automationStore.testProgress?.[blockId]?.result
    if (
      !result ||
      isRunResults(result) ||
      !("outputs" in result) ||
      !("id" in result) ||
      !("stepId" in result)
    ) {
      return
    }
    return result
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
    {data}
    {labelX}
    {labelY}
    {preBranchLabelX}
    {preBranchLabelY}
    {showEdgeActions}
    {showEdgeDrop}
    {showMergeAction}
    {terminalBranchStepId}
    {terminalBranchIdx}
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
    {showMergeAction}
    {terminalBranchStepId}
    {terminalBranchIdx}
    {collectBlockExists}
    {sourcePathForDrop}
    {block}
    {handleBranch}
    hideBranch={isMergeJunctionEdge}
    {dzWidth}
    {dzOffsetY}
  />
{/if}
