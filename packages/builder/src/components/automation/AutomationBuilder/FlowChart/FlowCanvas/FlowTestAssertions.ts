import { expect } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import { ANCHOR, BRANCH, JUNCTION_ANCHOR, LOOP, STEP } from "./FlowGeometry"

export interface FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export const getNode = (graph: FlowGraph, id: string) => {
  const node = graph.nodes.find(node => node.id === id)
  expect(node, `Expected node "${id}" to exist`).toBeDefined()
  return node!
}

export const getEdge = (graph: FlowGraph, source: string, target: string) => {
  const edge = graph.edges.find(
    edge => edge.source === source && edge.target === target
  )
  expect(
    edge,
    `Expected edge "${source}" -> "${target}" to exist`
  ).toBeDefined()
  return edge!
}

export const getNodeHeight = (node: FlowNode) => {
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

export const getNodeWidth = (node: FlowNode) => {
  if (node.type === "loop-subflow-node") {
    return typeof node.data?.containerWidth === "number"
      ? node.data.containerWidth
      : STEP.width
  }
  if (node.type === "anchor-node") {
    if (node.data?.variant === "junction") {
      return JUNCTION_ANCHOR.width
    }
    return ANCHOR.width
  }
  return STEP.width
}

const getContainedNodeWidth = (node: FlowNode) =>
  node.type === "anchor-node" ? 0 : getNodeWidth(node)

const getContainedNodeHeight = (node: FlowNode) =>
  node.type === "anchor-node" ? 0 : getNodeHeight(node)

export const expectAllEdgesResolvable = (graph: FlowGraph) => {
  const ids = new Set(graph.nodes.map(node => node.id))

  for (const edge of graph.edges) {
    expect(ids.has(edge.source), `Missing edge source "${edge.source}"`).toBe(
      true
    )
    expect(ids.has(edge.target), `Missing edge target "${edge.target}"`).toBe(
      true
    )
  }
}

export const expectUniqueGraphIds = (graph: FlowGraph) => {
  const nodeIds = graph.nodes.map(node => node.id)
  const edgeIds = graph.edges.map(edge => edge.id)

  expect(new Set(nodeIds).size).toBe(nodeIds.length)
  expect(new Set(edgeIds).size).toBe(edgeIds.length)
}

export const expectNodeRightOf = (
  graph: FlowGraph,
  rightNodeId: string,
  leftNodeId: string,
  clearance = 0
) => {
  const rightNode = getNode(graph, rightNodeId)
  const leftNode = getNode(graph, leftNodeId)
  const leftRight = leftNode.position.x + getNodeWidth(leftNode)

  expect(rightNode.position.x).toBeGreaterThanOrEqual(leftRight + clearance)
}

export const expectNodeBelow = (
  graph: FlowGraph,
  lowerNodeId: string,
  upperNodeId: string,
  clearance = 0
) => {
  const lowerNode = getNode(graph, lowerNodeId)
  const upperNode = getNode(graph, upperNodeId)
  const upperBottom = upperNode.position.y + getNodeHeight(upperNode)

  expect(lowerNode.position.y).toBeGreaterThanOrEqual(upperBottom + clearance)
}

export const expectSubflowNodesInsideParent = (graph: FlowGraph) => {
  for (const node of graph.nodes) {
    if (!node.parentId) {
      continue
    }

    const parent = getNode(graph, node.parentId)
    expect(node.position.x).toBeGreaterThanOrEqual(0)
    expect(node.position.y).toBeGreaterThanOrEqual(0)
    expect(node.position.x + getContainedNodeWidth(node)).toBeLessThanOrEqual(
      getNodeWidth(parent)
    )
    expect(node.position.y + getContainedNodeHeight(node)).toBeLessThanOrEqual(
      getNodeHeight(parent)
    )
  }
}

export const expectBranchEdge = (
  edge: FlowEdge,
  expected: {
    branchStepId: string
    branchIdx: number
    branchesCount?: number
    isSubflowEdge?: boolean
  }
) => {
  expect(edge.data).toMatchObject({
    isBranchEdge: true,
    branchStepId: expected.branchStepId,
    branchIdx: expected.branchIdx,
  })
  if (typeof expected.branchesCount === "number") {
    expect(edge.data).toMatchObject({ branchesCount: expected.branchesCount })
  }
  if (expected.isSubflowEdge) {
    expect(edge.data).toMatchObject({ isSubflowEdge: true })
  }
}

export const expectLoopEdge = (
  edge: FlowEdge,
  expected: {
    loopStepId: string
    loopChildInsertIndex: number
  }
) => {
  expect(edge.data).toMatchObject({
    insertIntoLoopV2: true,
    loopStepId: expected.loopStepId,
    loopChildInsertIndex: expected.loopChildInsertIndex,
  })
}
