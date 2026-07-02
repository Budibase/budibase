import {
  Position,
  type Edge as FlowEdge,
  type Node as FlowNode,
} from "@xyflow/svelte"
import type { FlowNodeLayout } from "@/types/automations"
import { LOOP, NODE_SPACING, STEP } from "./FlowGeometry"
import type { FlowNodePosition } from "./FlowGraphTypes"

type LayoutFlowNode = FlowNode<{
  layout?: FlowNodeLayout
}>

type LayoutFlowEdge = FlowEdge<{
  isBranchEdge?: boolean
  isSubflowEdge?: boolean
  branchIdx?: number
  branchStepId?: string
}>

interface Bounds {
  left: number
  top: number
  right: number
  bottom: number
}

interface Dimensions {
  width: number
  height: number
}

interface MeasuredSubtree extends Dimensions {
  rootCenterY: number
}

const POST_LOOP_BRANCH_CLEARANCE = 120

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

const getNodeDimensions = (node: FlowNode): Dimensions => {
  return (node as LayoutFlowNode).data?.layout || STEP
}

const getEdgeData = (edge: FlowEdge) => {
  return (edge as LayoutFlowEdge).data
}

const unionBounds = (bounds: Bounds[]): Bounds => {
  return bounds.reduce(
    (acc, item) => ({
      left: Math.min(acc.left, item.left),
      top: Math.min(acc.top, item.top),
      right: Math.max(acc.right, item.right),
      bottom: Math.max(acc.bottom, item.bottom),
    }),
    {
      left: Infinity,
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
    }
  )
}

const boundsFromSize = (
  left: number,
  top: number,
  size: Dimensions
): Bounds => {
  return {
    left,
    top,
    right: left + size.width,
    bottom: top + size.height,
  }
}

const positiveOrDefault = (value: number | undefined, fallback: number) => {
  return typeof value === "number" && value > 0 ? value : fallback
}

class AutomationLayoutEngine {
  private readonly nodesById: Record<string, FlowNode>
  private readonly outgoing: Record<string, FlowEdge[]> = {}
  private readonly incoming = new Set<string>()
  private readonly measured = new Map<string, MeasuredSubtree>()

  constructor(
    private readonly graph: { nodes: FlowNode[]; edges: FlowEdge[] },
    private readonly opts: AutomationLayoutOptions
  ) {
    this.nodesById = Object.fromEntries(
      graph.nodes.map(node => [node.id, node])
    )

    graph.edges.forEach(edge => {
      const source = this.nodesById[edge.source]
      const target = this.nodesById[edge.target]
      if (!source || !target || source.parentId || target.parentId) {
        return
      }
      ;(this.outgoing[edge.source] ||= []).push(edge)
      this.incoming.add(edge.target)
    })
  }

  layout() {
    const roots = this.graph.nodes.filter(
      node => !node.parentId && !this.incoming.has(node.id)
    )

    let nextTop = 0
    roots.forEach(root => {
      const measured = this.measureSubtree(root.id)
      this.layoutSubtree(root.id, 0, nextTop + measured.rootCenterY)
      nextTop += measured.height + this.nodesep
    })

    return this.graph
  }

  private measureSubtree(
    nodeId: string,
    measuring: Set<string> = new Set()
  ): MeasuredSubtree {
    const cached = this.measured.get(nodeId)
    if (cached) {
      return cached
    }

    const node = this.nodesById[nodeId]
    if (!node || measuring.has(nodeId)) {
      return {
        width: 0,
        height: 0,
        rootCenterY: 0,
      }
    }

    measuring.add(nodeId)
    const nodeSize = getNodeDimensions(node)
    const childEdges = this.getChildEdges(nodeId)

    if (childEdges.length === 0) {
      const measured = {
        width: nodeSize.width,
        height: nodeSize.height,
        rootCenterY: nodeSize.height / 2,
      }
      this.measured.set(nodeId, measured)
      measuring.delete(nodeId)
      return measured
    }

    const branchEdges = this.getBranchEdges(childEdges)
    const measured =
      branchEdges.length > 0
        ? this.measureBranchSubtree(node, nodeSize, branchEdges, measuring)
        : this.measureSequentialSubtree(node, nodeSize, childEdges, measuring)

    this.measured.set(nodeId, measured)
    measuring.delete(nodeId)
    return measured
  }

  private measureSequentialSubtree(
    node: FlowNode,
    nodeSize: Dimensions,
    childEdges: FlowEdge[],
    measuring: Set<string>
  ): MeasuredSubtree {
    const child = this.measureSubtree(childEdges[0].target, measuring)
    const gap = this.getSequentialGap(node)

    return {
      width: nodeSize.width + gap + child.width,
      height: Math.max(nodeSize.height, child.height),
      rootCenterY: Math.max(nodeSize.height, child.height) / 2,
    }
  }

  private measureBranchSubtree(
    node: FlowNode,
    nodeSize: Dimensions,
    branchEdges: FlowEdge[],
    measuring: Set<string>
  ): MeasuredSubtree {
    const lanes = branchEdges.map(edge =>
      this.measureSubtree(edge.target, measuring)
    )
    const totalLaneHeight = this.getStackedHeight(lanes)
    const branchGap = this.ranksep
    const width =
      nodeSize.width + branchGap + Math.max(...lanes.map(lane => lane.width), 0)

    if (node.type === "loop-subflow-node") {
      return {
        width,
        height: nodeSize.height + POST_LOOP_BRANCH_CLEARANCE + totalLaneHeight,
        rootCenterY: nodeSize.height / 2,
      }
    }

    const height = Math.max(nodeSize.height, totalLaneHeight)

    return {
      width,
      height,
      rootCenterY: height / 2,
    }
  }

  private layoutSubtree(nodeId: string, x: number, centerY: number): Bounds {
    const node = this.nodesById[nodeId]
    if (!node) {
      return boundsFromSize(x, centerY, { width: 0, height: 0 })
    }

    const nodeSize = getNodeDimensions(node)
    const nodeTop = centerY - nodeSize.height / 2
    node.position = {
      x: Math.round(x),
      y: Math.round(nodeTop),
    }
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right

    const childEdges = this.getChildEdges(nodeId)
    const nodeBounds = boundsFromSize(x, nodeTop, nodeSize)

    if (childEdges.length === 0) {
      return nodeBounds
    }

    const branchEdges = this.getBranchEdges(childEdges)
    const childBounds =
      branchEdges.length > 0
        ? this.layoutBranchSubtrees(node, nodeBounds, branchEdges)
        : this.layoutSequentialSubtree(node, nodeBounds, childEdges[0])

    return unionBounds([nodeBounds, childBounds])
  }

  private layoutSequentialSubtree(
    node: FlowNode,
    nodeBounds: Bounds,
    edge: FlowEdge
  ) {
    const child = this.measureSubtree(edge.target)
    const nodeCenterY = nodeBounds.top + getNodeDimensions(node).height / 2
    const childTop = nodeCenterY - child.height / 2
    return this.layoutSubtree(
      edge.target,
      nodeBounds.right + this.getSequentialGap(node),
      childTop + child.rootCenterY
    )
  }

  private layoutBranchSubtrees(
    node: FlowNode,
    nodeBounds: Bounds,
    branchEdges: FlowEdge[]
  ) {
    const lanes = branchEdges.map(edge => ({
      edge,
      measured: this.measureSubtree(edge.target),
    }))
    const totalLaneHeight = this.getStackedHeight(
      lanes.map(lane => lane.measured)
    )
    const centeredTop =
      nodeBounds.top + getNodeDimensions(node).height / 2 - totalLaneHeight / 2
    const stackTop =
      node.type === "loop-subflow-node"
        ? Math.max(centeredTop, nodeBounds.bottom + POST_LOOP_BRANCH_CLEARANCE)
        : centeredTop
    const childX = nodeBounds.right + this.ranksep

    let nextTop = stackTop
    const bounds: Bounds[] = []
    lanes.forEach(lane => {
      bounds.push(
        this.layoutSubtree(
          lane.edge.target,
          childX,
          nextTop + lane.measured.rootCenterY
        )
      )
      nextTop += lane.measured.height + this.nodesep
    })

    return unionBounds(bounds)
  }

  private getChildEdges(nodeId: string) {
    return (this.outgoing[nodeId] || []).sort((a, b) => {
      const aData = getEdgeData(a)
      const bData = getEdgeData(b)
      return (aData?.branchIdx || 0) - (bData?.branchIdx || 0)
    })
  }

  private getBranchEdges(edges: FlowEdge[]) {
    return edges.filter(edge => {
      const data = getEdgeData(edge)
      return data?.isBranchEdge === true && data?.isSubflowEdge !== true
    })
  }

  private getStackedHeight(items: Dimensions[]) {
    if (items.length === 0) {
      return 0
    }
    return (
      items.reduce((height, item) => height + item.height, 0) +
      Math.max(0, items.length - 1) * this.nodesep
    )
  }

  private getSequentialGap(node: FlowNode) {
    return node.type === "loop-subflow-node" ? LOOP.clearance : this.ranksep
  }

  private get ranksep() {
    return positiveOrDefault(this.opts.ranksep, NODE_SPACING)
  }

  private get nodesep() {
    return this.opts.nodesep ?? 220
  }
}

export interface AutomationLayoutOptions {
  ranksep?: number
  nodesep?: number
}

const layoutRootAutomationGraph = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts: AutomationLayoutOptions
) => {
  return new AutomationLayoutEngine(graph, opts).layout()
}

export interface AutomationFlowLayoutOptions extends AutomationLayoutOptions {
  subflowNodePositions: Record<string, FlowNodePosition>
}

export const layoutAutomationGraph = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  opts: AutomationFlowLayoutOptions
) => {
  applySubflowNodePositions(graph.nodes, opts.subflowNodePositions)
  return layoutRootAutomationGraph(graph, opts)
}
