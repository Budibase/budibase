import {
  AutomationActionStepId,
  type AutomationStep,
  type Branch,
  type BranchStep,
  type LoopV2Step,
} from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import {
  BRANCH,
  LOOP,
  LOOP_INSERT_ACTION_OFFSET,
  STEP,
  SUBFLOW,
} from "./FlowGeometry"
import type {
  GraphLayoutDeps,
  LoopV2ContainerDimensions,
} from "./FlowGraphTypes"
import { filterLegacyLoops, isLoopV2Step } from "./FlowGraphUtils"

const getChainBottomY = (
  chain: AutomationBlock[],
  startY: number,
  deps: GraphLayoutDeps
) => {
  let currentY = startY

  for (const step of chain) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
      return getBranchBottomY(step, currentY, deps)
    }

    if (isLoopV2Step(step)) {
      currentY += getLoopV2ContainerDimensions(step).containerHeight
    } else {
      currentY += deps.ySpacing
    }
  }

  return currentY
}

export const getBranchBottomY = (
  branchStep: AutomationBlock,
  startY: number,
  deps: GraphLayoutDeps
) => {
  const step = branchStep as BranchStep
  const branches: Branch[] = step.inputs?.branches || []
  const childrenMap: Record<string, AutomationStep[]> =
    step.inputs?.children || {}
  let bottomY = startY + deps.ySpacing

  branches.forEach(branch => {
    const childSteps = filterLegacyLoops(childrenMap?.[branch.id] || [])
    const branchBottomY =
      childSteps.length > 0
        ? getChainBottomY(childSteps, startY + deps.ySpacing, deps)
        : startY + deps.ySpacing
    bottomY = Math.max(bottomY, branchBottomY + deps.ySpacing)
  })

  return bottomY
}

export const getLoopV2ContainerDimensions = (
  loopStep: LoopV2Step
): LoopV2ContainerDimensions => {
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  let containerWidth = 400
  const paddingTop = SUBFLOW.paddingTop
  const paddingBottom = SUBFLOW.paddingBottom
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight
  const lrWidth = 60
  const horizontalStepWidth = STEP.width
  const initialInnerX = LOOP_INSERT_ACTION_OFFSET * 2

  let maxFanoutWidth = horizontalStepWidth
  let hasBranchChild = false
  let linearWidth = 0
  let maxRowHeight = childHeight
  for (const step of children) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
      hasBranchChild = true
      const branches: Branch[] = step?.inputs?.branches || []
      const childrenMap: Record<string, AutomationStep[]> =
        step?.inputs?.children || {}

      const fanoutWidth =
        SUBFLOW.laneWidth +
        Math.max(0, branches.length - 1) * (SUBFLOW.laneWidth + SUBFLOW.laneGap)
      maxFanoutWidth = Math.max(maxFanoutWidth, fanoutWidth)

      const maxLaneChildren = branches.reduce((acc, br) => {
        const len = filterLegacyLoops(childrenMap?.[br.id] || []).length
        return Math.max(acc, len)
      }, 0)
      const totalBranchesHeight =
        branches.length * BRANCH.height +
        Math.max(0, branches.length - 1) * SUBFLOW.laneGap
      maxRowHeight = Math.max(
        maxRowHeight,
        totalBranchesHeight + internalSpacing * 2
      )

      const maxChildrenWidth =
        maxLaneChildren * (SUBFLOW.stepWidth + internalSpacing)
      const branchLaneWidth =
        SUBFLOW.laneWidth + maxChildrenWidth + internalSpacing
      linearWidth += branchLaneWidth + internalSpacing + lrWidth
    } else {
      linearWidth += horizontalStepWidth + internalSpacing + lrWidth
    }
  }
  if (linearWidth > 0) {
    linearWidth -= lrWidth
  }
  const minLinearLoopWidth = 280
  containerWidth = Math.max(
    hasBranchChild ? containerWidth : minLinearLoopWidth,
    initialInnerX + linearWidth + LOOP_INSERT_ACTION_OFFSET * 2,
    maxFanoutWidth + 80,
    hasBranchChild ? SUBFLOW.laneWidth + 80 : 0
  )
  const containerHeight = Math.max(
    paddingTop + maxRowHeight + paddingBottom,
    LOOP.minHeight
  )
  const contentHeight = containerHeight - paddingTop - paddingBottom
  const baseY = paddingTop + Math.floor((contentHeight - childHeight) / 2)
  const loopHandleY = baseY + childHeight / 2

  return {
    containerWidth,
    containerHeight,
    baseY,
    loopHandleY,
  }
}
