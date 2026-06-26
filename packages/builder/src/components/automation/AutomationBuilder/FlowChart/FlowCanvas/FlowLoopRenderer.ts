import {
  AutomationActionStepId,
  type AutomationStep,
  type Branch,
  type BranchStep,
  type LoopV2Step,
} from "@budibase/types"
import type { LoopV2NodeData } from "@/types/automations"
import { LOOP_INSERT_ACTION_OFFSET, STEP, SUBFLOW } from "./FlowGeometry"
import { anchorNode, edgeLoopAddItem, stepNode } from "./FlowFactories"
import type { GraphBuildDeps } from "./FlowGraphTypes"
import { filterLegacyLoops, resolveBlockPath } from "./FlowGraphUtils"
import { getLoopV2ContainerDimensions } from "./FlowLayoutMeasurements"
import { renderSubflowBranches } from "./FlowBranchRenderer"

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  deps: GraphBuildDeps
) => {
  const baseId = loopStep.id
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  const { containerWidth, containerHeight, baseY, loopHandleY } =
    getLoopV2ContainerDimensions(loopStep)
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight
  const horizontalStepWidth = STEP.width
  const initialInnerX = LOOP_INSERT_ACTION_OFFSET * 2

  const loopNodeData: LoopV2NodeData = {
    block: loopStep,
    containerHeight,
    containerWidth,
    handleY: loopHandleY,
  }
  deps.newNodes.push({
    id: baseId,
    type: "loop-subflow-node",
    data: loopNodeData,
    selectable: false,
    draggable: false,
    style: `width: ${containerWidth}px; height: ${containerHeight}px;`,
    position: { x: 0, y: 0 },
  })

  const stepWidth = horizontalStepWidth
  let innerX = initialInnerX
  const lrGap = 60
  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
      const nodePos = { x: innerX, y: baseY }
      deps.newNodes.push(stepNode(child.id, child, baseId))
      deps.subflowNodePositions[child.id] = nodePos
      if (lastLinearChild) {
        const prevRef = deps.blockRefs?.[lastLinearChild.id]
        deps.newEdges.push(
          edgeLoopAddItem(lastLinearChild.id, child.id, {
            block: lastLinearChild,
            loopStepId: loopStep.id,
            loopChildInsertIndex: cIdx,
            pathTo: prevRef?.pathTo,
          })
        )
      }
      lastLinearChild = child
      innerX += stepWidth + internalSpacing + lrGap
      return
    }

    const source = lastLinearChild
      ? {
          id: lastLinearChild.id,
          block: lastLinearChild,
          pathTo: deps.blockRefs?.[lastLinearChild.id]?.pathTo,
        }
      : {
          id: child.id,
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
    const brs: Branch[] = (child as BranchStep)?.inputs?.branches || []
    const childrenMap: Record<string, AutomationStep[]> =
      (child as BranchStep)?.inputs?.children || {}

    const maxChildrenInBranch = brs.reduce((acc, br) => {
      const len = filterLegacyLoops(childrenMap?.[br.id] || []).length
      return Math.max(acc, len)
    }, 0)
    const maxChildrenWidth =
      maxChildrenInBranch * (SUBFLOW.stepWidth + internalSpacing)
    const branchLaneWidth =
      SUBFLOW.laneWidth + maxChildrenWidth + internalSpacing

    innerX += branchLaneWidth + internalSpacing + lrGap
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
    deps.newNodes.push(anchorNode(exitAnchorId, baseId))
    deps.subflowNodePositions[exitAnchorId] = {
      x: exitAnchorX,
      y: exitAnchorY,
    }
    deps.newEdges.push(
      edgeLoopAddItem(lastChild.id, exitAnchorId, {
        block: lastChild,
        loopStepId: loopStep.id,
        loopChildInsertIndex: children.length,
        pathTo: lastRef?.pathTo,
      })
    )
  }

  return { containerWidth, containerHeight }
}
