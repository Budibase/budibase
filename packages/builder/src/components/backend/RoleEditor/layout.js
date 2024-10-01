import dagre from "@dagrejs/dagre"
import { NodeWidth, NodeHeight, GridResolution } from "./constants"
import { Position } from "@xyflow/svelte"
import { Roles } from "constants/backend"
import { Helpers } from "@budibase/bbui"

// Updates positions of nodes and edges into a nice graph structure
export const dagreLayout = ({ nodes, edges }) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: GridResolution * 4,
    nodesep: GridResolution * 2,
  })
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: NodeWidth, height: NodeHeight })
  })
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Add ephemeral edges for basic and admin so that we can position them properly

  for (let node of nodes) {
    if (
      !edges.some(x => x.target === node.id) &&
      node.id !== Roles.BASIC &&
      node.id !== Roles.ADMIN
    ) {
      dagreGraph.setEdge(Roles.BASIC, node.id)
    }
    if (
      !edges.some(x => x.source === node.id) &&
      node.id !== Roles.BASIC &&
      node.id !== Roles.ADMIN
    ) {
      dagreGraph.setEdge(node.id, Roles.ADMIN)
    }
  }

  dagre.layout(dagreGraph)
  nodes.forEach(node => {
    const pos = dagreGraph.node(node.id)
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right
    node.position = {
      x: Math.round((pos.x - NodeWidth / 2) / GridResolution) * GridResolution,
      y: Math.round((pos.y - NodeHeight / 2) / GridResolution) * GridResolution,
    }
  })
  return { nodes, edges }
}

// Adds additional edges as needed to the flow structure to ensure compatibility with BB role logic
const sanitiseLayout = ({ nodes, edges }) => {
  // Remove any inheritance of basic and admin since this is implied
  edges = edges.filter(
    edge => edge.source !== Roles.BASIC && edge.target !== Roles.ADMIN
  )

  return {
    nodes,
    edges,
  }
}

// Automatically lays out the graph, sanitising and enriching the structure
export const autoLayout = ({ nodes, edges }) => {
  return dagreLayout(sanitiseLayout({ nodes, edges }))
}
