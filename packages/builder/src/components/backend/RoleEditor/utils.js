import dagre from "@dagrejs/dagre"
import {
  NodeWidth,
  NodeHeight,
  GridResolution,
  NodeHSpacing,
  NodeVSpacing,
  MinHeight,
  EmptyStateID,
} from "./constants"
import { getNodesBounds, Position } from "@xyflow/svelte"
import { Roles } from "@/constants/backend"
import { roles } from "@/stores/builder"
import { get } from "svelte/store"

// Calculates the bounds of all custom nodes
export const getBounds = nodes => {
  const interactiveNodes = nodes.filter(node => node.data.interactive)

  // Empty state bounds which line up with bounds after adding first node
  if (!interactiveNodes.length) {
    return {
      x: 0,
      y: -3.5 * GridResolution,
      width: 12 * GridResolution,
      height: 10 * GridResolution,
    }
  }
  let bounds = getNodesBounds(interactiveNodes)

  // Enforce a min size
  if (bounds.height < MinHeight) {
    const diff = MinHeight - bounds.height
    bounds.height = MinHeight
    bounds.y -= diff / 2
  }
  return bounds
}

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

// Filters out invalid nodes and edges
const preProcessLayout = ({ nodes, edges }) => {
  const ignoredIds = [Roles.PUBLIC, Roles.BASIC, Roles.ADMIN, EmptyStateID]
  const targetlessIds = [Roles.POWER]
  return {
    nodes: nodes.filter(node => {
      // Filter out ignored IDs
      if (ignoredIds.includes(node.id)) {
        return false
      }
      return true
    }),
    edges: edges.filter(edge => {
      // Filter out edges from ignored IDs
      if (
        ignoredIds.includes(edge.source) ||
        ignoredIds.includes(edge.target)
      ) {
        return false
      }
      // Filter out edges which have the same source and target
      if (edge.source === edge.target) {
        return false
      }
      // Filter out edges which target targetless roles
      if (targetlessIds.includes(edge.target)) {
        return false
      }
      return true
    }),
  }
}

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
  return { nodes, edges }
}

const postProcessLayout = ({ nodes, edges }) => {
  // Add basic and admin nodes at each edge
  const bounds = getBounds(nodes)
  const $roles = get(roles)
  nodes.push({
    ...roleToNode($roles.find(role => role._id === Roles.BASIC)),
    position: getBasicPosition(bounds),
  })
  nodes.push({
    ...roleToNode($roles.find(role => role._id === Roles.ADMIN)),
    position: getAdminPosition(bounds),
  })

  // Add custom edges for basic and admin brackets
  edges.push({
    id: "basic-bracket",
    source: Roles.BASIC,
    target: Roles.ADMIN,
    type: "bracket",
  })
  edges.push({
    id: "admin-bracket",
    source: Roles.ADMIN,
    target: Roles.BASIC,
    type: "bracket",
  })

  // Add empty state node if required
  if (!nodes.some(node => node.data.interactive)) {
    nodes.push({
      id: EmptyStateID,
      type: "empty",
      position: {
        x: bounds.x + bounds.width / 2 - NodeWidth / 2,
        y: bounds.y + bounds.height / 2 - NodeHeight / 2,
      },
      data: {},
      measured: {
        width: NodeWidth,
        height: NodeHeight,
      },
      deletable: false,
      draggable: false,
      connectable: false,
      selectable: false,
    })
  }

  return { nodes, edges }
}

// Automatically lays out the graph, sanitising and enriching the structure
export const autoLayout = ({ nodes, edges }) => {
  return postProcessLayout(dagreLayout(preProcessLayout({ nodes, edges })))
}

// Converts a role doc into a node structure
export const roleToNode = role => {
  const custom = ![
    Roles.PUBLIC,
    Roles.BASIC,
    Roles.POWER,
    Roles.ADMIN,
    Roles.BUILDER,
  ].includes(role._id)
  const interactive = custom || role._id === Roles.POWER
  return {
    id: role._id,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "role",
    position: { x: 0, y: 0 },
    data: {
      ...role.uiMetadata,
      custom,
      interactive,
    },
    measured: {
      width: NodeWidth,
      height: NodeHeight,
    },
    deletable: custom,
    draggable: interactive,
    connectable: interactive,
    selectable: interactive,
  }
}

// Converts a node structure back into a role doc
export const nodeToRole = ({ node, edges }) => ({
  ...get(roles).find(role => role._id === node.id),
  inherits: edges
    .filter(x => x.target === node.id)
    .map(x => x.source)
    .concat(Roles.BASIC),
  uiMetadata: {
    displayName: node.data.displayName,
    color: node.data.color,
    description: node.data.description,
  },
})

// Builds a default layout from an array of roles
export const rolesToLayout = roles => {
  let nodes = []
  let edges = []

  // Add all nodes and edges
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
