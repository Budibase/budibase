import type { LayoutDirection, AutomationLayout } from "@budibase/types"
import type { Node as FlowNode, Edge as FlowEdge } from "@xyflow/svelte"
import dagre from "@dagrejs/dagre"
import { BRANCH, LOOP, STEP, SUBFLOW } from "./FlowGeometry"

const LOOP_PADDING_X = 40

type FlowGraph = { nodes: FlowNode[]; edges: FlowEdge[] }

type NodeDimensions = {
  width: number
  height: number
}

const getNodeDimensions = (node: FlowNode): NodeDimensions => {
  if (node.type === "branch-node") {
    return { width: STEP.width, height: BRANCH.height }
  }
  if (node.type === "loop-subflow-node") {
    const width =
      typeof node?.data?.containerWidth === "number"
        ? node.data.containerWidth
        : LOOP.minWidth
    const height =
      typeof node?.data?.containerHeight === "number"
        ? node.data.containerHeight
        : LOOP.minHeight
    return { width, height }
  }
  return { width: STEP.width, height: STEP.height }
}

const getBounds = (nodes: FlowNode[]): NodeDimensions => {
  if (nodes.length === 0) {
    return { width: STEP.width, height: STEP.height }
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  nodes.forEach(node => {
    const dims = getNodeDimensions(node)
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + dims.width)
    maxY = Math.max(maxY, node.position.y + dims.height)
  })

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return { width: STEP.width, height: STEP.height }
  }

  return {
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  }
}

export const applyLoopContainerBounds = (graph: FlowGraph) => {
  const childrenByParent: Record<string, FlowNode[]> = {}
  graph.nodes.forEach(node => {
    if (node.parentId) {
      ;(childrenByParent[node.parentId] ||= []).push(node)
    }
  })

  graph.nodes.forEach(node => {
    if (node.type !== "loop-subflow-node") {
      return
    }
    const children = childrenByParent[node.id] || []
    const bounds = getBounds(children)
    const width = Math.max(LOOP.minWidth, bounds.width + LOOP_PADDING_X * 2)
    const height = Math.max(
      LOOP.minHeight,
      bounds.height + SUBFLOW.paddingTop + SUBFLOW.paddingBottom
    )

    node.data = {
      ...(node.data || {}),
      containerWidth: width,
      containerHeight: height,
    }
    node.style = `width: ${width}px; height: ${height}px;`
  })
}

// No-op: anchor nodes are no longer used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const positionAnchorNodes = (
  _graph: FlowGraph,
  _direction: LayoutDirection
) => {
  // Anchor nodes have been removed - this function is kept for backwards compatibility
}

/**
 * Compute auto-layout positions using dagre for graph layout.
 */
export const computeAutoLayout = (
  graph: FlowGraph,
  direction: LayoutDirection
): AutomationLayout => {
  const layout: AutomationLayout = {}

  const layoutNodes = graph.nodes

  if (layoutNodes.length === 0) {
    return layout
  }

  // Create a new dagre graph
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction === "LR" ? "LR" : "TB",
    nodesep: 80,
    ranksep: 150,
    marginx: 100,
    marginy: 100,
  })

  // Add nodes to dagre (only top-level nodes, not loop children)
  layoutNodes
    .filter(node => !node.parentId)
    .forEach(node => {
      const dims = getNodeDimensions(node)
      g.setNode(node.id, { width: dims.width, height: dims.height })
    })

  // Add edges to dagre (only between top-level nodes)
  const topLevelIds = new Set(
    layoutNodes.filter(n => !n.parentId).map(n => n.id)
  )
  graph.edges.forEach(edge => {
    if (topLevelIds.has(edge.source) && topLevelIds.has(edge.target)) {
      g.setEdge(edge.source, edge.target)
    }
  })

  // Run dagre layout
  console.log("[FlowLayout] Running dagre layout with nodes:", g.nodes())
  console.log("[FlowLayout] Running dagre layout with edges:", g.edges())
  dagre.layout(g)

  // Log dagre results
  g.nodes().forEach(nodeId => {
    const node = g.node(nodeId)
    console.log("[FlowLayout] dagre result for", nodeId, ":", node)
  })

  // Apply positions from dagre to nodes
  layoutNodes
    .filter(node => !node.parentId)
    .forEach(node => {
      const nodeWithPosition = g.node(node.id)
      if (nodeWithPosition) {
        const dims = getNodeDimensions(node)
        // Dagre gives center positions, convert to top-left
        const x = Math.round(nodeWithPosition.x - dims.width / 2)
        const y = Math.round(nodeWithPosition.y - dims.height / 2)
        layout[node.id] = { x, y }
        node.position = { x, y }
      }
    })

  // Position loop children inside their containers
  const loopNodes = layoutNodes.filter(n => n.type === "loop-subflow-node")
  loopNodes.forEach(loopNode => {
    const children = layoutNodes.filter(n => n.parentId === loopNode.id)
    if (children.length === 0) return

    // Position children left-to-right inside the loop
    let childX = 40
    const childY = SUBFLOW.paddingTop

    // Order children by edges
    const orderedChildren = orderChildrenByEdges(children, graph.edges)

    orderedChildren.forEach(child => {
      const dims = getNodeDimensions(child)
      layout[child.id] = { x: childX, y: childY }
      child.position = { x: childX, y: childY }
      childX += dims.width + 80
    })
  })

  return layout
}

/**
 * Order children by following edges to determine sequence
 */
const orderChildrenByEdges = (
  children: FlowNode[],
  edges: FlowEdge[]
): FlowNode[] => {
  if (children.length <= 1) return children

  const childIds = new Set(children.map(c => c.id))
  const incomingFromChild: Record<string, string> = {}

  edges.forEach(e => {
    if (childIds.has(e.target) && childIds.has(e.source)) {
      incomingFromChild[e.target] = e.source
    }
  })

  // Find first child (no incoming edge from another child)
  const firstChild = children.find(c => !incomingFromChild[c.id])
  if (!firstChild) return children

  // Build ordered list by following edges
  const ordered: FlowNode[] = []
  const visited = new Set<string>()
  const edgesBySource: Record<string, string[]> = {}

  edges.forEach(e => {
    if (childIds.has(e.source) && childIds.has(e.target)) {
      ;(edgesBySource[e.source] ||= []).push(e.target)
    }
  })

  const queue = [firstChild]
  while (queue.length > 0) {
    const node = queue.shift()!
    if (visited.has(node.id)) continue
    visited.add(node.id)
    ordered.push(node)

    const nextIds = edgesBySource[node.id] || []
    nextIds.forEach(nextId => {
      const next = children.find(c => c.id === nextId)
      if (next && !visited.has(next.id)) {
        queue.push(next)
      }
    })
  }

  // Add any remaining unvisited children
  children.forEach(c => {
    if (!visited.has(c.id)) {
      ordered.push(c)
    }
  })

  return ordered
}

/**
 * Check if a layout is empty or incomplete.
 * A layout needs auto-layout if:
 * - It's undefined or null
 * - It has no entries
 * - If nodeIds are provided: fewer than 80% of nodes have positions
 * - All positions are at or very near the origin (0,0)
 */
export const isLayoutEmpty = (
  layout: AutomationLayout | undefined,
  nodeIds?: string[]
): boolean => {
  if (!layout) return true
  const positions = Object.values(layout)
  if (positions.length === 0) return true

  // If specific nodeIds are provided, check if we have positions for MOST of them
  // (not just any of them). If more than 20% are missing, trigger auto-layout.
  if (nodeIds && nodeIds.length > 0) {
    const nodesWithPositions = nodeIds.filter(id => layout[id] !== undefined)
    const coverage = nodesWithPositions.length / nodeIds.length
    if (coverage < 0.8) {
      return true
    }
  }

  // Check if all positions are at origin or very close to it
  return positions.every(pos => Math.abs(pos.x) < 10 && Math.abs(pos.y) < 10)
}
