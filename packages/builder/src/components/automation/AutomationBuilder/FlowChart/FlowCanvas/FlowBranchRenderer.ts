import {
  type AutomationStep,
  type Branch,
  type BranchStep,
  type BlockPath,
} from "@budibase/types"
import type {
  AutomationBlock,
  BranchFlowContext,
  FlowBlockContext,
  FlowBlockPath,
} from "@/types/automations"
import { BRANCH, STEP, SUBFLOW } from "./FlowGeometry"
import {
  anchorNode,
  branchNode,
  edgeAddItem,
  edgeBranchAddItem,
  edgeLoopAddItem,
  stepNode,
} from "./FlowFactories"
import type { GraphBuildDeps } from "./FlowGraphTypes"
import { filterLegacyLoops, resolveBlockPath } from "./FlowGraphUtils"
import { renderChain } from "./FlowChainRenderer"

enum BranchMode {
  TOPLEVEL = "toplevel",
  SUBFLOW = "subflow",
}

interface LaneVisuals {
  laneWidth: number
  gap: number
  laneYSpacing: number
}

interface BranchClusterArgs {
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

const pushAnchor = (
  id: string,
  y: number,
  deps: GraphBuildDeps,
  parentId?: string
) => {
  deps.newNodes.push(anchorNode(id, parentId))
  if (parentId) {
    deps.subflowNodePositions[id] = { x: 0, y }
  }
}

const renderBranchCluster = (args: BranchClusterArgs) => {
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
      deps.newNodes.push(branchNode(branchNodeId, step, branch, bIdx))
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
          visuals.laneWidth
        )
      )
      deps.subflowNodePositions[branchNodeId] = {
        x: branchX,
        y: branchY,
      }
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
      const branchChildren: AutomationStep[] = filterLegacyLoops(
        childrenMap?.[branch.id] || []
      )

      const branchX = coords.x ?? 40
      const branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
      const childY = branchY + BRANCH.height / 2 - SUBFLOW.childHeight / 2
      let childX = branchX + visuals.laneWidth + SUBFLOW.internalSpacing
      let prevId: string = branchNodeId
      let prevBlock: FlowBlockContext = branchBlockRef

      branchChildren.forEach(child => {
        deps.newNodes.push(stepNode(child.id, child, parentId))
        deps.subflowNodePositions[child.id] = {
          x: childX,
          y: childY,
        }
        const prevPath = resolveBlockPath(prevBlock, deps)
        deps.newEdges.push(
          edgeLoopAddItem(prevId, child.id, {
            block: prevBlock,
            loopStepId: loopContext!.loopStepId,
            loopChildInsertIndex: loopContext!.loopChildInsertIndex,
            ...(prevPath ? { pathTo: prevPath as BlockPath[] } : {}),
          })
        )
        prevId = child.id
        prevBlock = child
        childX += SUBFLOW.stepWidth + SUBFLOW.internalSpacing
      })

      const anchorId = `anchor-${branchNodeId}`
      if (branchChildren.length === 0) {
        childX = branchX + STEP.width + 40
      }
      deps.newNodes.push(anchorNode(anchorId, parentId))
      deps.subflowNodePositions[anchorId] = {
        x: childX,
        y: childY,
      }
      const anchorSourcePath = resolveBlockPath(prevBlock, deps)
      deps.newEdges.push(
        edgeLoopAddItem(prevId, anchorId, {
          block: prevBlock,
          loopStepId: loopContext!.loopStepId,
          loopChildInsertIndex: loopContext!.loopChildInsertIndex,
          ...(anchorSourcePath
            ? { pathTo: anchorSourcePath as BlockPath[] }
            : {}),
        })
      )

      clusterBottomY = Math.max(
        clusterBottomY,
        stackStartY + totalBranchesHeight + visuals.laneYSpacing
      )
    }
  })

  return { bottomY: clusterBottomY, branched: true }
}

export const renderBranches = (
  branchStep: AutomationBlock,
  sourceNodeId: string,
  sourceBlock: FlowBlockContext,
  startY: number,
  deps: GraphBuildDeps
): number => {
  const result = renderBranchCluster({
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

export const renderSubflowBranches = (args: {
  branchStep: AutomationBlock
  source: { id: string; block: FlowBlockContext; pathTo?: FlowBlockPath }
  x: number
  y: number
  parentId: string
  deps: GraphBuildDeps
  loopStepId: string
  loopChildInsertIndex: number
}) => {
  renderBranchCluster({
    step: args.branchStep as BranchStep,
    source: args.source,
    coords: { x: args.x, y: args.y },
    deps: args.deps,
    mode: BranchMode.SUBFLOW,
    parentId: args.parentId,
    visuals: {
      laneWidth: SUBFLOW.laneWidth,
      gap: SUBFLOW.laneGap,
      laneYSpacing: SUBFLOW.ySpacing,
    },
    loopContext: {
      loopStepId: args.loopStepId,
      loopChildInsertIndex: args.loopChildInsertIndex,
    },
  })
}
