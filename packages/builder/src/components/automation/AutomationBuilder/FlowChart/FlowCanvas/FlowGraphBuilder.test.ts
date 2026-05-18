import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import { branchStep, loopStep, serverLogStep } from "@/test/automationFixtures"
import { renderLoopV2Container } from "./FlowGraphBuilder"
import {
  FLOW_ITEM_ACTION_BAR_WIDTH,
  LOOP_INSERT_ACTION_OFFSET,
  STEP,
} from "./FlowGeometry"

describe("renderLoopV2Container", () => {
  it("reserves exit space after the final child in mixed loop subflows", () => {
    const finalStep = serverLogStep("final-step")
    const loop = loopStep([
      serverLogStep("first-step"),
      branchStep(),
      finalStep,
    ])
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [],
      edges: [],
    }

    renderLoopV2Container(loop, 0, 0, {
      xSpacing: 0,
      ySpacing: 340,
      blockRefs: {},
      newNodes: graph.nodes,
      newEdges: graph.edges,
    })

    const loopNode = graph.nodes.find(node => node.id === loop.id)!
    const finalNode = graph.nodes.find(node => node.id === finalStep.id)!
    const finalNodeRight = finalNode.position.x + STEP.width

    expect(loopNode.data.containerWidth).toBeGreaterThanOrEqual(
      finalNodeRight + LOOP_INSERT_ACTION_OFFSET * 2
    )
  })

  it("places the first loop child after the insert action bar", () => {
    const firstStep = serverLogStep("first-step")
    const loop = loopStep([firstStep])
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [],
      edges: [],
    }

    renderLoopV2Container(loop, 0, 0, {
      xSpacing: 0,
      ySpacing: 340,
      blockRefs: {},
      newNodes: graph.nodes,
      newEdges: graph.edges,
    })

    const firstNode = graph.nodes.find(node => node.id === firstStep.id)!
    const actionBarRight =
      LOOP_INSERT_ACTION_OFFSET + FLOW_ITEM_ACTION_BAR_WIDTH / 2

    expect(firstNode.position.x).toBeGreaterThan(actionBarRight)
  })
})
