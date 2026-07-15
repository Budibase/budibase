import {
  AutomationActionStepId,
  type AutomationStep,
  type Branch,
  type BranchStep,
  type LoopV2Step,
} from "@budibase/types"
import type { LoopV2NodeData } from "@/types/automations"
import {
  BRANCH,
  LOOP,
  LOOP_INSERT_ACTION_OFFSET,
  STEP,
  SUBFLOW,
} from "../FlowGeometry"
import { FLOW_NODE_TYPE, type GraphBuildDeps } from "../FlowGraphTypes"
import { FlowGraphWriter } from "../FlowGraphWriter"
import { filterLegacyLoops, resolveBlockPath } from "./FlowRenderUtils"
import { renderSubflowBranches } from "./FlowBranchRenderer"

interface LoopV2ContainerDimensions {
  containerWidth: number
  containerHeight: number
  baseY: number
  loopHandleY: number
}

interface BranchChildMetrics {
  fanoutWidth: number
  maxLaneChildren: number
  rowHeight: number
}

const LR_GAP = 60
const INITIAL_INNER_X = LOOP_INSERT_ACTION_OFFSET * 2

const getBranchChildMetrics = (step: AutomationStep): BranchChildMetrics => {
  const branches: Branch[] = (step as BranchStep).inputs?.branches || []
  const childrenMap: Record<string, AutomationStep[]> =
    (step as BranchStep).inputs?.children || {}
  const maxLaneChildren = branches.reduce((acc, branch) => {
    const childCount = filterLegacyLoops(childrenMap?.[branch.id] || []).length
    return Math.max(acc, childCount)
  }, 0)
  const fanoutWidth =
    SUBFLOW.laneWidth +
    Math.max(0, branches.length - 1) * (SUBFLOW.laneWidth + SUBFLOW.laneGap)
  const rowHeight =
    branches.length * BRANCH.height +
    Math.max(0, branches.length - 1) * SUBFLOW.laneGap +
    SUBFLOW.internalSpacing * 2

  return {
    fanoutWidth,
    maxLaneChildren,
    rowHeight,
  }
}

const getBranchLaneWidth = (maxLaneChildren: number) => {
  return (
    SUBFLOW.laneWidth +
    maxLaneChildren * (SUBFLOW.stepWidth + SUBFLOW.internalSpacing) +
    SUBFLOW.internalSpacing
  )
}

const createBranchSourceAnchor = (
  loopStepId: string,
  branchStep: AutomationStep,
  x: number,
  y: number,
  deps: GraphBuildDeps
) => {
  const writer = new FlowGraphWriter(deps)
  const sourceId = `anchor-${loopStepId}-loop-${branchStep.id}-source`
  writer.addAnchor(sourceId, loopStepId, {
    x: Math.max(0, x - LOOP_INSERT_ACTION_OFFSET),
    y,
  })
  return sourceId
}

const getLoopV2ContainerDimensions = (
  children: AutomationStep[]
): LoopV2ContainerDimensions => {
  const dimensions = children.reduce(
    (acc, step) => {
      if (step.stepId !== AutomationActionStepId.BRANCH) {
        acc.linearWidth += STEP.width + SUBFLOW.internalSpacing + LR_GAP
        return acc
      }

      const metrics = getBranchChildMetrics(step)
      acc.hasBranchChild = true
      acc.linearWidth +=
        getBranchLaneWidth(metrics.maxLaneChildren) +
        SUBFLOW.internalSpacing +
        LR_GAP
      acc.maxFanoutWidth = Math.max(acc.maxFanoutWidth, metrics.fanoutWidth)
      acc.maxRowHeight = Math.max(acc.maxRowHeight, metrics.rowHeight)
      return acc
    },
    {
      hasBranchChild: false,
      linearWidth: 0,
      maxFanoutWidth: STEP.width,
      maxRowHeight: SUBFLOW.childHeight,
    }
  )
  const linearWidth =
    dimensions.linearWidth > 0 ? dimensions.linearWidth - LR_GAP : 0
  const containerWidth = Math.max(
    dimensions.hasBranchChild ? 400 : 280,
    INITIAL_INNER_X + linearWidth + LOOP_INSERT_ACTION_OFFSET * 2,
    dimensions.maxFanoutWidth + 80,
    dimensions.hasBranchChild ? SUBFLOW.laneWidth + 80 : 0
  )
  const containerHeight = Math.max(
    SUBFLOW.paddingTop + dimensions.maxRowHeight + SUBFLOW.paddingBottom,
    LOOP.minHeight
  )
  const contentHeight =
    containerHeight - SUBFLOW.paddingTop - SUBFLOW.paddingBottom
  const baseY =
    SUBFLOW.paddingTop + Math.floor((contentHeight - SUBFLOW.childHeight) / 2)

  return {
    containerWidth,
    containerHeight,
    baseY,
    loopHandleY: baseY + SUBFLOW.childHeight / 2,
  }
}

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  deps: GraphBuildDeps
) => {
  const writer = new FlowGraphWriter(deps)
  const baseId = loopStep.id
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  const { containerWidth, containerHeight, baseY, loopHandleY } =
    getLoopV2ContainerDimensions(children)
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight
  const horizontalStepWidth = STEP.width

  const loopNodeData: LoopV2NodeData = {
    block: loopStep,
    containerHeight,
    containerWidth,
    handleY: loopHandleY,
    layout: {
      width: containerWidth,
      height: containerHeight,
    },
  }
  writer.addNode({
    id: baseId,
    type: FLOW_NODE_TYPE.LOOP_SUBFLOW,
    data: loopNodeData,
    selectable: false,
    draggable: false,
    style: `width: ${containerWidth}px; height: ${containerHeight}px;`,
    position: { x: 0, y: 0 },
  })

  const stepWidth = horizontalStepWidth
  let innerX = INITIAL_INNER_X
  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
      const nodePos = { x: innerX, y: baseY }
      writer.addStep(child.id, child, baseId, nodePos)
      if (lastLinearChild) {
        const prevRef = deps.blockRefs?.[lastLinearChild.id]
        writer.connectLoop(lastLinearChild.id, child.id, {
          block: lastLinearChild,
          loopStepId: loopStep.id,
          loopChildInsertIndex: cIdx,
          pathTo: prevRef?.pathTo,
        })
      }
      lastLinearChild = child
      innerX += stepWidth + internalSpacing + LR_GAP
      return
    }

    const source = lastLinearChild
      ? {
          id: lastLinearChild.id,
          block: lastLinearChild,
          pathTo: deps.blockRefs?.[lastLinearChild.id]?.pathTo,
        }
      : {
          id: createBranchSourceAnchor(
            loopStep.id,
            child,
            innerX,
            baseY + childHeight / 2,
            deps
          ),
          block: child,
          pathTo: resolveBlockPath(child, deps),
        }

    renderSubflowBranches({
      branchStep: child,
      source,
      x: innerX,
      y: baseY + childHeight / 2,
      parentId: baseId,
      deps,
      loopStepId: loopStep.id,
      loopChildInsertIndex: cIdx,
    })

    lastLinearChild = undefined
    const { maxLaneChildren } = getBranchChildMetrics(child)
    innerX += getBranchLaneWidth(maxLaneChildren) + internalSpacing + LR_GAP
  })

  if (
    children.length > 0 &&
    children[children.length - 1].stepId !== AutomationActionStepId.BRANCH
  ) {
    const lastChild = children[children.length - 1]
    const lastRef = deps.blockRefs?.[lastChild.id]
    const exitAnchorId = `anchor-${baseId}-loop-${lastChild.id}`
    const exitAnchorY = loopHandleY
    const exitAnchorX = containerWidth
    writer.addAnchor(exitAnchorId, baseId, {
      x: exitAnchorX,
      y: exitAnchorY,
    })
    writer.connectLoop(lastChild.id, exitAnchorId, {
      block: lastChild,
      loopStepId: loopStep.id,
      loopChildInsertIndex: children.length,
      pathTo: lastRef?.pathTo,
    })
  }

  return { containerWidth, containerHeight }
}
