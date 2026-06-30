import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import { anchorNode, edgeAddItem, stepNode } from "./FlowFactories"
import {
  renderBranches,
  type BranchTerminalSource,
} from "./renderers/FlowBranchRenderer"
import { renderLoopV2Container } from "./renderers/FlowLoopRenderer"
import type {
  AutomationGraph,
  AutomationGraphItem,
} from "./AutomationGraphTypes"
import type { GraphBuildDeps } from "./FlowGraphTypes"

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

export class AutomationGraphBuilder {
  private graph?: AutomationGraph
  private readonly branchTerminals: Record<string, BranchTerminalSource[]> = {}

  constructor(
    private readonly blocks: AutomationBlock[],
    private readonly deps: GraphBuildDeps
  ) {}

  build() {
    this.graph = {
      items: this.blocks.map((block, index): AutomationGraphItem => {
        return {
          block,
          previousBlock: this.blocks[index - 1],
          index,
          isTrigger: index === 0,
          isLast: index === this.blocks.length - 1,
        }
      }),
    }

    return this
  }

  render() {
    this.graph?.items.forEach(item => this.renderItem(item))
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
    const result = renderBranches(
      item.block,
      sourceBlock.id,
      sourceBlock,
      this.deps.ySpacing,
      this.deps
    )
    this.branchTerminals[item.block.id] = result.terminals
  }

  private connectSequentially(
    previousBlock: AutomationBlock,
    block: AutomationBlock
  ) {
    if (previousBlock.stepId === AutomationActionStepId.BRANCH) {
      for (const terminal of this.branchTerminals[previousBlock.id] || []) {
        this.deps.newEdges.push(
          edgeAddItem(terminal.nodeId, block.id, {
            block: terminal.block,
            ...(terminal.pathTo ? { pathTo: terminal.pathTo } : {}),
          })
        )
      }
      return
    }

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
