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
    ranksep: GridResolution * 8,
    nodesep: GridResolution * 2,
  })
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: NodeWidth, height: NodeHeight })
  })
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
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
  let additions = []

  for (let node of nodes) {
    // If a node does not inherit anything, let it inherit basic
    if (!edges.some(x => x.target === node.id) && node.id !== Roles.BASIC) {
      additions.push({
        id: Helpers.uuid(),
        source: Roles.BASIC,
        target: node.id,
        animated: true,
      })
    }

    // If a node is not inherited by anything, let it be inherited by admin
    if (!edges.some(x => x.source === node.id) && node.id !== Roles.ADMIN) {
      additions.push({
        id: Helpers.uuid(),
        source: node.id,
        target: Roles.ADMIN,
      })
    }
  }

  return {
    nodes,
    edges: [...edges, ...additions],
  }
}

// Automatically lays out the graph, sanitising and enriching the structure
export const autoLayout = ({ nodes, edges }) => {
  return dagreLayout(sanitiseLayout({ nodes, edges }))
}
