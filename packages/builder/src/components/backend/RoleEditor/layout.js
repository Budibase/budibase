import dagre from "@dagrejs/dagre"
import { NodeWidth, NodeHeight, GridResolution } from "./constants"
import { Position } from "@xyflow/svelte"
import { roles } from "stores/builder"
import { Roles } from "constants/backend"
import { get } from "svelte/store"
import { Helpers } from "@budibase/bbui"

// Converts a role doc into a node structure
export const roleToNode = role => ({
  id: role._id,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  type: "role",
  position: { x: 0, y: 0 },
  data: {
    displayName: role.displayName,
    description: role.description,
    color: role.color,
    custom: !role._id.match(/[A-Z]+/),
  },
})

// Converts a node structure back into a role doc
export const nodeToRole = node => {
  const role = get(roles).find(x => x._id === node.id)
  return {
    ...role,
    displayName: node.data.displayName,
    color: node.data.color,
    description: node.data.description,
  }
}

// Generates a flow compatible structure of nodes and edges from the current roles
export const rolesToNodes = () => {
  const ignoredRoles = [Roles.PUBLIC]
  const $roles = get(roles)

  let nodes = []
  let edges = []

  for (let role of $roles) {
    if (ignoredRoles.includes(role._id)) {
      continue
    }

    // Add node for this role
    nodes.push(roleToNode(role))

    // Add edges for this role
    let inherits = []
    if (role.inherits) {
      inherits = Array.isArray(role.inherits) ? role.inherits : [role.inherits]
    }
    for (let sourceRole of inherits) {
      // Ensure source role exists
      if (!$roles.some(x => x._id === sourceRole)) {
        continue
      }
      edges.push({
        id: `${sourceRole}-${role._id}`,
        source: sourceRole,
        target: role._id,
      })
    }
  }

  return {
    nodes,
    edges,
  }
}

// Updates positions of nodes and edges into a nice graph structure
const dagreLayout = ({ nodes, edges }) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: GridResolution * 6,
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
