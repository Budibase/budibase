import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import { anchorNode, edgeAddItem, stepNode } from "./FlowFactories"
import { renderBranches } from "./FlowBranchRenderer"
import { renderLoopV2Container } from "./FlowLoopRenderer"
import type { GraphBuildDeps } from "./FlowGraphTypes"
import type { AutomationGraph, AutomationGraphItem } from "./AutomationGraphTypes"

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

export class AutomationGraphRenderer {
  constructor(
    private readonly graph: AutomationGraph,
    private readonly deps: GraphBuildDeps
  ) {}

  render() {
    this.graph.items.forEach(item => this.renderItem(item))
  }

  private renderItem(item: AutomationGraphItem) {
    const { block } = item

    if (block.stepId === AutomationActionStepId.BRANCH) {
      this.renderBranchSplit(item)
      return
    }

    this.renderSequentialBlock(item)
  }

  private renderSequentialBlock(item: AutomationGraphItem) {
    const { block } = item

    if (isLoopV2Step(block)) {
      renderLoopV2Container(block, this.deps)
    } else {
      this.deps.newNodes.push(stepNode(block.id, block))
    }

    if (!item.isTrigger && item.previousBlock) {
      this.connectSequentially(item.previousBlock, block)
    }

    if (item.isLast) {
      this.addTerminal(block)
    }
  }

  private renderBranchSplit(item: AutomationGraphItem) {
    const sourceBlock = item.isTrigger
      ? item.block
      : item.previousBlock || item.block
    renderBranches(
      item.block,
      sourceBlock.id,
      sourceBlock,
      this.deps.ySpacing,
      this.deps
    )
  }

  private connectSequentially(
    previousBlock: AutomationBlock,
    block: AutomationBlock
  ) {
    this.deps.newEdges.push(
      edgeAddItem(previousBlock.id, block.id, {
        block: previousBlock,
      })
    )
  }

  private addTerminal(block: AutomationBlock) {
    const terminalId = `anchor-${block.id}`
    this.deps.newNodes.push(anchorNode(terminalId))
    this.deps.newEdges.push(
      edgeAddItem(block.id, terminalId, {
        block,
      })
    )
  }
}
