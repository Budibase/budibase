import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock, FlowBlockContext } from "@/types/automations"
import { edgeAddItem, stepNode } from "../FlowFactories"
import type { GraphBuildDeps } from "../FlowGraphTypes"
import { isLoopV2Step, resolveBlockPath } from "../FlowGraphUtils"
import { renderBranches } from "./FlowBranchRenderer"
import { renderLoopV2Container } from "./FlowLoopRenderer"

interface ChainRenderResult {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  bottomY: number
  branched: boolean
}

class ChainRenderer {
  private lastNodeId: string
  private lastNodeBlock: FlowBlockContext
  private currentY: number
  private branched = false

  constructor(
    private readonly chain: AutomationBlock[],
    parentNodeId: string,
    parentBlock: FlowBlockContext,
    startY: number,
    private readonly deps: GraphBuildDeps
  ) {
    this.lastNodeId = parentNodeId
    this.lastNodeBlock = parentBlock
    this.currentY = startY
  }

  render(): ChainRenderResult {
    for (const step of this.chain) {
      const shouldContinue = this.renderBlock(step)
      if (!shouldContinue) {
        break
      }
    }

    return {
      lastNodeId: this.lastNodeId,
      lastNodeBlock: this.lastNodeBlock,
      bottomY: this.currentY,
      branched: this.branched,
    }
  }

  private renderBlock(step: AutomationBlock) {
    const isBranch = step.stepId === AutomationActionStepId.BRANCH

    if (isBranch) {
      this.renderBranchSplit(step)
      return false
    }

    if (isLoopV2Step(step)) {
      this.renderLoop(step)
      return true
    }

    this.renderStep(step)
    return true
  }

  private renderBranchSplit(step: AutomationBlock) {
    this.currentY = renderBranches(
      step,
      this.lastNodeId,
      this.lastNodeBlock,
      this.currentY,
      this.deps
    )
    this.branched = true
  }

  private renderLoop(step: LoopV2Step) {
    const loopResult = renderLoopV2Container(step, this.deps)
    this.connectTo(step)
    this.lastNodeId = step.id
    this.lastNodeBlock = step
    this.advance(loopResult.containerHeight + this.stepGap)
  }

  private renderStep(step: AutomationBlock) {
    this.deps.newNodes.push(stepNode(step.id, step))
    this.connectTo(step)
    this.lastNodeId = step.id
    this.lastNodeBlock = step
    this.advance(this.stepGap)
  }

  private connectTo(step: AutomationBlock) {
    const sourcePath = resolveBlockPath(this.lastNodeBlock, this.deps)
    this.deps.newEdges.push(
      edgeAddItem(this.lastNodeId, step.id, {
        block: this.lastNodeBlock,
        ...(sourcePath ? { pathTo: sourcePath } : {}),
      })
    )
  }

  private advance(height: number) {
    this.currentY += height
  }

  private get stepGap() {
    return this.deps.ySpacing
  }
}

export const renderChain = (
  chain: AutomationBlock[],
  parentNodeId: string,
  parentBlock: FlowBlockContext,
  startY: number,
  deps: GraphBuildDeps
): ChainRenderResult => {
  return new ChainRenderer(
    chain,
    parentNodeId,
    parentBlock,
    startY,
    deps
  ).render()
}
