import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock } from "@/types/automations"
import type { GraphLayoutDeps } from "./FlowGraphTypes"
import {
  getBranchBottomY,
  getLoopV2ContainerDimensions,
} from "./FlowLayoutMeasurements"
import type {
  AutomationGraph,
  AutomationLayout,
  AutomationLayoutItem,
} from "./AutomationGraphTypes"

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

export class AutomationGraphLayout {
  private currentY = 0

  constructor(
    private readonly graph: AutomationGraph,
    private readonly deps: GraphLayoutDeps
  ) {}

  build(): AutomationLayout {
    const items: AutomationLayoutItem[] = []

    this.graph.items.forEach(item => {
      items.push({
        ...item,
        y: this.currentY,
      })
      this.currentY += this.getItemHeight(item.block)
    })

    return { items }
  }

  private getItemHeight(block: AutomationBlock) {
    if (block.stepId === AutomationActionStepId.BRANCH) {
      const branchBottomY = getBranchBottomY(block, this.nextBlockY, this.deps)
      return branchBottomY - this.currentY
    }

    if (isLoopV2Step(block)) {
      return getLoopV2ContainerDimensions(block).containerHeight
    }

    return this.stepHeight
  }

  private get nextBlockY() {
    return this.currentY + this.stepHeight
  }

  private get stepHeight() {
    return this.deps.ySpacing
  }
}
