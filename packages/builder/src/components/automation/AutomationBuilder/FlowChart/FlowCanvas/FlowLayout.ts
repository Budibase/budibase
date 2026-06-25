import { type Node as FlowNode, type Edge as FlowEdge } from "@xyflow/svelte"
import { ANCHOR, BRANCH, JUNCTION_ANCHOR, LOOP, STEP } from "./FlowGeometry"

const BRANCH_LANE_CLEARANCE = 120
const POST_LOOP_BRANCH_CLEARANCE = 120
const MERGE_JUNCTION_CLEARANCE = 80
const MERGE_JUNCTION_INBOUND_TIGHTENING = 80
const VISIBLE_STEP_HANDLE_CENTER_Y = 30

const getTopLevelGraph = (graph: { nodes: FlowNode[]; edges: FlowEdge[] }) => {
  const nodesById: Record<string, FlowNode> = {}
  graph.nodes.forEach(node => (nodesById[node.id] = node))

  const outgoing: Record<string, string[]> = {}
  const incoming: Record<string, string[]> = {}
  for (const edge of graph.edges) {
    const source = nodesById[edge.source]
    const target = nodesById[edge.target]
    if (!source || !target) continue
    if (source.parentId || target.parentId) continue
    ;(outgoing[edge.source] ||= []).push(edge.target)
    ;(incoming[edge.target] ||= []).push(edge.source)
  }

  return { nodesById, outgoing, incoming }
}

const getNodeHeight = (node: FlowNode) => {
  if (node.type === "loop-subflow-node") {
    return typeof node.data?.containerHeight === "number"
      ? node.data.containerHeight
      : LOOP.minHeight
  }
  if (node.type === "branch-node") {
    return BRANCH.height
  }
  if (node.type === "anchor-node") {
    if (node.data?.variant === "junction") {
      return JUNCTION_ANCHOR.height
    }
    return ANCHOR.height
  }
  return STEP.height
}

const collectSubtree = (
  startId: string,
  nodesById: Record<string, FlowNode>,
  outgoing: Record<string, string[]>,
  blockedIds: Set<string> = new Set()
) => {
  const ids = new Set<string>()
  const stack = [startId]
  while (stack.length) {
    const id = stack.pop()!
    const node = nodesById[id]
    if (!node || node.parentId || ids.has(id)) continue
    if (id !== startId && blockedIds.has(id)) continue
    ids.add(id)
    for (const nextId of outgoing[id] || []) {
      stack.push(nextId)
    }
  }
  return ids
}

const shiftNodes = (
  ids: Set<string>,
  nodesById: Record<string, FlowNode>,
  delta: number,
  axis: "x" | "y"
) => {
  if (delta === 0) return
  for (const id of ids) {
    const node = nodesById[id]
    if (!node || node.parentId) continue
    node.position =
      axis === "y"
        ? { x: node.position.x, y: node.position.y + delta }
        : { x: node.position.x + delta, y: node.position.y }
  }
}

const positionsChanged = (
  before: Record<string, { x: number; y: number }>,
  nodesById: Record<string, FlowNode>
) => {
  return Object.entries(before).some(([id, position]) => {
    const node = nodesById[id]
    return (
      !!node &&
      (node.position.x !== position.x || node.position.y !== position.y)
    )
  })
}

const getSubtreeBounds = (
  ids: Set<string>,
  nodesById: Record<string, FlowNode>
) => {
  let top = Infinity
  let bottom = -Infinity
  for (const id of ids) {
    const node = nodesById[id]
    if (!node || node.parentId) continue
    top = Math.min(top, node.position.y)
    bottom = Math.max(bottom, node.position.y + getNodeHeight(node))
  }
  return { top, bottom }
}

// Shift only the subtree after a loop so that its lane clears the loop container
export const applyLoopClearance = (graph: {
  nodes: FlowNode[]
  edges: FlowEdge[]
}) => {
  const { nodesById, outgoing } = getTopLevelGraph(graph)

  const shiftSubtree = (startId: string, delta: number, axis: "x" | "y") => {
    if (delta <= 0) return
    const ids = collectSubtree(startId, nodesById, outgoing)
    shiftNodes(ids, nodesById, delta, axis)
  }

  for (const loopNode of graph.nodes) {
    if (loopNode.parentId || loopNode.type !== "loop-subflow-node") continue
    const nexts = outgoing[loopNode.id] || []
    const visualWidth =
      typeof loopNode?.data?.containerWidth === "number"
        ? loopNode.data.containerWidth
        : STEP.width
    const right = loopNode.position.x + visualWidth + LOOP.clearance
    for (const targetId of nexts) {
      const target = nodesById[targetId]
      if (!target || target.parentId) continue
      const delta = right - target.position.x
      if (delta > 0) shiftSubtree(targetId, delta, "x")
    }
  }
}

export const applyBranchLaneClearance = (graph: {
  nodes: FlowNode[]
  edges: FlowEdge[]
}) => {
  const { nodesById, outgoing, incoming } = getTopLevelGraph(graph)
  const convergenceIds = new Set(
    Object.entries(incoming)
      .filter(([, sourceIds]) => sourceIds.length > 1)
      .map(([targetId]) => targetId)
  )
  const branchGroups: Record<
    string,
    Array<{ branchIdx: number; nodeId: string }>
  > = {}

  for (const edge of graph.edges) {
    const data = edge.data as Record<string, unknown> | undefined
    if (data?.isBranchEdge !== true || data?.isSubflowEdge === true) {
      continue
    }
    if (typeof data.branchStepId !== "string") {
      continue
    }
    const target = nodesById[edge.target]
    if (!target || target.parentId || target.type !== "branch-node") {
      continue
    }
    ;(branchGroups[data.branchStepId] ||= []).push({
      branchIdx: typeof data.branchIdx === "number" ? data.branchIdx : 0,
      nodeId: edge.target,
    })
  }

  const groups = Object.values(branchGroups)
    .filter(branches => branches.length >= 2)
    .map(branches => branches.sort((a, b) => a.branchIdx - b.branchIdx))

  const applyClearancePass = () => {
    for (const branches of groups) {
      const siblingIds = new Set(branches.map(branch => branch.nodeId))
      const branchLanes = branches.map(branch => {
        const blockedIds = new Set([...siblingIds, ...convergenceIds])
        blockedIds.delete(branch.nodeId)
        const subtreeIds = collectSubtree(
          branch.nodeId,
          nodesById,
          outgoing,
          blockedIds
        )
        return {
          ...branch,
          subtreeIds,
          bounds: getSubtreeBounds(subtreeIds, nodesById),
        }
      })

      const shiftBranchLane = (
        lane: (typeof branchLanes)[number],
        delta: number
      ) => {
        shiftNodes(lane.subtreeIds, nodesById, delta, "y")
        lane.bounds.top += delta
        lane.bounds.bottom += delta
      }

      const primaryIndex = Math.floor((branchLanes.length - 1) / 2)

      for (let i = primaryIndex - 1; i >= 0; i--) {
        const lane = branchLanes[i]
        const lowerLane = branchLanes[i + 1]
        const delta =
          lowerLane.bounds.top - BRANCH_LANE_CLEARANCE - lane.bounds.bottom
        shiftBranchLane(lane, delta)
      }

      for (let i = primaryIndex + 1; i < branchLanes.length; i++) {
        const lane = branchLanes[i]
        const upperLane = branchLanes[i - 1]
        const delta =
          upperLane.bounds.bottom + BRANCH_LANE_CLEARANCE - lane.bounds.top
        shiftBranchLane(lane, delta)
      }
    }
  }

  for (let i = 0; i < groups.length; i++) {
    const before = Object.fromEntries(
      graph.nodes.map(node => [node.id, { ...node.position }])
    )
    applyClearancePass()
    if (!positionsChanged(before, nodesById)) {
      break
    }
  }
}

export const applyMergeJunctionClearance = (graph: {
  nodes: FlowNode[]
  edges: FlowEdge[]
}) => {
  const { nodesById, outgoing } = getTopLevelGraph(graph)

  graph.edges.forEach(edge => {
    const data = edge.data as Record<string, unknown> | undefined
    if (data?.mergeJunctionEdge !== true) {
      return
    }

    const source = nodesById[edge.source]
    const target = nodesById[edge.target]
    if (!source || !target || source.parentId || target.parentId) {
      return
    }

    const hasIncomingMergeBranches = graph.edges.some(
      incomingEdge => incomingEdge.target === source.id
    )
    const targetCenterY = target.position.y + VISIBLE_STEP_HANDLE_CENTER_Y
    source.position = {
      x: hasIncomingMergeBranches
        ? source.position.x - MERGE_JUNCTION_INBOUND_TIGHTENING
        : source.position.x,
      y: targetCenterY - getNodeHeight(source) / 2,
    }

    const targetX = source.position.x + MERGE_JUNCTION_CLEARANCE
    const delta = targetX - target.position.x
    if (delta === 0) {
      return
    }

    shiftNodes(
      collectSubtree(target.id, nodesById, outgoing),
      nodesById,
      delta,
      "x"
    )
  })
}

export const applyPostLoopBranchClearance = (graph: {
  nodes: FlowNode[]
  edges: FlowEdge[]
}) => {
  const { nodesById, outgoing } = getTopLevelGraph(graph)
  const branchTargetsByLoop: Record<
    string,
    Record<string, Array<{ branchIdx: number; nodeId: string }>>
  > = {}

  for (const edge of graph.edges) {
    const source = nodesById[edge.source]
    const target = nodesById[edge.target]
    const data = edge.data as Record<string, unknown> | undefined
    if (
      !source ||
      !target ||
      source.parentId ||
      target.parentId ||
      source.type !== "loop-subflow-node" ||
      target.type !== "branch-node" ||
      data?.isBranchEdge !== true ||
      data?.isSubflowEdge === true ||
      typeof data.branchStepId !== "string"
    ) {
      continue
    }

    const loopGroups = (branchTargetsByLoop[source.id] ||= {})
    ;(loopGroups[data.branchStepId] ||= []).push({
      branchIdx: typeof data.branchIdx === "number" ? data.branchIdx : 0,
      nodeId: target.id,
    })
  }

  for (const [loopId, branchGroups] of Object.entries(branchTargetsByLoop)) {
    const loopNode = nodesById[loopId]
    if (!loopNode) {
      continue
    }

    const loopBottom = loopNode.position.y + getNodeHeight(loopNode)

    for (const branches of Object.values(branchGroups)) {
      const siblingIds = new Set(branches.map(branch => branch.nodeId))
      const fanoutIds = new Set<string>()

      for (const branch of branches) {
        const blockedIds = new Set(siblingIds)
        blockedIds.delete(branch.nodeId)
        collectSubtree(branch.nodeId, nodesById, outgoing, blockedIds).forEach(
          id => fanoutIds.add(id)
        )
      }

      const bounds = getSubtreeBounds(fanoutIds, nodesById)
      const delta = loopBottom + POST_LOOP_BRANCH_CLEARANCE - bounds.top

      if (delta > 0) {
        shiftNodes(fanoutIds, nodesById, delta, "y")
      }
    }
  }
}
