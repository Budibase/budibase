import type { AutomationBlock } from "@/types/automations"
import { layoutAutomationGraph } from "./AutomationFlowLayout"
import { NODE_SPACING } from "./FlowGeometry"
import type { GraphBuildDeps } from "./FlowGraphTypes"
import { renderRootChain } from "./renderers/FlowChainRenderer"

export const buildAutomationGraph = (
  blocks: AutomationBlock[],
  deps: GraphBuildDeps
) => {
  renderRootChain(blocks, deps)
  return layoutAutomationGraph(
    { nodes: deps.newNodes, edges: deps.newEdges },
    {
      ranksep: deps.xSpacing,
      nodesep: NODE_SPACING,
      subflowNodePositions: deps.subflowNodePositions,
    }
  )
}
