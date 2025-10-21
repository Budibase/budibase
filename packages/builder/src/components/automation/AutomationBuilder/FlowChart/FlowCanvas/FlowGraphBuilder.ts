import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import {
  AutomationActionStepId,
  type AutomationStep,
  type BranchStep,
  type Branch,
  type LayoutDirection,
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
  direction?: LayoutDirection
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
  anchorWidth: number
  containerWidth?: number
}

const computeLaneCenters = (
  count: number,
  mode: BranchMode,
  opts: { laneWidth?: number; gap?: number; containerWidth?: number }
) => {
  if (count <= 0) return []
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
  deps.newNodes.push(anchorNode(id, deps.direction, parentId, { x: 0, y }))
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

  const internalDir = (deps.direction || "TB") as LayoutDirection
  const isLR = internalDir === "LR"

  const centers = computeLaneCenters(branches.length, mode, {
    laneWidth: visuals.laneWidth,
    gap: visuals.gap,
    containerWidth: visuals.containerWidth,
  })

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
      let branchX: number
      let branchY: number
      if (isLR && mode === BranchMode.SUBFLOW) {
        branchX = coords.x ?? 40
        branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
      } else {
        branchX = Math.round(centers[bIdx] - visuals.laneWidth / 2)
        branchY = coords.y
      }
      deps.newNodes.push(
        branchNode(
          branchNodeId,
          step,
          branch,
          bIdx,
          internalDir,
          parentId,
          visuals.laneWidth,
          { x: branchX, y: branchY }
        )
      )
    }

    deps.newEdges.push(
      edgeBranchAddItem(source.id, branchNodeId, {
        block: source.block,
        direction: internalDir,
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
              direction: deps.direction,
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

      if (isLR && mode === BranchMode.SUBFLOW) {
        // Horizontal layout
        const branchX = coords.x ?? 40
        const branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
        const childY = branchY + BRANCH.height / 2 - SUBFLOW.childHeight / 2
        let childX = branchX + visuals.laneWidth + SUBFLOW.internalSpacing
        let prevId: string = branchNodeId
        let prevBlock: FlowBlockContext = branchBlockRef

        branchChildren.forEach(child => {
          deps.newNodes.push(
            stepNode(child.id, child, internalDir, parentId, {
              x: childX,
              y: childY,
            })
          )
          const prevPath = resolveBlockPath(prevBlock, deps)
          deps.newEdges.push(
            edgeAddItem(prevId, child.id, {
              block: prevBlock,
              direction: internalDir,
              ...(prevPath ? { pathTo: prevPath } : {}),
            })
          )
          prevId = child.id
          prevBlock = child
          childX += SUBFLOW.stepWidth + SUBFLOW.internalSpacing
        })

        const anchorId = `anchor-${branchNodeId}`
        deps.newNodes.push(
          anchorNode(anchorId, internalDir, parentId, {
            x: childX,
            y: childY,
          })
        )
        const anchorSourcePath = resolveBlockPath(prevBlock, deps)
        deps.newEdges.push(
          edgeAddItem(prevId, anchorId, {
            block: prevBlock,
            direction: internalDir,
            ...(anchorSourcePath ? { pathTo: anchorSourcePath } : {}),
          })
        )

        clusterBottomY = Math.max(
          clusterBottomY,
          stackStartY + totalBranchesHeight + visuals.laneYSpacing
        )
      } else {
        // Vertical layout
        const left = Math.round(centers[bIdx] - visuals.laneWidth / 2)
        const childLeft = Math.round(
          left + (visuals.laneWidth - visuals.anchorWidth) / 2
        )
        let laneY = coords.y + visuals.laneYSpacing
        let prevId: string = branchNodeId
        let prevBlock: FlowBlockContext = branchBlockRef

        branchChildren.forEach(child => {
          deps.newNodes.push(
            stepNode(child.id, child, internalDir, parentId, {
              x: childLeft,
              y: laneY,
            })
          )
          const prevPath = resolveBlockPath(prevBlock, deps)
          deps.newEdges.push(
            edgeAddItem(prevId, child.id, {
              block: prevBlock,
              direction: internalDir,
              ...(prevPath ? { pathTo: prevPath } : {}),
            })
          )
          prevId = child.id
          prevBlock = child
          laneY += SUBFLOW.childHeight + SUBFLOW.internalSpacing
        })

        const anchorId = `anchor-${branchNodeId}`
        const anchorY = laneY
        deps.newNodes.push(
          anchorNode(anchorId, internalDir, parentId, {
            x: childLeft,
            y: anchorY,
          })
        )
        const anchorSourcePath = resolveBlockPath(prevBlock, deps)
        deps.newEdges.push(
          edgeAddItem(prevId, anchorId, {
            block: prevBlock,
            direction: internalDir,
            ...(anchorSourcePath ? { pathTo: anchorSourcePath } : {}),
          })
        )
        const spacing =
          mode === BranchMode.SUBFLOW ? visuals.laneYSpacing : deps.ySpacing
        clusterBottomY = Math.max(clusterBottomY, anchorY + spacing)
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
          direction: deps.direction,
          ...(sourcePath ? { pathTo: sourcePath } : {}),
        })
      )
      lastNodeId = step.id
      lastNodeBlock = step
      currentY += loopResult.containerHeight + deps.ySpacing
      continue
    }

    deps.newNodes.push(
      stepNode(step.id, step, deps.direction, undefined, {
        x: baseX,
        y: currentY,
      })
    )
    const sourcePath = resolveBlockPath(lastNodeBlock, deps)
    deps.newEdges.push(
      edgeAddItem(lastNodeId, step.id, {
        block: lastNodeBlock,
        direction: deps.direction,
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
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  // Follow the global layout inside the loop container
  const internalDir = (deps.direction || "TB") as LayoutDirection
  const isLR = internalDir === "LR"

  // Pre-compute container dimensions
  let containerWidth = 400
  const paddingTop = SUBFLOW.paddingTop
  const paddingBottom = SUBFLOW.paddingBottom
  const internalSpacing = SUBFLOW.internalSpacing
  const childHeight = SUBFLOW.childHeight
  const lrWidth = 60
  const lrGapForWidth = isLR ? lrWidth : 0
  const lrSpacing = SUBFLOW.internalSpacing + (isLR ? lrWidth : 0)
  const lrMinExit = lrSpacing + 20

  let dynamicHeight = paddingTop
  let maxFanoutWidth = SUBFLOW.stepWidth
  let linearWidth = 0
  let maxRowHeight = childHeight
  for (const step of children) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
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
      if (isLR) {
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
        linearWidth += branchLaneWidth + internalSpacing + lrGapForWidth
      } else {
        dynamicHeight +=
          BRANCH.height +
          internalSpacing +
          maxLaneChildren * (childHeight + internalSpacing)
      }
    } else {
      if (isLR) {
        linearWidth += SUBFLOW.stepWidth + internalSpacing + lrGapForWidth
      } else {
        dynamicHeight += childHeight + internalSpacing
      }
    }
  }
  if (isLR && linearWidth > 0) {
    linearWidth -= lrGapForWidth
  }
  dynamicHeight += paddingBottom
  if (isLR) {
    containerWidth = Math.max(
      containerWidth,
      linearWidth + lrMinExit + 40,
      maxFanoutWidth + 80,
      SUBFLOW.laneWidth + 80
    )
  } else {
    containerWidth = Math.max(containerWidth, maxFanoutWidth + 80)
  }
  const containerHeight = isLR
    ? Math.max(paddingTop + maxRowHeight + paddingBottom, LOOP.minHeight)
    : Math.max(dynamicHeight, LOOP.minHeight)

  const loopNodeData: LoopV2NodeData = {
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
  const contentHeight = containerHeight - paddingTop - paddingBottom
  const baseY = isLR
    ? paddingTop + Math.floor((contentHeight - childHeight) / 2)
    : Math.max(paddingTop, Math.floor((containerHeight - childHeight) / 2))
  let innerY = paddingTop
  let innerX = 40
  const lrGap = isLR ? 60 : 0
  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH
    if (!isBranch) {
      const nodePos = isLR ? { x: innerX, y: baseY } : { x: baseX, y: innerY }
      deps.newNodes.push(
        stepNode(child.id, child, internalDir, baseId, nodePos)
      )
      if (lastLinearChild) {
        const prevRef = deps.blockRefs?.[lastLinearChild.id]
        deps.newEdges.push(
          edgeLoopAddItem(lastLinearChild.id, child.id, {
            block: lastLinearChild,
            direction: internalDir,
            loopStepId: loopStep.id,
            loopChildInsertIndex: cIdx,
            pathTo: prevRef?.pathTo,
          })
        )
      }
      lastLinearChild = child
      if (isLR) {
        innerX += stepWidth + internalSpacing + lrGap
      } else {
        innerY += childHeight + internalSpacing
      }
      return
    }

    const loopContext = {
      loopStepId: loopStep.id,
      loopChildInsertIndex: cIdx,
    }

    if (lastLinearChild) {
      const prevRef = deps.blockRefs?.[lastLinearChild.id]
      placeBranchCluster({
        step: child,
        source: {
          id: lastLinearChild.id,
          block: lastLinearChild,
          pathTo: prevRef?.pathTo,
        },
        coords: isLR
          ? { x: innerX, y: baseY + childHeight / 2 }
          : { y: innerY },
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
        loopContext,
      })
    } else {
      placeBranchCluster({
        step: child,
        source: {
          id: child.id,
          block: child,
          pathTo: resolveBlockPath(child, deps),
        },
        coords: isLR
          ? { x: innerX, y: baseY + childHeight / 2 }
          : { y: innerY },
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
        loopContext,
      })
    }

    lastLinearChild = undefined
    if (isLR) {
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
    } else {
      innerY += BRANCH.height + internalSpacing
    }
  })

  // Add exit anchor only when last child is non-branch
  if (
    children.length > 0 &&
    children[children.length - 1].stepId !== AutomationActionStepId.BRANCH
  ) {
    const lastChild = children[children.length - 1]
    const lastRef = deps.blockRefs?.[lastChild.id]
    const exitAnchorId = `anchor-${baseId}-loop-${lastChild.id}`
    // Place exit anchor at container end according to layout
    const exitAnchorY = isLR ? baseY : containerHeight - paddingBottom
    const exitAnchorX = isLR
      ? Math.max(containerWidth - 40, baseX + stepWidth)
      : baseX
    deps.newNodes.push(
      anchorNode(exitAnchorId, internalDir, baseId, {
        x: exitAnchorX,
        y: exitAnchorY,
      })
    )
    deps.newEdges.push(
      edgeLoopAddItem(lastChild.id, exitAnchorId, {
        block: lastChild,
        direction: internalDir,
        loopStepId: loopStep.id,
        loopChildInsertIndex: children.length,
        pathTo: lastRef?.pathTo,
      })
    )
  }

  return { containerWidth, containerHeight }
}
