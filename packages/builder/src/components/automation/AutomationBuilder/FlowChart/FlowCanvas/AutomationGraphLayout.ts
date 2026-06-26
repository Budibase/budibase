import dagre from "@dagrejs/dagre"
import {
  Position,
  type Edge as FlowEdge,
  type Node as FlowNode,
} from "@xyflow/svelte"
import { AutomationActionStepId, type LoopV2Step } from "@budibase/types"
import type { AutomationBlock, LoopV2NodeData } from "@/types/automations"
import type { GraphLayoutDeps } from "./FlowGraphTypes"
import { ANCHOR, BRANCH, STEP } from "./FlowGeometry"
import {
  applyBranchLaneClearance,
  applyLoopClearance,
  applyPostLoopBranchClearance,
} from "./FlowLayout"
import {
  getBranchBottomY,
  getLoopV2ContainerDimensions,
} from "./FlowLayoutMeasurements"
import type { FlowNodePosition } from "./FlowGraphTypes"
import type {
  AutomationGraph,
  AutomationLayout,
  AutomationLayoutItem,
} from "./AutomationGraphTypes"

const isLoopV2Step = (step: AutomationBlock): step is LoopV2Step => {
  return step.stepId === AutomationActionStepId.LOOP_V2 && "schema" in step
}

type LoopSubflowNode = FlowNode<LoopV2NodeData, "loop-subflow-node">
const isLoopSubflowNode = (node: FlowNode): node is LoopSubflowNode => {
  return node.type === "loop-subflow-node"
}

const applySubflowNodePositions = (
  nodes: FlowNode[],
  positions: Record<string, FlowNodePosition>
) => {
  nodes.forEach(node => {
    const position = positions[node.id]
    if (!position) return
    node.position = position
  })
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

export interface DagreLayoutOptions {
  ranksep?: number
  nodesep?: number
  compactLoops?: boolean
}

export const dagreLayoutAutomation = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts?: DagreLayoutOptions
) => {
  const ranksep = opts?.ranksep ?? 260
  const nodesep = opts?.nodesep ?? 220
  const compactLoops = opts?.compactLoops !== false

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "LR", ranksep, nodesep })

  const nodeById: Record<string, FlowNode> = {}
  graph.nodes.forEach(n => (nodeById[n.id] = n))

  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      let width = STEP.width
      let height = STEP.height
      if (node.type === "branch-node") {
        height = BRANCH.height
      } else if (node.type === "anchor-node") {
        width = ANCHOR.width
        height = ANCHOR.height
      } else if (isLoopSubflowNode(node)) {
        const w = node.data?.containerWidth
        if (w > 0) width = w
        const h = node?.data?.containerHeight
        if (h > 0) {
          height = h
        }
      }
      dagreGraph.setNode(node.id, { width, height })
    })

  graph.edges
    .filter(e => {
      const s = nodeById[e.source]
      const t = nodeById[e.target]
      return !(s?.parentId || t?.parentId)
    })
    .forEach(edge => dagreGraph.setEdge(edge.source, edge.target))

  dagre.layout(dagreGraph)

  graph.nodes
    .filter(n => !n.parentId)
    .forEach(node => {
      const dims = dagreGraph.node(node.id)
      if (!dims) return
      const width = dims.width
      const height = dims.height
      node.targetPosition = Position.Left
      node.sourcePosition = Position.Right
      node.position = {
        x: Math.round(dims.x - width / 2),
        y: Math.round(dims.y - height / 2),
      }
    })

  if (compactLoops) {
    applyLoopClearance(graph)
    applyPostLoopBranchClearance(graph)
    applyBranchLaneClearance(graph)
  }
  return graph
}

export interface AutomationFlowLayoutOptions extends DagreLayoutOptions {
  subflowNodePositions: Record<string, FlowNodePosition>
}

export const layoutAutomationGraph = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts: AutomationFlowLayoutOptions
) => {
  applySubflowNodePositions(graph.nodes, opts.subflowNodePositions)
  return dagreLayoutAutomation(graph, opts)
}
