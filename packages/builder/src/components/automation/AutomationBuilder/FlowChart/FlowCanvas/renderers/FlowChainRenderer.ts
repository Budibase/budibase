import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock, FlowBlockContext } from "@/types/automations"
import type { GraphBuildDeps } from "../FlowGraphTypes"
import { FlowGraphWriter } from "../FlowGraphWriter"
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

type ChainRenderSource = BranchTerminalSource

interface ChainRenderContext {
  currentSources: ChainRenderSource[]
  currentY: number
  branched: boolean
  terminals: BranchTerminalSource[]
  deps: GraphBuildDeps
  writer: FlowGraphWriter
}

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

const getLastSource = (context: ChainRenderContext) => {
  return context.currentSources[context.currentSources.length - 1]
}

const connectToCurrentSources = (
  step: AutomationBlock,
  context: ChainRenderContext
) => {
  context.currentSources.forEach(source => {
    const sourcePath =
      source.pathTo || resolveBlockPath(source.block, context.deps)
    context.writer.connect(source.nodeId, step.id, {
      block: source.block,
      ...(sourcePath ? { pathTo: sourcePath } : {}),
    })
  })
}

const renderBranchSplit = (
  step: AutomationBlock,
  context: ChainRenderContext
) => {
  const source = getLastSource(context) || {
    nodeId: step.id,
    block: step,
    pathTo: resolveBlockPath(step, context.deps),
  }
  const result = renderBranches(
    step,
    source.nodeId,
    source.block,
    context.currentY,
    context.deps
  )
  context.currentY = result.bottomY
  context.branched = true
  context.terminals = result.terminals
  context.currentSources = result.terminals
}

const renderLoop = (step: LoopV2Step, context: ChainRenderContext) => {
  const loopResult = renderLoopV2Container(step, context.deps)
  connectToCurrentSources(step, context)
  context.currentSources = [{ nodeId: step.id, block: step }]
  context.currentY += loopResult.containerHeight + context.deps.ySpacing
}

const renderStep = (step: AutomationBlock, context: ChainRenderContext) => {
  context.writer.addStep(step.id, step)
  connectToCurrentSources(step, context)
  context.currentSources = [{ nodeId: step.id, block: step }]
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
  const lastSource = getLastSource(context)
  if (!lastSource) {
    throw new Error("Cannot render an empty flow chain")
  }

  return {
    lastNodeId: lastSource.nodeId,
    lastNodeBlock: lastSource.block,
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
    currentSources: [{ nodeId: parentNodeId, block: parentBlock }],
    currentY: startY,
    branched: false,
    terminals: [],
    deps,
    writer: new FlowGraphWriter(deps),
  }

  for (const step of chain) {
    const shouldContinue = renderBlock(step, context)
    if (!shouldContinue) {
      break
    }
  }

  return getRenderResult(context)
}

export const renderRootChain = (
  chain: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  const context: ChainRenderContext = {
    currentSources: [],
    currentY: deps.ySpacing,
    branched: false,
    terminals: [],
    deps,
    writer: new FlowGraphWriter(deps),
  }

  let lastWasBranch = false
  for (const step of chain) {
    lastWasBranch = step.stepId === AutomationActionStepId.BRANCH
    const shouldContinue = renderBlock(step, context)
    if (!shouldContinue) {
      break
    }
  }

  const lastSource = getLastSource(context)
  if (lastSource && !lastWasBranch) {
    const terminalId = `anchor-${lastSource.nodeId}`
    context.writer.addAnchor(terminalId)
    context.writer.connect(lastSource.nodeId, terminalId, {
      block: lastSource.block,
      ...(lastSource.pathTo ? { pathTo: lastSource.pathTo } : {}),
    })
  }
}
