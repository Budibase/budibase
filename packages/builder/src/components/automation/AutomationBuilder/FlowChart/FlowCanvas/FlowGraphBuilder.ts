import {
  AutomationActionStepId,
  type AutomationStep,
  type BranchStep,
  type Branch,
  type LayoutDirection,
  type LoopV2Step,
  BlockRef,
  type AutomationLayout,
} from "@budibase/types"
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import type { AutomationBlock, LoopV2NodeData } from "@/types/automations"
import type {
  BranchFlowContext,
  FlowBlockContext,
  FlowBlockPath,
} from "@/types/automations"
import { LOOP } from "./FlowGeometry"
import {
  stepNode,
  branchNode,
  edgeAddItem,
  edgeBranchAddItem,
  edgeLoopAddItem,
} from "./FlowFactories"

export interface GraphBuildDeps {
  blockRefs: Record<string, BlockRef>
  newNodes: FlowNode[]
  newEdges: FlowEdge[]
  layout?: AutomationLayout
  direction?: LayoutDirection
  xSpacing?: number
  ySpacing?: number
}

interface LoopContext {
  loopStepId: string
  loopChildInsertIndex: number
}

const filterLegacyLoops = (steps: AutomationStep[]): AutomationStep[] => {
  return steps.filter(step => step.stepId !== AutomationActionStepId.LOOP)
}

const resolveLayoutPosition = (
  layout: AutomationLayout | undefined,
  nodeId: string
) => {
  const pos = layout?.[nodeId]
  if (!pos) {
    return { x: 0, y: 0 }
  }
  return { x: pos.x, y: pos.y }
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

const resolveLoopParentId = (blockId: string, deps: GraphBuildDeps) => {
  const ref = deps.blockRefs?.[blockId]
  const path = ref?.pathTo
  if (!path?.length) {
    return undefined
  }
  for (let i = path.length - 1; i >= 0; i -= 1) {
    const hop = path[i]
    if (hop?.loopStepId) {
      return hop.loopStepId
    }
  }
  return undefined
}

// ----------------------------
// Graph building (top-level)
// ----------------------------

export const buildTopLevelGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  blocks.forEach((block: AutomationBlock, idx: number) => {
    const isTrigger = idx === 0
    const isBranchStep = block.stepId === AutomationActionStepId.BRANCH
    const isLoopV2 = block.stepId === AutomationActionStepId.LOOP_V2
    const baseId = block.id

    if (!isBranchStep) {
      if (isLoopV2 && "schema" in block) {
        renderLoopV2Container(block, deps)
      } else {
        deps.newNodes.push(
          stepNode(baseId, block, deps.direction, undefined, {
            ...resolveLayoutPosition(deps.layout, baseId),
          })
        )
      }
    }

    if (!isTrigger && !isBranchStep) {
      const prevBlock = blocks[idx - 1]
      deps.newEdges.push(
        edgeAddItem(prevBlock.id, baseId, {
          block: prevBlock,
          direction: deps.direction,
        })
      )
    }

    if (isBranchStep) {
      const sourceForBranches = !isTrigger ? blocks[idx - 1].id : baseId
      const sourceBlock = !isTrigger ? blocks[idx - 1] : block
      renderBranches(
        block as BranchStep,
        sourceForBranches,
        sourceBlock as FlowBlockContext,
        deps
      )
    }
  })
}

export const renderChain = (
  chain: AutomationBlock[],
  parentNodeId: string,
  parentBlock: FlowBlockContext,
  deps: GraphBuildDeps,
  parentId?: string
): {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  branched: boolean
} => {
  let lastNodeId = parentNodeId
  let lastNodeBlock = parentBlock
  let branched = false

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i]
    const isBranch = step.stepId === AutomationActionStepId.BRANCH
    const isLoopV2 = step.stepId === AutomationActionStepId.LOOP_V2

    if (isBranch) {
      renderBranches(
        step as BranchStep,
        lastNodeId,
        lastNodeBlock,
        deps,
        parentId
      )
      branched = true
      break
    }

    if (isLoopV2 && "schema" in step) {
      renderLoopV2Container(step, deps, parentId)
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
      continue
    }

    deps.newNodes.push(
      stepNode(step.id, step, deps.direction, parentId, {
        ...resolveLayoutPosition(deps.layout, step.id),
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
  }

  return { lastNodeId, lastNodeBlock, branched }
}

export const renderBranches = (
  branchStep: BranchStep,
  sourceNodeId: string,
  sourceBlock: FlowBlockContext,
  deps: GraphBuildDeps,
  parentIdOverride?: string,
  loopContext?: LoopContext
) => {
  const baseId = branchStep.id
  const branches: Branch[] = branchStep.inputs?.branches || []
  const childrenMap: Record<string, AutomationStep[]> =
    branchStep.inputs?.children || {}
  const parentId = parentIdOverride || resolveLoopParentId(baseId, deps)

  branches.forEach((branch, bIdx) => {
    const branchNodeId = `branch-${baseId}-${bIdx}-${branch.id}`
    const sourcePath = resolveBlockPath(sourceBlock, deps)

    deps.newNodes.push(
      branchNode(
        branchNodeId,
        branchStep,
        branch,
        bIdx,
        deps.direction,
        parentId,
        undefined,
        {
          ...resolveLayoutPosition(deps.layout, branchNodeId),
        }
      )
    )

    deps.newEdges.push(
      edgeBranchAddItem(sourceNodeId, branchNodeId, {
        block: sourceBlock,
        direction: deps.direction,
        isPrimaryEdge: bIdx === Math.floor((branches.length - 1) / 2),
        branchStepId: baseId,
        branchIdx: bIdx,
        branchesCount: branches.length,
        ...(sourcePath ? { pathTo: sourcePath } : {}),
        ...(parentId ? { isSubflowEdge: true } : {}),
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
    const branchPathEntry: FlowBlockPath = [
      ...parentPath,
      {
        branchIdx: bIdx,
        branchStepId: baseId,
        stepIdx: -1,
      },
    ]
    const branchBlockRef: BranchFlowContext = {
      branchNode: true,
      pathTo: branchPathEntry,
      branchIdx: bIdx,
      branchStepId: baseId,
    }

    if (childSteps.length > 0) {
      renderChain(childSteps, branchNodeId, branchBlockRef, deps, parentId)
    }
    // No anchor nodes needed - users can drag from source handles to add steps
  })
}

export const renderLoopV2Container = (
  loopStep: LoopV2Step,
  deps: GraphBuildDeps,
  parentId?: string
) => {
  const baseId = loopStep.id
  const children: AutomationStep[] = filterLegacyLoops(
    loopStep.inputs?.children || []
  )
  const internalDir = (deps.direction || "LR") as LayoutDirection

  const loopNodeData: LoopV2NodeData = {
    block: loopStep,
    direction: deps.direction,
    containerHeight: LOOP.minHeight,
    containerWidth: LOOP.minWidth,
  }

  const loopNode: FlowNode = {
    id: baseId,
    type: "loop-subflow-node",
    data: loopNodeData,
    selectable: false,
    draggable: true,
    style: `width: ${LOOP.minWidth}px; height: ${LOOP.minHeight}px;`,
    position: {
      ...resolveLayoutPosition(deps.layout, baseId),
    },
  }
  if (parentId) {
    loopNode.parentId = parentId
    loopNode.extent = "parent"
  }
  deps.newNodes.push(loopNode)

  let lastLinearChild: AutomationStep | undefined = undefined

  children.forEach((child, cIdx) => {
    const isBranch = child.stepId === AutomationActionStepId.BRANCH

    if (!isBranch) {
      deps.newNodes.push(
        stepNode(child.id, child, internalDir, baseId, {
          ...resolveLayoutPosition(deps.layout, child.id),
        })
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
      return
    }

    const loopContext = {
      loopStepId: loopStep.id,
      loopChildInsertIndex: cIdx,
    }

    renderBranches(
      child as BranchStep,
      lastLinearChild ? lastLinearChild.id : child.id,
      (lastLinearChild || child) as FlowBlockContext,
      deps,
      baseId,
      loopContext
    )

    lastLinearChild = undefined
  })
  // No exit anchor needed - users can drag from source handles to add steps
}
