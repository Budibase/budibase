import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import type { BlockRef } from "@budibase/types"

export interface FlowNodePosition {
  x: number
  y: number
}

export interface GraphLayoutDeps {
  xSpacing: number
  ySpacing: number
  blockRefs: Record<string, BlockRef>
}

export interface GraphBuildDeps extends GraphLayoutDeps {
  newNodes: FlowNode[]
  newEdges: FlowEdge[]
  subflowNodePositions: Record<string, FlowNodePosition>
}
