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
import { BRANCH, STEP, SUBFLOW } from "../FlowGeometry"
import type { GraphBuildDeps } from "../FlowGraphTypes"
import { FlowGraphWriter } from "../FlowGraphWriter"
import { filterLegacyLoops, resolveBlockPath } from "./FlowRenderUtils"
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

export interface BranchTerminalSource {
  nodeId: string
  block: FlowBlockContext
  pathTo?: FlowBlockPath
}

const pushAnchor = (
  id: string,
  y: number,
  writer: FlowGraphWriter,
  parentId?: string
) => {
  writer.addAnchor(id, parentId, parentId ? { x: 0, y } : undefined)
}

const renderBranchCluster = (args: BranchClusterArgs) => {
  const { step, source, coords, deps, mode, parentId, visuals, loopContext } =
    args
  const writer = new FlowGraphWriter(deps)
  const baseId = step.id
  const branches: Branch[] = step.inputs?.branches || []
  const childrenMap: Record<string, AutomationStep[]> =
    step.inputs?.children || {}
  const terminals: BranchTerminalSource[] = []

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
      writer.addBranch(branchNodeId, step, branch, bIdx)
    } else {
      const branchX = coords.x ?? 40
      const branchY = stackStartY + bIdx * (BRANCH.height + visuals.gap)
      writer.addBranch(
        branchNodeId,
        step,
        branch,
        bIdx,
        parentId,
        visuals.laneWidth,
        {
          x: branchX,
          y: branchY,
        }
      )
    }

    writer.connectBranch(source.id, branchNodeId, {
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
        pushAnchor(terminalId, bottomY, writer)
        terminals.push({
          nodeId: terminalId,
          block: terminalBlock,
          ...(terminalPath ? { pathTo: terminalPath } : {}),
        })
        writer.connect(
          chainResult ? chainResult.lastNodeId : branchNodeId,
          terminalId,
          {
            block: terminalBlock,
            ...(terminalPath ? { pathTo: terminalPath } : {}),
          }
        )
      } else {
        terminals.push(...chainResult.terminals)
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
        writer.addStep(child.id, child, parentId, {
          x: childX,
          y: childY,
        })
        const prevPath = resolveBlockPath(prevBlock, deps)
        writer.connectLoop(prevId, child.id, {
          block: prevBlock,
          loopStepId: loopContext!.loopStepId,
          loopChildInsertIndex: loopContext!.loopChildInsertIndex,
          branchStepId: baseId,
          branchIdx: bIdx,
          ...(prevPath ? { pathTo: prevPath as BlockPath[] } : {}),
        })
        prevId = child.id
        prevBlock = child
        childX += SUBFLOW.stepWidth + SUBFLOW.internalSpacing
      })

      const anchorId = `anchor-${branchNodeId}`
      if (branchChildren.length === 0) {
        childX = branchX + STEP.width + 40
      }
      writer.addAnchor(anchorId, parentId, {
        x: childX,
        y: childY,
      })
      const anchorSourcePath = resolveBlockPath(prevBlock, deps)
      writer.connectLoop(prevId, anchorId, {
        block: prevBlock,
        loopStepId: loopContext!.loopStepId,
        loopChildInsertIndex: loopContext!.loopChildInsertIndex,
        branchStepId: baseId,
        branchIdx: bIdx,
        ...(anchorSourcePath
          ? { pathTo: anchorSourcePath as BlockPath[] }
          : {}),
      })

      clusterBottomY = Math.max(
        clusterBottomY,
        stackStartY + totalBranchesHeight + visuals.laneYSpacing
      )
    }
  })

  return { bottomY: clusterBottomY, branched: true, terminals }
}

export const renderBranches = (
  branchStep: AutomationBlock,
  sourceNodeId: string,
  sourceBlock: FlowBlockContext,
  startY: number,
  deps: GraphBuildDeps
): ReturnType<typeof renderBranchCluster> => {
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
  return result
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
