import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock, FlowBlockContext } from "@/types/automations"
import { edgeAddItem, stepNode } from "../FlowFactories"
import type { GraphBuildDeps } from "../FlowGraphTypes"
import { resolveBlockPath } from "./FlowRenderUtils"
import { renderBranches, type BranchTerminalSource } from "./FlowBranchRenderer"
import { renderLoopV2Container } from "./FlowLoopRenderer"

interface ChainRenderResult {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  bottomY: number
  branched: boolean
  terminals: BranchTerminalSource[]
}

interface ChainRenderContext {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  currentY: number
  branched: boolean
  terminals: BranchTerminalSource[]
  deps: GraphBuildDeps
}

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

const connectTo = (step: AutomationBlock, context: ChainRenderContext) => {
  const sourcePath = resolveBlockPath(context.lastNodeBlock, context.deps)
  context.deps.newEdges.push(
    edgeAddItem(context.lastNodeId, step.id, {
      block: context.lastNodeBlock,
      ...(sourcePath ? { pathTo: sourcePath } : {}),
    })
  )
}

const renderBranchSplit = (
  step: AutomationBlock,
  context: ChainRenderContext
) => {
  const result = renderBranches(
    step,
    context.lastNodeId,
    context.lastNodeBlock,
    context.currentY,
    context.deps
  )
  context.currentY = result.bottomY
  context.branched = true
  context.terminals = result.terminals
}

const renderLoop = (step: LoopV2Step, context: ChainRenderContext) => {
  const loopResult = renderLoopV2Container(step, context.deps)
  connectTo(step, context)
  context.lastNodeId = step.id
  context.lastNodeBlock = step
  context.currentY += loopResult.containerHeight + context.deps.ySpacing
}

const renderStep = (step: AutomationBlock, context: ChainRenderContext) => {
  context.deps.newNodes.push(stepNode(step.id, step))
  connectTo(step, context)
  context.lastNodeId = step.id
  context.lastNodeBlock = step
  context.currentY += context.deps.ySpacing
}

const renderBlock = (step: AutomationBlock, context: ChainRenderContext) => {
  if (step.stepId === AutomationActionStepId.BRANCH) {
    renderBranchSplit(step, context)
    return false
  }

  if (isLoopV2Step(step)) {
    renderLoop(step, context)
    return true
  }

  renderStep(step, context)
  return true
}

const getRenderResult = (context: ChainRenderContext): ChainRenderResult => {
  return {
    lastNodeId: context.lastNodeId,
    lastNodeBlock: context.lastNodeBlock,
    bottomY: context.currentY,
    branched: context.branched,
    terminals: context.terminals,
  }
}

export const renderChain = (
  chain: AutomationBlock[],
  parentNodeId: string,
  parentBlock: FlowBlockContext,
  startY: number,
  deps: GraphBuildDeps
): ChainRenderResult => {
  const context: ChainRenderContext = {
    lastNodeId: parentNodeId,
    lastNodeBlock: parentBlock,
    currentY: startY,
    branched: false,
    terminals: [],
    deps,
  }

  for (const step of chain) {
    const shouldContinue = renderBlock(step, context)
    if (!shouldContinue) {
      break
    }
  }

  return getRenderResult(context)
}
