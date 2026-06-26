import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import type { BlockRef } from "@budibase/types"
import type { FlowBlockContext } from "@/types/automations"

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

export interface ChainRenderResult {
  lastNodeId: string
  lastNodeBlock: FlowBlockContext
  bottomY: number
  branched: boolean
}

export interface LoopV2ContainerDimensions {
  containerWidth: number
  containerHeight: number
  baseY: number
  loopHandleY: number
}
