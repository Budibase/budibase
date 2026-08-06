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
    type LoopEdgeData,
    type FlowBlockContext,
    type LoopFlowContext,
  } from "@/types/automations"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import StandardEdgeLabel from "./StandardEdgeLabel.svelte"
  import BranchEdgeLabels from "./BranchEdgeLabels.svelte"
  import type { DragView } from "../FlowChartDnD"
  import {
    BRANCH_LOOP_INSERT_ACTION_OFFSET,
    LOOP_INSERT_ACTION_OFFSET,
  } from "../FlowGeometry"
  import {
    getCustomEdgeLabelPosition,
    getCustomEdgePath,
    getLoopEdgePath,
    getPrimaryBranchPath,
  } from "../FlowEdgePaths"
  import {
    isBranchStep,
    AutomationActionStepId,
    type AutomationStepResult,
    type AutomationTriggerResult,
    type BranchStep,
  } from "@budibase/types"
  import { getFlowEdgeRunHighlight } from "../FlowRunHelpers"

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
    const isLoopEdgeData = (
      value: EdgeData
    ): value is LoopEdgeData | (BranchEdgeData & { loopStepId: string }) =>
      "loopStepId" in value && typeof value.loopStepId === "string"

    if (edgeData && isLoopEdgeData(edgeData)) {
      if (
        "branchNode" in edgeData.block &&
        edgeData.block.branchNode === true
      ) {
        return edgeData.block
      }
      const loopChildInsertIndex = edgeData.loopChildInsertIndex
      const loopBlock: LoopFlowContext = {
        ...edgeData.block,
        insertIntoLoopV2: true,
        loopStepId: edgeData.loopStepId,
        ...(loopChildInsertIndex !== undefined ? { loopChildInsertIndex } : {}),
        ...(edgeData.branchStepId
          ? { branchStepId: edgeData.branchStepId }
          : {}),
        ...(typeof edgeData.branchIdx === "number"
          ? { branchIdx: edgeData.branchIdx }
          : {}),
      }
      return loopBlock
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

  $: isBranchTarget = target.startsWith("branch-")
  $: isAnchorTarget = target.startsWith("anchor-")
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
  $: isBranchSource = data?.block
    ? "branchNode" in data.block && data.block.branchNode === true
    : false
  $: isPrimaryBranchEdge = isBranchEdgeData(data) && data.isPrimaryEdge
  $: preBranchLabelX = Math.round(((sourceX ?? 0) + (targetX ?? 0)) / 2)
  $: preBranchLabelY = sourceY ?? 0
  $: edgeLabelPosition = getCustomEdgeLabelPosition({
    baseLabelX: basePath[1],
    baseLabelY: basePath[2],
    sourceX,
    sourceY,
    targetX,
    targetY,
    isAnchorTarget,
    isLoopTarget,
    isLoopSource,
    isLoopInsertAnchor,
    isBranchSource,
    loopInsertActionOffset: LOOP_INSERT_ACTION_OFFSET,
    branchLoopInsertActionOffset: BRANCH_LOOP_INSERT_ACTION_OFFSET,
  })
  $: labelX = edgeLabelPosition.labelX
  $: labelY = edgeLabelPosition.labelY

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

  $: edgePath = getCustomEdgePath({
    isAnchorTarget,
    anchorPath: getStraightPath({
      sourceX,
      sourceY,
      targetX: labelX,
      targetY: labelY,
    })[0],
    loopTargetPath,
    loopSourcePath,
    primaryBranchPath,
    basePath: basePath[0],
  })

  $: blockId = resolveBlockId(data?.block)
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

  const getEdgeHighlight = (edgeData: EdgeData | undefined) =>
    getFlowEdgeRunHighlight({
      edgeData,
      target,
      runResults,
      viewMode,
      getProgressResult,
      getBranchId,
    })

  const getBranchId = (branchStepId: string, branchIdx: number) => {
    const branchStep = getBranchStep(branchStepId)
    return branchStep?.inputs.branches?.[branchIdx]?.id
  }

  const getProgressResult = (
    blockId: string
  ): AutomationStepResult | AutomationTriggerResult | undefined => {
    const result = $automationStore.testProgress?.[blockId]?.result
    if (!result || !("stepId" in result)) {
      return
    }
    return result
  }

  const getBranchStep = (branchStepId: string): BranchStep | undefined => {
    const ref = $selectedAutomation?.blockRefs?.[branchStepId]
    const block = automationStore.actions.getBlockByRef(automation, ref)
    return block && isBranchStep(block) ? block : undefined
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
