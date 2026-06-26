import dagre from "@dagrejs/dagre"
import {
  Position,
  type Edge as FlowEdge,
  type Node as FlowNode,
} from "@xyflow/svelte"
import type { FlowNodeLayout } from "@/types/automations"
import type { FlowNodePosition } from "./FlowGraphTypes"
import {
  applyBranchLaneClearance,
  applyLoopClearance,
  applyPostLoopBranchClearance,
} from "./FlowLayout"

type LayoutFlowNode = FlowNode<{ layout: FlowNodeLayout }>

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

const getNodeDimensions = (node: FlowNode) => {
  return (node as LayoutFlowNode).data.layout
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

  const rootNodes = graph.nodes.filter(node => !node.parentId)
  rootNodes.forEach(node => {
    dagreGraph.setNode(node.id, getNodeDimensions(node))
  })

  const nodeById = Object.fromEntries(graph.nodes.map(node => [node.id, node]))
  graph.edges
    .filter(edge => {
      const source = nodeById[edge.source]
      const target = nodeById[edge.target]
      return !!source && !!target && !source.parentId && !target.parentId
    })
    .forEach(edge => dagreGraph.setEdge(edge.source, edge.target))

  dagre.layout(dagreGraph)

  rootNodes.forEach(node => {
    const dims = dagreGraph.node(node.id)
    if (!dims) return

    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right
    node.position = {
      x: Math.round(dims.x - dims.width / 2),
      y: Math.round(dims.y - dims.height / 2),
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
