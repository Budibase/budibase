import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge } from "@xyflow/svelte"
import { layoutAutomationGraph } from "../FlowCanvas/AutomationFlowLayout"
import { LOOP, STEP } from "../FlowCanvas/FlowGeometry"
import {
  FLOW_NODE_TYPE,
  type FlowNode,
  type FlowNodeType,
} from "../FlowCanvas/FlowGraphTypes"
import {
  expectNodeBelow,
  expectNodeRightOf,
  getNode,
} from "./FlowTestAssertions"

const ranksep = 160
const nodesep = 120

interface BranchEdgeData {
  isBranchEdge: true
  branchStepId: string
  branchIdx: number
  [key: string]: unknown
}

const stepNode = (
  id: string,
  type: FlowNodeType = FLOW_NODE_TYPE.STEP,
  layout = STEP
): FlowNode => ({
  id,
  type,
  data: {
    layout,
    ...(type === FLOW_NODE_TYPE.LOOP_SUBFLOW
      ? {
          containerWidth: layout.width,
          containerHeight: layout.height,
        }
      : {}),
  },
  position: { x: 0, y: 0 },
})

const edge = (
  source: string,
  target: string,
  data?: BranchEdgeData
): FlowEdge => ({
  id: `edge-${source}-${target}`,
  source,
  target,
  type: "add-item",
  ...(data ? { data } : {}),
})

const layoutGraph = (graph: { nodes: FlowNode[]; edges: FlowEdge[] }) => {
  return layoutAutomationGraph(graph, {
    ranksep,
    nodesep,
    subflowNodePositions: {},
  })
}

describe("layoutAutomationGraph", () => {
  it("falls back to default horizontal spacing for non-positive rank separation", () => {
    const graph = layoutAutomationGraph(
      {
        nodes: [stepNode("first"), stepNode("second")],
        edges: [edge("first", "second")],
      },
      {
        ranksep: 0,
        nodesep,
        subflowNodePositions: {},
      }
    )

    expectNodeRightOf(graph, "second", "first", 100)
  })

  it("leaves loop clearance before the next sequential root node", () => {
    const graph = layoutGraph({
      nodes: [
        stepNode("loop", FLOW_NODE_TYPE.LOOP_SUBFLOW, {
          width: 520,
          height: 300,
        }),
        stepNode("after-loop"),
      ],
      edges: [edge("loop", "after-loop")],
    })

    expectNodeRightOf(graph, "after-loop", "loop", LOOP.clearance)
  })

  it("lays branch lanes out from their full subtree bounds", () => {
    const graph = layoutGraph({
      nodes: [
        stepNode("source"),
        stepNode("parent-0", FLOW_NODE_TYPE.BRANCH),
        stepNode("upper-action"),
        stepNode("nested-0", FLOW_NODE_TYPE.BRANCH),
        stepNode("nested-1", FLOW_NODE_TYPE.BRANCH),
        stepNode("nested-2", FLOW_NODE_TYPE.BRANCH),
        stepNode("parent-1", FLOW_NODE_TYPE.BRANCH),
        stepNode("lower-action"),
      ],
      edges: [
        edge("source", "parent-0", {
          isBranchEdge: true,
          branchStepId: "parent",
          branchIdx: 0,
        }),
        edge("parent-0", "upper-action"),
        edge("upper-action", "nested-0", {
          isBranchEdge: true,
          branchStepId: "nested",
          branchIdx: 0,
        }),
        edge("upper-action", "nested-1", {
          isBranchEdge: true,
          branchStepId: "nested",
          branchIdx: 1,
        }),
        edge("upper-action", "nested-2", {
          isBranchEdge: true,
          branchStepId: "nested",
          branchIdx: 2,
        }),
        edge("source", "parent-1", {
          isBranchEdge: true,
          branchStepId: "parent",
          branchIdx: 1,
        }),
        edge("parent-1", "lower-action"),
      ],
    })

    const upperLaneBottom = Math.max(
      getNode(graph, "parent-0").position.y + STEP.height,
      getNode(graph, "upper-action").position.y + STEP.height,
      getNode(graph, "nested-0").position.y + STEP.height,
      getNode(graph, "nested-1").position.y + STEP.height,
      getNode(graph, "nested-2").position.y + STEP.height
    )

    expect(getNode(graph, "parent-1").position.y).toBeGreaterThanOrEqual(
      upperLaneBottom + nodesep
    )
    expect(getNode(graph, "lower-action").position.y).toBe(
      getNode(graph, "parent-1").position.y
    )
  })

  it("places branch fanouts after loops below the loop container", () => {
    const graph = layoutGraph({
      nodes: [
        stepNode("loop", FLOW_NODE_TYPE.LOOP_SUBFLOW, {
          width: 700,
          height: 360,
        }),
        stepNode("branch-0", FLOW_NODE_TYPE.BRANCH),
        stepNode("branch-1", FLOW_NODE_TYPE.BRANCH),
      ],
      edges: [
        edge("loop", "branch-0", {
          isBranchEdge: true,
          branchStepId: "post-loop",
          branchIdx: 0,
        }),
        edge("loop", "branch-1", {
          isBranchEdge: true,
          branchStepId: "post-loop",
          branchIdx: 1,
        }),
      ],
    })

    expectNodeBelow(graph, "branch-0", "loop", 120)
    expectNodeBelow(graph, "branch-1", "branch-0", nodesep)
  })
})
