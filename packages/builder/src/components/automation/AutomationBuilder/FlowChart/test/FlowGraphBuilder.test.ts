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
import { renderChain } from "../FlowCanvas/renderers/FlowChainRenderer"
import { renderLoopV2Container } from "../FlowCanvas/renderers/FlowLoopRenderer"
import { buildAutomationGraph } from "../FlowCanvas/buildAutomationGraph"
import {
  FLOW_ITEM_ACTION_BAR_WIDTH,
  LOOP_INSERT_ACTION_OFFSET,
  STEP,
} from "../FlowCanvas/FlowGeometry"
import {
  expectAllEdgesResolvable,
  expectBranchEdge,
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
  subflowNodePositions: {},
})

const applySubflowNodePositions = (
  nodes: FlowNode[],
  positions: Record<string, { x: number; y: number }>
) => {
  nodes.forEach(node => {
    const position = positions[node.id]
    if (!position) return
    node.position = position
  })
}

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
  const deps = {
    xSpacing: 160,
    ySpacing: 340,
    blockRefs: {},
    newNodes: graph.nodes,
    newEdges: graph.edges,
    subflowNodePositions: {},
  }
  renderChain(chain, automationTrigger.id, automationTrigger, 0, deps)
  applySubflowNodePositions(graph.nodes, deps.subflowNodePositions)
  return graph
}

const renderTestLoop = (
  loop: Parameters<typeof renderLoopV2Container>[0],
  graph = createGraph()
) => {
  const deps = createDeps(graph)
  renderLoopV2Container(loop, deps)
  applySubflowNodePositions(graph.nodes, deps.subflowNodePositions)
  return graph
}

describe("buildAutomationGraph", () => {
  it("connects top-level automation blocks sequentially and adds a terminal anchor", () => {
    const graph = createGraph()
    const blocks = [automationTrigger, ...linearAutomationSteps()]

    buildAutomationGraph(blocks, createDeps(graph))

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    const trigger = getNode(graph, "trigger")
    const firstStep = getNode(graph, "step-1")
    const secondStep = getNode(graph, "step-2")
    const thirdStep = getNode(graph, "step-3")
    const terminal = getNode(graph, "anchor-step-3")

    expect(firstStep.position.x).toBeGreaterThan(trigger.position.x)
    expect(secondStep.position.x).toBeGreaterThan(firstStep.position.x)
    expect(thirdStep.position.x).toBeGreaterThan(secondStep.position.x)
    expect(terminal.position.x).toBeGreaterThan(thirdStep.position.x)

    getEdge(graph, "trigger", "step-1")
    getEdge(graph, "step-1", "step-2")
    getEdge(graph, "step-2", "step-3")
    getEdge(graph, "step-3", "anchor-step-3")
  })
})

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

    renderTestLoop(loop, graph)

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

    renderTestLoop(loop, graph)

    const firstNode = graph.nodes.find(node => node.id === firstStep.id)!
    const actionBarRight =
      LOOP_INSERT_ACTION_OFFSET + FLOW_ITEM_ACTION_BAR_WIDTH / 2

    expect(firstNode.position.x).toBeGreaterThan(actionBarRight)
  })

  it("connects linear loop children and exit anchor with loop insertion metadata", () => {
    const loop = loopWithLinearChildrenStep()
    const graph = createGraph()

    renderTestLoop(loop, graph)

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

    renderTestLoop(loop, graph)

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    const firstBranch = getNode(graph, "branch-loop-branch-0-first")
    const secondBranch = getNode(graph, "branch-loop-branch-1-second")
    const emptyBranch = getNode(graph, "branch-loop-branch-2-empty")
    const middleBranchEdge = getEdge(
      graph,
      "loop-before-branch",
      secondBranch.id
    )

    expect(firstBranch.parentId).toBe("loop-with-branch")
    expect(secondBranch.parentId).toBe("loop-with-branch")
    expect(emptyBranch.parentId).toBe("loop-with-branch")

    expectBranchEdge(getEdge(graph, "loop-before-branch", firstBranch.id), {
      branchStepId: "loop-branch",
      branchIdx: 0,
      branchesCount: 3,
      isSubflowEdge: true,
    })
    expect(middleBranchEdge.data).toMatchObject({
      isPrimaryEdge: true,
      branchIdx: 1,
      branchesCount: 3,
    })
    expectLoopEdge(
      getEdge(
        graph,
        "loop-branch-second-child-2",
        "anchor-branch-loop-branch-1-second"
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

    expectBranchEdge(getEdge(graph, "trigger", "branch-branch-many-0-alpha"), {
      branchStepId: "branch-many",
      branchIdx: 0,
      branchesCount: 4,
    })
    expectBranchEdge(getEdge(graph, "trigger", "branch-branch-many-3-delta"), {
      branchStepId: "branch-many",
      branchIdx: 3,
      branchesCount: 4,
    })

    getEdge(graph, "alpha-1", "alpha-2")
    getNode(graph, "anchor-alpha-2")
    getEdge(
      graph,
      "branch-branch-many-1-beta",
      "anchor-branch-branch-many-1-beta"
    )
    getEdge(graph, "delta-loop", "anchor-delta-loop")
  })

  it("renders a terminal action bar edge after a branch leaf loop fixture", () => {
    const graph = renderTestChain([branchWithManyLanesStep()])

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)

    const edge = getEdge(graph, "delta-loop", "anchor-delta-loop")
    expect(edge.data).toMatchObject({
      block: expect.objectContaining({
        id: "delta-loop",
        stepId: "LOOP_V2",
      }),
    })
    getNode(graph, "anchor-delta-loop")
  })
})
