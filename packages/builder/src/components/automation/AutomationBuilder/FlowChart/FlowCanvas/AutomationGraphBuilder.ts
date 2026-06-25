import type { AutomationBlock } from "@/types/automations"
import type {
  AutomationGraph,
  AutomationGraphItem,
} from "./AutomationGraphTypes"

export class AutomationGraphBuilder {
  constructor(private readonly blocks: AutomationBlock[]) {}

  build(): AutomationGraph {
    return {
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
  }
}
