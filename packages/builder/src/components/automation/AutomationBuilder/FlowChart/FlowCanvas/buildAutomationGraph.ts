import type { AutomationBlock } from "@/types/automations"
import { AutomationGraphBuilder } from "./AutomationGraphBuilder"
import { AutomationGraphLayout } from "./AutomationGraphLayout"
import { AutomationGraphRenderer } from "./AutomationGraphRenderer"
import type { GraphBuildDeps } from "./FlowGraphTypes"

export const buildAutomationGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  const graph = new AutomationGraphBuilder(blocks).build()
  const layout = new AutomationGraphLayout(graph, deps).build()
  new AutomationGraphRenderer(layout, deps).render()
}
