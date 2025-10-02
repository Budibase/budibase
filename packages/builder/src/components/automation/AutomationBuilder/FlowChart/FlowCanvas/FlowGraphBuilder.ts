import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import {
  AutomationActionStepId,
  type AutomationStep,
  type BranchStep,
  type Branch,
  type LayoutDirection,
  type LoopV2Step,
} from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import type {
  BranchFlowContext,
  FlowBlockContext,
  FlowBlockPath,
} from "@/types/automations"
import { SUBFLOW, STEP, BRANCH } from "./FlowGeometry"
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
  blockRefs: Record<string, any>
  newNodes: FlowNode[]
  newEdges: FlowEdge[]
  direction?: LayoutDirection
}

enum BranchMode {
  TOPLEVEL = "toplevel",
  SUBFLOW = "subflow",
}

interface LaneVisuals {
  laneWidth: number
  gap: number
  laneYSpacing: number
  anchorWidth: number
  containerWidth?: number
}

const computeLaneCenters = (
  count: number,
  mode: BranchMode,
  opts: { laneWidth?: number; gap?: number; containerWidth?: number }
) => {
  if (count <= 0) return [] as number[]
  if (mode === BranchMode.TOPLEVEL) {
    // let Dagre position top-level branches; return zeros
    return Array.from({ length: count }, () => 0)
  }
  const laneWidth = opts.laneWidth || STEP.width
  const gap = opts.gap || 40
  const totalWidth = count * laneWidth + Math.max(0, count - 1) * gap
  const left = Math.round(((opts.containerWidth || 0) - totalWidth) / 2)
  return Array.from({ length: count }, (_, i) =>
    Math.round(left + laneWidth / 2 + i * (laneWidth + gap))
  )
}

const pushAnchor = (
  id: string,
  y: number,
  deps: GraphBuildDeps,
  parentId?: string
) => {
  deps.newNodes.push(anchorNode(id, deps.direction, parentId, { x: 0, y }))
}

interface PlaceBranchClusterArgs {
  step: BranchStep
  source: { id: string; block: FlowBlockContext; pathTo?: FlowBlockPath }
  coords: { y: number }
  deps: GraphBuildDeps
  mode: BranchMode
  parentId?: string
  visuals: LaneVisuals
}

const placeBranchCluster = (args: PlaceBranchClusterArgs) => {
  const { step, source, coords, deps, mode, parentId, visuals } = args
  const baseId = step.id
  const branches: Branch[] = (step.inputs?.branches || []) as Branch[]
  const childrenMap: Record<string, AutomationStep[]> = (step.inputs
    ?.children || {}) as Record<string, AutomationStep[]>

  const centers = computeLaneCenters(branches.length, mode, {
    laneWidth: visuals.laneWidth,
    gap: visuals.gap,
    containerWidth: visuals.containerWidth,
  })

  let clusterBottomY =
    coords.y +
    (mode === BranchMode.TOPLEVEL ? deps.ySpacing : visuals.laneYSpacing)

  branches.forEach((branch, bIdx) => {
    const branchNodeId = `branch-${baseId}-${bIdx}-${branch.id}`

    if (mode === BranchMode.TOPLEVEL) {
      deps.newNodes.push(
        branchNode(
          branchNodeId,
          step,
          branch,
          bIdx,
          deps.direction,
          undefined,
          undefined,
          { x: 0, y: coords.y }
        )
      )
    } else {
      const left = Math.round(centers[bIdx] - visuals.laneWidth / 2)
      deps.newNodes.push(
        branchNode(
          branchNodeId,
          step,
          branch,
          bIdx,
          deps.direction,
          parentId,
          visuals.laneWidth,
          { x: left, y: coords.y }
        )
      )
    }

    deps.newEdges.push(
      edgeBranchAddItem(source.id, branchNodeId, {
        block: source.block,
        direction: deps.direction,
        isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
        branchStepId: baseId,
        branchIdx: bIdx,
        branchesCount: branches.length,
        pathTo: source.pathTo,
      })
    )

    const parentPath = deps.blockRefs[baseId]?.pathTo || []
    const childSteps: AutomationStep[] = childrenMap?.[branch.id] || []
    const branchPath: FlowBlockPath = [
      ...parentPath,
      {
        branchIdx: bIdx,
        branchStepId: baseId,
        stepIdx: childSteps.length - 1,
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
        pushAnchor(terminalId, bottomY, deps)
        deps.newEdges.push(
          edgeAddItem(
            chainResult ? chainResult.lastNodeId : branchNodeId,
            terminalId,
            {
              block: chainResult ? chainResult.lastNodeBlock : branchBlockRef,
              direction: deps.direction,
            }
          )
        )
      }
      clusterBottomY = Math.max(clusterBottomY, bottomY + deps.ySpacing)
    } else {
      // This means that the branch is in a subflow
      const left = Math.round(centers[bIdx] - visuals.laneWidth / 2)
      const childLeft = Math.round(
        left + (visuals.laneWidth - visuals.anchorWidth) / 2
      )
      const branchChildren: AutomationStep[] = childrenMap?.[branch.id] || []
      let laneY = coords.y + visuals.laneYSpacing
      let prevId: string = branchNodeId
      let prevBlock: FlowBlockContext = branchBlockRef

      branchChildren.forEach(child => {
        deps.newNodes.push(
          stepNode(child.id, child, deps.direction, parentId, {
            x: childLeft,
            y: laneY,
          })
        )
        deps.newEdges.push(
          edgeAddItem(prevId, child.id, {
            block: prevBlock,
            direction: deps.direction,
          })
        )
        prevId = child.id
        prevBlock = child
        laneY += SUBFLOW.childHeight + SUBFLOW.internalSpacing
      })

      const anchorId = `anchor-${branchNodeId}`
      const anchorY = laneY
      deps.newNodes.push(
        anchorNode(anchorId, deps.direction, parentId, {
          x: childLeft,
          y: anchorY,
        })
      )
      deps.newEdges.push(
        edgeAddItem(prevId, anchorId, {
          block: prevBlock,
          direction: deps.direction,
        })
      )
      clusterBottomY = Math.max(clusterBottomY, anchorY + deps.ySpacing)
    }
  })

  return { bottomY: clusterBottomY, branched: true as const }
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

    if (isLoopV2) {
      const pos = { x: baseX, y: currentY }
      renderLoopV2Container(step as LoopV2Step, pos.x, pos.y, deps)
      deps.newEdges.push(
        edgeAddItem(lastNodeId, step.id, {
          block: lastNodeBlock,
          direction: deps.direction,
        })
      )
      lastNodeId = step.id
      lastNodeBlock = step
      currentY += deps.ySpacing
      continue
    }

    deps.newNodes.push(
      stepNode(step.id, step, deps.direction, undefined, {
        x: baseX,
        y: currentY,
      })
    )
    deps.newEdges.push(
      edgeAddItem(lastNodeId, step.id, {
        block: lastNodeBlock,
        direction: deps.direction,
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
    source: { id: sourceNodeId, block: sourceBlock },
    coords: { y: startY },
    deps,
    mode: BranchMode.TOPLEVEL,
    visuals: {
      laneWidth: STEP.width,
      gap: deps.xSpacing,
      laneYSpacing: deps.ySpacing,
      anchorWidth: STEP.width,
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
  const children: AutomationStep[] = loopStep.inputs?.children || []

  // Pre-compute container dimensions
  let containerWidth = 400
  const paddingTop = SUBFLOW.paddingTop
  const paddingBottom = SUBFLOW.paddingBottom
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight

  let dynamicHeight = paddingTop
  let maxFanoutWidth = SUBFLOW.laneWidth
  for (const step of children) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
      const branches: Branch[] = ((step as BranchStep)?.inputs?.branches ||
        []) as Branch[]
      const childrenMap: Record<string, AutomationStep[]> =
        (step as BranchStep)?.inputs?.children || {}

      const fanoutWidth =
        SUBFLOW.laneWidth +
        Math.max(0, branches.length - 1) * (SUBFLOW.laneWidth + SUBFLOW.laneGap)
      maxFanoutWidth = Math.max(maxFanoutWidth, fanoutWidth)

      const maxLaneChildren = branches.reduce((acc, br) => {
        const len = (childrenMap?.[br.id] || []).length
        return Math.max(acc, len)
      }, 0)
      dynamicHeight +=
        BRANCH.height +
        internalSpacing +
        maxLaneChildren * (childHeight + internalSpacing)
    } else {
      dynamicHeight += childHeight + internalSpacing
    }
  }
  dynamicHeight += paddingBottom
  containerWidth = Math.max(containerWidth, maxFanoutWidth + 80)
  const containerHeight = Math.max(dynamicHeight, 260)

  const loopNodeData: any = {
    block: loopStep,
    direction: deps.direction,
    containerHeight,
    containerWidth,
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
  const stepWidth = SUBFLOW.stepWidth
  const baseX = Math.max(0, Math.floor((containerWidth - stepWidth) / 2))
  let innerY = paddingTop
  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
      deps.newNodes.push(
        stepNode(child.id, child, deps.direction, baseId, {
          x: baseX,
          y: innerY,
        })
      )
      if (lastLinearChild) {
        const prevRef = deps.blockRefs?.[lastLinearChild.id]
        deps.newEdges.push(
          edgeLoopAddItem(lastLinearChild.id, child.id, {
            block: lastLinearChild,
            direction: deps.direction,
            loopStepId: loopStep.id,
            loopChildInsertIndex: cIdx,
            pathTo: prevRef?.pathTo,
          })
        )
      }
      lastLinearChild = child
      innerY += childHeight + internalSpacing
      return
    }

    if (lastLinearChild) {
      const prevRef = deps.blockRefs?.[lastLinearChild.id]
      placeBranchCluster({
        step: child as BranchStep,
        source: {
          id: lastLinearChild.id,
          block: lastLinearChild,
          pathTo: prevRef?.pathTo,
        },
        coords: { y: innerY },
        deps,
        mode: BranchMode.SUBFLOW,
        parentId: baseId,
        visuals: {
          laneWidth: SUBFLOW.laneWidth,
          gap: SUBFLOW.laneGap,
          laneYSpacing: SUBFLOW.ySpacing,
          anchorWidth: STEP.width,
          containerWidth,
        },
      })
    } else {
      placeBranchCluster({
        step: child as BranchStep,
        source: { id: child.id, block: child },
        coords: { y: innerY },
        deps,
        mode: BranchMode.SUBFLOW,
        parentId: baseId,
        visuals: {
          laneWidth: SUBFLOW.laneWidth,
          gap: SUBFLOW.laneGap,
          laneYSpacing: SUBFLOW.ySpacing,
          anchorWidth: STEP.width,
          containerWidth,
        },
      })
    }

    lastLinearChild = undefined
    innerY += BRANCH.height + internalSpacing
  })

  // Add exit anchor only when last child is non-branch
  if (
    children.length > 0 &&
    children[children.length - 1].stepId !== AutomationActionStepId.BRANCH
  ) {
    const lastChild = children[children.length - 1]
    const lastRef = deps.blockRefs?.[lastChild.id]
    const exitAnchorId = `anchor-${baseId}-loop-${lastChild.id}`
    deps.newNodes.push(
      anchorNode(exitAnchorId, deps.direction, baseId, { x: baseX, y: innerY })
    )
    deps.newEdges.push(
      edgeLoopAddItem(lastChild.id, exitAnchorId, {
        block: lastChild,
        direction: deps.direction,
        loopStepId: loopStep.id,
        loopChildInsertIndex: children.length,
        pathTo: lastRef?.pathTo,
      })
    )
  }

  return { containerWidth, containerHeight }
}

// Note: buildTopLevelGraph is implemented in AutomationStepHelpers.ts as
// the public entrypoint; this module focuses on subflow details.
