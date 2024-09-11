import dagre from "@dagrejs/dagre"
import { NodeWidth, NodeHeight } from "./constants"
import { Position } from "@xyflow/svelte"
import { roles } from "stores/builder"
import { Roles } from "constants/backend"
import { get } from "svelte/store"
import { Helpers } from "@budibase/bbui"

// Generates a flow compatible structure of nodes and edges from the current roles
export const defaultLayout = () => {
  const ignoredRoles = [Roles.PUBLIC]
  const $roles = get(roles)
  const descriptions = {
    [Roles.BASIC]: "Basic user",
    [Roles.POWER]: "Power user",
    [Roles.ADMIN]: "Can do everything",
  }

  let nodes = []
  let edges = []

  for (let role of $roles) {
    if (ignoredRoles.includes(role._id)) {
      continue
    }
    nodes.push({
      id: role._id,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "role",
      data: {
        displayName: role.displayName || role.name || "",
        description: descriptions[role._id] || "Custom role",
        color: role.color,
        custom: !role._id.match(/[A-Z]+/),
      },
    })

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
        animated: true,
      })
    }
  }

  return {
    nodes,
    edges,
  }
}

// Converts the flow structure of ndes and edges back into an array of roles
export const layoutToRoles = ({ nodes, edges }) => {
  // Clone and wipe existing inheritance
  let newRoles = Helpers.cloneDeep(get(roles)).map(role => {
    return { ...role, inherits: [] }
  })

  // Copy over names and colours
  for (let node of nodes) {
    let role = newRoles.find(x => x._id === node.id)
    if (role) {
      role.name = node.data.label
      role.color = node.data.color
    } else {
      // New role
    }
  }

  // Build inheritance
  for (let edge of edges) {
    let role = newRoles.find(x => x._id === edge.target)
    if (role) {
      role.inherits.push(edge.source)
    } else {
      // New role
    }
  }

  // Ensure basic is correct
  newRoles.find(x => x._id === Roles.BASIC).inherits = [Roles.BASIC]

  return newRoles
}

// Updates positions of nodes and edges into a nice graph structure
const dagreLayout = ({ nodes, edges }) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 100,
    nodesep: 100,
  })
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: NodeWidth, height: NodeHeight })
  })
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  dagre.layout(dagreGraph)
  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right
    node.position = {
      x: nodeWithPosition.x - NodeWidth / 2,
      y: nodeWithPosition.y - NodeHeight / 2,
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
        animated: true,
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
