import type { AutomationBlock } from "@/types/automations"
import { AutomationGraphBuilder } from "./AutomationGraphBuilder"
import {
  AutomationGraphLayout,
  layoutAutomationGraph,
} from "./AutomationGraphLayout"
import { AutomationGraphRenderer } from "./AutomationGraphRenderer"
import { NODE_SPACING } from "./FlowGeometry"
import type { GraphBuildDeps } from "./FlowGraphTypes"

export const buildAutomationGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  const graph = new AutomationGraphBuilder(blocks).build()
  const layout = new AutomationGraphLayout(graph, deps).build()
  new AutomationGraphRenderer(layout, deps).render()
  return layoutAutomationGraph(
    { nodes: deps.newNodes, edges: deps.newEdges },
    {
      ranksep: deps.xSpacing,
      nodesep: NODE_SPACING,
      compactLoops: true,
      subflowNodePositions: deps.subflowNodePositions,
    }
  )
}
