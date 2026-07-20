import type { Node as SvelteFlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import type { BlockRef } from "@budibase/types"

export const FLOW_NODE_TYPE = {
  STEP: "step-node",
  BRANCH: "branch-node",
  ANCHOR: "anchor-node",
  LOOP_SUBFLOW: "loop-subflow-node",
} as const

type BaseFlowNode<TType extends string> = Omit<SvelteFlowNode, "type"> & {
  type: TType
}

export type StepFlowNode = BaseFlowNode<typeof FLOW_NODE_TYPE.STEP>
export type BranchFlowNode = BaseFlowNode<typeof FLOW_NODE_TYPE.BRANCH>
export type AnchorFlowNode = BaseFlowNode<typeof FLOW_NODE_TYPE.ANCHOR>
export type LoopSubflowNode = BaseFlowNode<typeof FLOW_NODE_TYPE.LOOP_SUBFLOW>

export type FlowNode =
  | StepFlowNode
  | BranchFlowNode
  | AnchorFlowNode
  | LoopSubflowNode

export type FlowNodeType = FlowNode["type"]

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
