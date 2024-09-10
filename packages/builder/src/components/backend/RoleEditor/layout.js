import dagre from "@dagrejs/dagre"
import { NodeWidth, NodeHeight } from "./constants"
import { Position } from "@xyflow/svelte"
import { roles } from "stores/builder"
import { Roles } from "constants/backend"
import { get } from "svelte/store"

export const initialLayout = () => {
  const builtins = [Roles.BASIC, Roles.POWER, Roles.ADMIN]
  const descriptions = {
    [Roles.BASIC]: "Basic user",
    [Roles.POWER]: "Power user",
    [Roles.ADMIN]: "Can do everything",
  }
  const $roles = get(roles)
  const nodes = builtins
    .map(roleId => {
      return {
        id: roleId,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "role",
        data: {
          label: $roles.find(x => x._id === roleId)?.name,
          description: descriptions[roleId],
        },
      }
    })
    .concat([
      {
        id: "management",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "role",
        data: {
          label: "Management",
          description: "Custom role",
          custom: true,
        },
      },
      {
        id: "approver",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "role",
        data: {
          label: "Approver",
          description: "Custom role",
          custom: true,
        },
      },
      {
        id: "engineer",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "role",
        data: {
          label: "Engineer",
          description: "Custom role",
          custom: true,
        },
      },
    ])

  let edges = []
  const link = (source, target) => {
    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      animated: true,
      // markerEnd: {
      //   type: MarkerType.ArrowClosed,
      //   width: 16,
      //   height: 16,
      // },
    })
  }

  link(Roles.BASIC, "engineer")
  link(Roles.BASIC, "approver")

  link("engineer", Roles.POWER)
  link("approver", "management")

  link(Roles.POWER, Roles.ADMIN)
  link("management", Roles.ADMIN)

  return {
    nodes,
    edges,
  }
}

export const dagreLayout = ({ nodes, edges }) => {
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
