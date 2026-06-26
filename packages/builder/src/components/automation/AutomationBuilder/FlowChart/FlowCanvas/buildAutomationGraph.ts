import type { AutomationBlock } from "@/types/automations"
import { AutomationGraphBuilder } from "./AutomationGraphBuilder"
import { layoutAutomationGraph } from "./AutomationFlowLayout"
import { NODE_SPACING } from "./FlowGeometry"
import type { GraphBuildDeps } from "./FlowGraphTypes"

export const buildAutomationGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  new AutomationGraphBuilder(blocks, deps).build().render()
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
