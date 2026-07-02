import type { Branch, BranchStep } from "@budibase/types"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import type { AutomationBlock } from "@/types/automations"
import {
  anchorNode,
  branchNode,
  edgeAddItem,
  edgeBranchAddItem,
  edgeLoopAddItem,
  stepNode,
} from "./FlowFactories"
import type { FlowNodePosition, GraphBuildDeps } from "./FlowGraphTypes"

export class FlowGraphWriter {
  constructor(private readonly deps: GraphBuildDeps) {}

  addNode(node: FlowNode, position?: FlowNodePosition) {
    this.deps.newNodes.push(node)
    if (position) {
      this.deps.subflowNodePositions[node.id] = position
    }
    return node.id
  }

  addEdge(edge: FlowEdge) {
    this.deps.newEdges.push(edge)
  }

  addStep(
    id: string,
    block: AutomationBlock,
    parentId?: string,
    position?: FlowNodePosition
  ) {
    return this.addNode(stepNode(id, block, parentId), position)
  }

  addBranch(
    id: string,
    step: BranchStep,
    branch: Branch,
    branchIdx: number,
    parentId?: string,
    laneWidth?: number,
    position?: FlowNodePosition
  ) {
    return this.addNode(
      branchNode(id, step, branch, branchIdx, parentId, laneWidth),
      position
    )
  }

  addAnchor(id: string, parentId?: string, position?: FlowNodePosition) {
    return this.addNode(anchorNode(id, parentId), position)
  }

  connect(
    source: string,
    target: string,
    ctx: Parameters<typeof edgeAddItem>[2]
  ) {
    this.addEdge(edgeAddItem(source, target, ctx))
  }

  connectBranch(
    source: string,
    target: string,
    ctx: Parameters<typeof edgeBranchAddItem>[2]
  ) {
    this.addEdge(edgeBranchAddItem(source, target, ctx))
  }

  connectLoop(
    source: string,
    target: string,
    ctx: Parameters<typeof edgeLoopAddItem>[2]
  ) {
    this.addEdge(edgeLoopAddItem(source, target, ctx))
  }
}
