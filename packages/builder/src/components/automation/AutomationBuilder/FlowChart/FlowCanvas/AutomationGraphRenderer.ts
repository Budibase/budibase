import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import { anchorNode, edgeAddItem, stepNode } from "./FlowFactories"
import { renderBranches } from "./FlowBranchRenderer"
import { renderLoopV2Container } from "./FlowLoopRenderer"
import type { GraphBuildDeps } from "./FlowGraphTypes"
import type {
  AutomationLayout,
  AutomationLayoutItem,
} from "./AutomationGraphTypes"

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

export class AutomationGraphRenderer {
  private readonly originX = 0

  constructor(
    private readonly layout: AutomationLayout,
    private readonly deps: GraphBuildDeps
  ) {}

  render() {
    this.layout.items.forEach(item => this.renderItem(item))
  }

  private renderItem(item: AutomationLayoutItem) {
    const { block } = item

    if (block.stepId === AutomationActionStepId.BRANCH) {
      this.renderBranchSplit(item)
      return
    }

    this.renderSequentialBlock(item)
  }

  private renderSequentialBlock(item: AutomationLayoutItem) {
    const { block, y } = item
    let blockHeight = this.deps.ySpacing

    if (isLoopV2Step(block)) {
      const loopResult = renderLoopV2Container(
        block,
        this.originX,
        y,
        this.deps
      )
      blockHeight = loopResult.containerHeight
    } else {
      this.deps.newNodes.push(stepNode(block.id, block))
    }

    if (!item.isTrigger && item.previousBlock) {
      this.connectSequentially(item.previousBlock, block)
    }

    if (item.isLast) {
      this.addTerminal(block, y + blockHeight)
    }
  }

  private renderBranchSplit(item: AutomationLayoutItem) {
    const sourceBlock = item.isTrigger
      ? item.block
      : item.previousBlock || item.block
    renderBranches(
      item.block,
      sourceBlock.id,
      sourceBlock,
      this.originX,
      item.y + this.deps.ySpacing,
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

  private addTerminal(block: AutomationBlock, _y: number) {
    const terminalId = `anchor-${block.id}`
    this.deps.newNodes.push(anchorNode(terminalId))
    this.deps.newEdges.push(
      edgeAddItem(block.id, terminalId, {
        block,
      })
    )
  }
}
