import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import {
  automationTrigger,
  branchStep,
  branchWithManyLanesStep,
  linearAutomationSteps,
  loopStep,
  loopWithBranchChildStep,
  loopWithLinearChildrenStep,
  serverLogStep,
} from "@/test/automationFixtures"
import {
  renderChain,
  renderLoopV2Container,
} from "../FlowCanvas/FlowGraphBuilder"
import {
  FLOW_ITEM_ACTION_BAR_WIDTH,
  LOOP_INSERT_ACTION_OFFSET,
  STEP,
} from "../FlowCanvas/FlowGeometry"
import {
  expectAllEdgesResolvable,
  expectLoopEdge,
  expectSubflowNodesInsideParent,
  expectUniqueGraphIds,
  getEdge,
  getNode,
} from "../FlowCanvas/FlowTestAssertions"

const createGraph = () => ({
  nodes: [] as FlowNode[],
  edges: [] as FlowEdge[],
})

const createDeps = (graph: { nodes: FlowNode[]; edges: FlowEdge[] }) => ({
  xSpacing: 160,
  ySpacing: 340,
  blockRefs: {},
  newNodes: graph.nodes,
  newEdges: graph.edges,
  layoutDirection: "LR" as const,
})

const renderTestChain = (
  chain: Parameters<typeof renderChain>[0],
  graph = createGraph()
) => {
  graph.nodes.push({
    id: automationTrigger.id,
    type: "step-node",
    data: { block: automationTrigger },
    position: { x: 0, y: -340 },
  })
  renderChain(chain, automationTrigger.id, automationTrigger, 0, 0, {
    xSpacing: 160,
    ySpacing: 340,
    blockRefs: {},
    newNodes: graph.nodes,
    newEdges: graph.edges,
    layoutDirection: "LR",
  })
  return graph
}

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

    renderLoopV2Container(loop, 0, 0, createDeps(graph))

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

    renderLoopV2Container(loop, 0, 0, createDeps(graph))

    const firstNode = graph.nodes.find(node => node.id === firstStep.id)!
    const actionBarRight =
      LOOP_INSERT_ACTION_OFFSET + FLOW_ITEM_ACTION_BAR_WIDTH / 2

    expect(firstNode.position.x).toBeGreaterThan(actionBarRight)
  })

  it("connects linear loop children and exit anchor with loop insertion metadata", () => {
    const loop = loopWithLinearChildrenStep()
    const graph = createGraph()

    renderLoopV2Container(loop, 0, 0, createDeps(graph))

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    expect(getNode(graph, "linear-loop").type).toBe("loop-subflow-node")
    expect(getNode(graph, "loop-child-1").parentId).toBe("linear-loop")
    expect(getNode(graph, "loop-child-2").parentId).toBe("linear-loop")
    expect(getNode(graph, "loop-child-3").parentId).toBe("linear-loop")

    expectLoopEdge(getEdge(graph, "loop-child-1", "loop-child-2"), {
      loopStepId: "linear-loop",
      loopChildInsertIndex: 1,
    })
    expectLoopEdge(getEdge(graph, "loop-child-2", "loop-child-3"), {
      loopStepId: "linear-loop",
      loopChildInsertIndex: 2,
    })
    expectLoopEdge(
      getEdge(graph, "loop-child-3", "anchor-linear-loop-loop-loop-child-3"),
      {
        loopStepId: "linear-loop",
        loopChildInsertIndex: 3,
      }
    )
    expectSubflowNodesInsideParent(graph)
  })

  it("renders branch children inside loops as subflow branch lanes with anchors", () => {
    const loop = loopWithBranchChildStep()
    const graph = createGraph()

    renderLoopV2Container(loop, 0, 0, createDeps(graph))

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    const switchNode = getNode(graph, "loop-branch")

    expect(switchNode.parentId).toBe("loop-with-branch")

    expectLoopEdge(getEdge(graph, "loop-before-branch", switchNode.id), {
      loopStepId: "loop-with-branch",
      loopChildInsertIndex: 1,
    })
    expectLoopEdge(getEdge(graph, "loop-branch", "loop-branch-first-child"), {
      loopStepId: "loop-with-branch",
      loopChildInsertIndex: 1,
    })
    expectLoopEdge(
      getEdge(
        graph,
        "loop-branch-second-child-2",
        "anchor-loop-branch-1-second"
      ),
      {
        loopStepId: "loop-with-branch",
        loopChildInsertIndex: 1,
      }
    )
    expectLoopEdge(
      getEdge(
        graph,
        "loop-after-branch",
        "anchor-loop-with-branch-loop-loop-after-branch"
      ),
      {
        loopStepId: "loop-with-branch",
        loopChildInsertIndex: 3,
      }
    )
    expectSubflowNodesInsideParent(graph)
  })
})

describe("renderChain", () => {
  it("renders linear automation steps with resolvable sequential edges", () => {
    const graph = renderTestChain(linearAutomationSteps())

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    expect(getNode(graph, "step-1").position.y).toBe(0)
    expect(getNode(graph, "step-2").position.y).toBe(340)
    expect(getNode(graph, "step-3").position.y).toBe(680)
    expect(getEdge(graph, "trigger", "step-1").data).toMatchObject({
      block: automationTrigger,
    })
    getEdge(graph, "step-1", "step-2")
    getEdge(graph, "step-2", "step-3")
  })

  it("renders top-level branch lanes with terminal anchors for empty and linear lanes", () => {
    const branch = branchWithManyLanesStep()
    const graph = renderTestChain([branch])

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    getEdge(graph, "trigger", "branch-many")

    getEdge(graph, "branch-many", "alpha-1")
    getEdge(graph, "alpha-1", "alpha-2")
    getNode(graph, "anchor-branch-many-0-alpha")
    getEdge(graph, "branch-many", "anchor-branch-many-1-beta")
    getEdge(graph, "delta-loop", "anchor-branch-many-3-delta")
  })

  it("renders a terminal action bar edge after a branch leaf loop fixture", () => {
    const graph = renderTestChain([branchWithManyLanesStep()])

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    const edge = getEdge(graph, "delta-loop", "anchor-branch-many-3-delta")
    expect(edge.data).toMatchObject({
      block: expect.objectContaining({
        id: "delta-loop",
        stepId: "LOOP_V2",
      }),
    })
    getNode(graph, "anchor-branch-many-3-delta")
  })
})
