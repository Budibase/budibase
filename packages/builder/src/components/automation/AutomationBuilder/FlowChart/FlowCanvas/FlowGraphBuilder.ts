import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import {
  AutomationActionStepId,
  type AutomationStep,
  type BranchStep,
  type Branch,
  type LoopV2Step,
  BlockRef,
} from "@budibase/types"
import type { AutomationBlock, LoopV2NodeData } from "@/types/automations"
import type {
  BranchFlowContext,
  FlowBlockContext,
  FlowBlockPath,
} from "@/types/automations"
import { SUBFLOW, STEP, BRANCH, LOOP } from "./FlowGeometry"
import {
  stepNode,
  anchorNode,
  branchNode,
  edgeAddItem,
  edgeBranchAddItem,
  edgeLoopAddItem,
} from "./FlowFactories"

export interface GraphBuildDeps {
  xSpacing: number
  ySpacing: number
  blockRefs: Record<string, BlockRef>
  newNodes: FlowNode[]
  newEdges: FlowEdge[]
}

enum BranchMode {
  TOPLEVEL = "toplevel",
  SUBFLOW = "subflow",
}

const filterLegacyLoops = (steps: AutomationStep[]): AutomationStep[] => {
  return steps.filter(step => step.stepId !== AutomationActionStepId.LOOP)
}

interface LaneVisuals {
  laneWidth: number
  gap: number
  laneYSpacing: number
}

const resolveBlockPath = (
  block: FlowBlockContext | undefined,
  deps: GraphBuildDeps
): FlowBlockPath | undefined => {
  if (!block) {
    return undefined
  }
  if ("branchNode" in block && block.branchNode) {
    return block.pathTo
  }
  const ref = block?.id ? deps.blockRefs?.[block.id] : undefined
  return (ref?.pathTo as FlowBlockPath | undefined) || undefined
}

const pushAnchor = (
  id: string,
  y: number,
  deps: GraphBuildDeps,
  parentId?: string
) => {
  deps.newNodes.push(anchorNode(id, parentId, { x: 0, y }))
}

interface PlaceBranchClusterArgs {
  step: BranchStep
  source: { id: string; block: FlowBlockContext; pathTo?: FlowBlockPath }
  coords: { x?: number; y: number }
  deps: GraphBuildDeps
  mode: BranchMode
  parentId?: string
  visuals: LaneVisuals
  loopContext?: {
    loopStepId: string
    loopChildInsertIndex: number
  }
}

const placeBranchCluster = (args: PlaceBranchClusterArgs) => {
  const { step, source, coords, deps, mode, parentId, visuals, loopContext } =
    args
  const baseId = step.id
  const branches: Branch[] = step.inputs?.branches || []
  const childrenMap: Record<string, AutomationStep[]> =
    step.inputs?.children || {}

  let clusterBottomY =
    coords.y +
    (mode === BranchMode.TOPLEVEL ? deps.ySpacing : visuals.laneYSpacing)

  const totalBranchesHeight =
    branches.length * BRANCH.height +
    Math.max(0, branches.length - 1) * visuals.gap
  const stackStartY = coords.y - totalBranchesHeight / 2

  branches.forEach((branch, bIdx) => {
    const branchNodeId = `branch-${baseId}-${bIdx}-${branch.id}`

    if (mode === BranchMode.TOPLEVEL) {
      deps.newNodes.push(
        branchNode(branchNodeId, step, branch, bIdx, undefined, undefined, {
          x: 0,
          y: coords.y,
        })
      )
    } else {
      const branchX = coords.x ?? 40
      const branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
      deps.newNodes.push(
        branchNode(
          branchNodeId,
          step,
          branch,
          bIdx,
          parentId,
          visuals.laneWidth,
          { x: branchX, y: branchY }
        )
      )
    }

    deps.newEdges.push(
      edgeBranchAddItem(source.id, branchNodeId, {
        block: source.block,
        isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
        branchStepId: baseId,
        branchIdx: bIdx,
        branchesCount: branches.length,
        pathTo: source.pathTo,
        isSubflowEdge: mode === BranchMode.SUBFLOW,
        ...(loopContext
          ? {
              loopStepId: loopContext.loopStepId,
              loopChildInsertIndex: loopContext.loopChildInsertIndex,
            }
          : {}),
      })
    )

    const parentPath = deps.blockRefs[baseId]?.pathTo || []
    const childSteps: AutomationStep[] = filterLegacyLoops(
      childrenMap?.[branch.id] || []
    )
    const branchPath: FlowBlockPath = [
      ...parentPath,
      {
        branchIdx: bIdx,
        branchStepId: baseId,
        stepIdx: -1,
      },
    ]
    const branchBlockRef: BranchFlowContext = {
      branchNode: true,
      pathTo: branchPath,
      branchIdx: bIdx,
      branchStepId: baseId,
    }

    if (mode === BranchMode.TOPLEVEL) {
      const chainResult =
        childSteps.length > 0
          ? renderChain(
              childSteps,
              branchNodeId,
              branchBlockRef,
              0,
              coords.y + deps.ySpacing,
              deps
            )
          : null
      const bottomY = chainResult
        ? chainResult.bottomY
        : coords.y + deps.ySpacing
      if (!chainResult?.branched) {
        const terminalId = `anchor-${chainResult ? chainResult.lastNodeId : branchNodeId}`
        const terminalBlock = chainResult
          ? chainResult.lastNodeBlock
          : branchBlockRef
        const terminalPath = resolveBlockPath(terminalBlock, deps)
        pushAnchor(terminalId, bottomY, deps)
        deps.newEdges.push(
          edgeAddItem(
            chainResult ? chainResult.lastNodeId : branchNodeId,
            terminalId,
            {
              block: terminalBlock,
              ...(terminalPath ? { pathTo: terminalPath } : {}),
            }
          )
        )
      }
      clusterBottomY = Math.max(clusterBottomY, bottomY + deps.ySpacing)
    } else {
      // This means that the branch is in a subflow
      const branchChildren: AutomationStep[] = filterLegacyLoops(
        childrenMap?.[branch.id] || []
      )

      if (mode === BranchMode.SUBFLOW) {
        const branchX = coords.x ?? 40
        const branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
        const childY = branchY + BRANCH.height / 2 - SUBFLOW.childHeight / 2
        let childX = branchX + visuals.laneWidth + SUBFLOW.internalSpacing
        let prevId: string = branchNodeId
        let prevBlock: FlowBlockContext = branchBlockRef

        branchChildren.forEach(child => {
          deps.newNodes.push(
            stepNode(child.id, child, parentId, {
              x: childX,
              y: childY,
            })
          )
          const prevPath = resolveBlockPath(prevBlock, deps)
          deps.newEdges.push(
            edgeAddItem(prevId, child.id, {
              block: prevBlock,
              ...(prevPath ? { pathTo: prevPath } : {}),
            })
          )
          prevId = child.id
          prevBlock = child
          childX += SUBFLOW.stepWidth + SUBFLOW.internalSpacing
        })

        const anchorId = `anchor-${branchNodeId}`
        deps.newNodes.push(
          anchorNode(anchorId, parentId, {
            x: childX,
            y: childY,
          })
        )
        const anchorSourcePath = resolveBlockPath(prevBlock, deps)
        deps.newEdges.push(
          edgeAddItem(prevId, anchorId, {
            block: prevBlock,
            ...(anchorSourcePath ? { pathTo: anchorSourcePath } : {}),
          })
        )

        clusterBottomY = Math.max(
          clusterBottomY,
          stackStartY + totalBranchesHeight + visuals.laneYSpacing
        )
      }
    }
  })

  return { bottomY: clusterBottomY, branched: true }
}

export const renderChain = (
  chain: AutomationBlock[],
  parentNodeId: string,
  parentBlock: FlowBlockContext,
  baseX: number,
  startY: number,
  deps: GraphBuildDeps
): {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  bottomY: number
  branched: boolean
} => {
  let lastNodeId = parentNodeId
  let lastNodeBlock = parentBlock
  let currentY = startY
  let branched = false

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i]
    const isBranch = step.stepId === AutomationActionStepId.BRANCH
    const isLoopV2 = step.stepId === AutomationActionStepId.LOOP_V2

    if (isBranch) {
      const bottom = renderBranches(
        step,
        lastNodeId,
        lastNodeBlock,
        baseX,
        currentY,
        deps
      )
      return { lastNodeId, lastNodeBlock, bottomY: bottom, branched: true }
    }

    if (isLoopV2 && "schema" in step) {
      const pos = { x: baseX, y: currentY }
      const loopResult = renderLoopV2Container(step, pos.x, pos.y, deps)
      const sourcePath = resolveBlockPath(lastNodeBlock, deps)
      deps.newEdges.push(
        edgeAddItem(lastNodeId, step.id, {
          block: lastNodeBlock,
          ...(sourcePath ? { pathTo: sourcePath } : {}),
        })
      )
      lastNodeId = step.id
      lastNodeBlock = step
      currentY += loopResult.containerHeight + deps.ySpacing
      continue
    }

    deps.newNodes.push(
      stepNode(step.id, step, undefined, {
        x: baseX,
        y: currentY,
      })
    )
    const sourcePath = resolveBlockPath(lastNodeBlock, deps)
    deps.newEdges.push(
      edgeAddItem(lastNodeId, step.id, {
        block: lastNodeBlock,
        ...(sourcePath ? { pathTo: sourcePath } : {}),
      })
    )
    lastNodeId = step.id
    lastNodeBlock = step
    currentY += deps.ySpacing
  }

  return { lastNodeId, lastNodeBlock, bottomY: currentY, branched }
}

export const renderBranches = (
  branchStep: AutomationBlock,
  sourceNodeId: string,
  sourceBlock: FlowBlockContext,
  _centerX: number,
  startY: number,
  deps: GraphBuildDeps
): number => {
  const result = placeBranchCluster({
    step: branchStep as BranchStep,
    source: {
      id: sourceNodeId,
      block: sourceBlock,
      pathTo: resolveBlockPath(sourceBlock, deps),
    },
    coords: { y: startY },
    deps,
    mode: BranchMode.TOPLEVEL,
    visuals: {
      laneWidth: STEP.width,
      gap: deps.xSpacing,
      laneYSpacing: deps.ySpacing,
    },
  })
  return result.bottomY
}

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  x: number,
  y: number,
  deps: GraphBuildDeps
) => {
  const baseId = loopStep.id
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  // Pre-compute container dimensions
  let containerWidth = 400
  const paddingTop = SUBFLOW.paddingTop
  const paddingBottom = SUBFLOW.paddingBottom
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight
  const lrWidth = 60
  const lrMinExit = 16
  const horizontalStepWidth = STEP.width

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
    linearWidth + lrMinExit + 40,
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
    position: { x, y },
  })

  // Render children inside the container
  const stepWidth = horizontalStepWidth
  let innerX = 40
  const lrGap = 60
  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
      const nodePos = { x: innerX, y: baseY }
      deps.newNodes.push(stepNode(child.id, child, baseId, nodePos))
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

    const loopContext = {
      loopStepId: loopStep.id,
      loopChildInsertIndex: cIdx,
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
    placeBranchCluster({
      step: child,
      source,
      coords: { x: innerX, y: baseY + childHeight / 2 },
      deps,
      mode: BranchMode.SUBFLOW,
      parentId: baseId,
      visuals: {
        laneWidth: SUBFLOW.laneWidth,
        gap: SUBFLOW.laneGap,
        laneYSpacing: SUBFLOW.ySpacing,
      },
      loopContext,
    })

    lastLinearChild = undefined
    // Advance horizontal cursor to clear the full branch cluster width
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

  // Add exit anchor only when last child is non-branch
  if (
    children.length > 0 &&
    children[children.length - 1].stepId !== AutomationActionStepId.BRANCH
  ) {
    const lastChild = children[children.length - 1]
    const lastRef = deps.blockRefs?.[lastChild.id]
    const exitAnchorId = `anchor-${baseId}-loop-${lastChild.id}`
    const exitAnchorY = loopHandleY
    const exitAnchorX = containerWidth
    deps.newNodes.push(
      anchorNode(exitAnchorId, baseId, {
        x: exitAnchorX,
        y: exitAnchorY,
      })
    )
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
