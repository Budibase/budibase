import dagre from "@dagrejs/dagre"
import {
  NodeWidth,
  NodeHeight,
  GridResolution,
  NodeHSpacing,
  NodeVSpacing,
} from "./constants"
import { getNodesBounds, Position } from "@xyflow/svelte"
import { Roles } from "constants/backend"

// Gets the position of the basic role
export const getBasicPosition = bounds => ({
  x: bounds.x - NodeHSpacing - NodeWidth,
  y: bounds.y + bounds.height / 2 - NodeHeight / 2,
})

// Gets the position of the admin role
export const getAdminPosition = bounds => ({
  x: bounds.x + bounds.width + NodeHSpacing,
  y: bounds.y + bounds.height / 2 - NodeHeight / 2,
})

// Updates positions of nodes and edges into a nice graph structure
export const dagreLayout = ({ nodes, edges }) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: NodeHSpacing,
    nodesep: NodeVSpacing,
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

  // Reposition basic and admin to bound the custom nodes
  const bounds = getNodesBounds(nodes.filter(node => node.data.custom))
  nodes.find(x => x.id === Roles.BASIC).position = getBasicPosition(bounds)
  nodes.find(x => x.id === Roles.ADMIN).position = getAdminPosition(bounds)

  return { nodes, edges }
}

// Adds additional edges as needed to the flow structure to ensure compatibility with BB role logic
const sanitiseLayout = ({ nodes, edges }) => {
  const ignoredRoles = [Roles.PUBLIC, Roles.POWER]
  const edglessRoles = [...ignoredRoles, Roles.BASIC, Roles.ADMIN]
  return {
    nodes: nodes.filter(node => !ignoredRoles.includes(node.id)),
    edges: edges.filter(edge => {
      return (
        !edglessRoles.includes(edge.source) &&
        !edglessRoles.includes(edge.target)
      )
    }),
  }
}

// Automatically lays out the graph, sanitising and enriching the structure
export const autoLayout = ({ nodes, edges }) => {
  return dagreLayout(sanitiseLayout({ nodes, edges }))
}

// Converts a role doc into a node structure
export const roleToNode = role => {
  const custom = !role._id.match(/[A-Z]+/)
  return {
    id: role._id,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "role",
    position: { x: 0, y: 0 },
    data: {
      ...role.uiMetadata,
      custom,
    },
    measured: {
      width: NodeWidth,
      height: NodeHeight,
    },
    deletable: custom,
    draggable: custom,
    connectable: custom,
  }
}

// Converts a node structure back into a role doc
export const nodeToRole = node => {
  const role = $roles.find(x => x._id === node.id)
  const inherits = $edges.filter(x => x.target === node.id).map(x => x.source)
  // TODO save inherits array
  return {
    ...role,
    inherits,
    uiMetadata: {
      displayName: node.data.displayName,
      color: node.data.color,
      description: node.data.description,
    },
  }
}

// Builds a layout from an array of roles
export const rolesToLayout = roles => {
  let nodes = []
  let edges = []

  // Remove some builtins
  for (let role of roles) {
    // Add node for this role
    nodes.push(roleToNode(role))

    // Add edges for this role
    let inherits = []
    if (role.inherits) {
      inherits = Array.isArray(role.inherits) ? role.inherits : [role.inherits]
    }
    for (let sourceRole of inherits) {
      if (!roles.some(x => x._id === sourceRole)) {
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
