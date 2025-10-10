import { type Node as FlowNode, type Edge as FlowEdge } from "@xyflow/svelte"
import type { LayoutDirection } from "@budibase/types"
import { LOOP, STEP } from "./FlowGeometry"

// Shift only the subtree after a loop so that its lane clears the loop container
export const applyLoopClearance = (
  graph: { nodes: FlowNode[]; edges: FlowEdge[] },
  rankdir: LayoutDirection
) => {
  const nodesById: Record<string, FlowNode> = {}
  graph.nodes.forEach(n => (nodesById[n.id] = n))

  const outgoing: Record<string, string[]> = {}
  for (const e of graph.edges) {
    const s = nodesById[e.source]
    const t = nodesById[e.target]
    if (!s || !t) continue
    if (s.parentId || t.parentId) continue
    ;(outgoing[e.source] ||= []).push(e.target)
  }

  const visited = new Set<string>()
  const shiftSubtree = (startId: string, delta: number, axis: "x" | "y") => {
    if (delta <= 0) return
    const stack = [startId]
    while (stack.length) {
      const id = stack.pop()!
      const node = nodesById[id]
      if (!node || node.parentId) continue
      const key = `${id}:${delta}:${axis}`
      if (visited.has(key)) continue
      visited.add(key)
      node.position =
        axis === "y"
          ? { x: node.position.x, y: node.position.y + delta }
          : { x: node.position.x + delta, y: node.position.y }
      const nexts = outgoing[id] || []
      for (const nId of nexts) stack.push(nId)
    }
  }

  for (const loopNode of graph.nodes) {
    if (loopNode.parentId || loopNode.type !== "loop-subflow-node") continue
    const nexts = outgoing[loopNode.id] || []
    if (rankdir === "LR") {
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
    } else {
      const visualHeight =
        typeof loopNode?.data?.containerHeight === "number"
          ? loopNode.data.containerHeight
          : STEP.height
      const bottom = loopNode.position.y + visualHeight + LOOP.clearance
      for (const targetId of nexts) {
        const target = nodesById[targetId]
        if (!target || target.parentId) continue
        const delta = bottom - target.position.y
        if (delta > 0) shiftSubtree(targetId, delta, "y")
      }
    }
  }
}
