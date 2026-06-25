import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import {
  applyBranchLaneClearance,
  applyLoopClearance,
  applyMergeJunctionClearance,
  applyPostLoopBranchClearance,
} from "../FlowCanvas/FlowLayout"
import {
  BRANCH,
  FLOW_ITEM_ACTION_BAR_WIDTH,
  LOOP,
  LOOP_INSERT_ACTION_OFFSET,
} from "../FlowCanvas/FlowGeometry"
import {
  expectNodeBelow,
  expectNodeRightOf,
  getNode,
} from "../FlowCanvas/FlowTestAssertions"

const cloneGraph = (graph: { nodes: FlowNode[]; edges: FlowEdge[] }) =>
  JSON.parse(JSON.stringify(graph)) as { nodes: FlowNode[]; edges: FlowEdge[] }

describe("applyLoopClearance", () => {
  it("leaves enough room for the add action bar after loop subflows", () => {
    const loopWidth = 520
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "branch",
          type: "branch-node",
          data: {},
          position: { x: 0, y: 0 },
        },
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: loopWidth },
          position: { x: 400, y: 0 },
        },
        {
          id: "delay",
          type: "step-node",
          data: {},
          position: { x: 600, y: 0 },
        },
      ],
      edges: [
        {
          id: "edge-branch-loop",
          source: "branch",
          target: "loop",
          type: "add-item",
        },
        {
          id: "edge-loop-delay",
          source: "loop",
          target: "delay",
          type: "add-item",
        },
      ],
    }

    applyLoopClearance(graph)

    const loopNode = graph.nodes.find(node => node.id === "loop")!
    const delayNode = graph.nodes.find(node => node.id === "delay")!
    const loopRight = loopNode.position.x + loopWidth
    const actionBarRight =
      loopRight + LOOP_INSERT_ACTION_OFFSET + FLOW_ITEM_ACTION_BAR_WIDTH / 2

    expect(delayNode.position.x).toBe(loopRight + LOOP.clearance)
    expect(actionBarRight).toBeLessThan(delayNode.position.x)
  })

  it("moves the whole subtree after a loop by the same horizontal delta", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: 520 },
          position: { x: 0, y: 0 },
        },
        {
          id: "after-loop",
          type: "step-node",
          data: {},
          position: { x: 300, y: 0 },
        },
        {
          id: "tail",
          type: "step-node",
          data: {},
          position: { x: 300, y: 340 },
        },
      ],
      edges: [
        {
          id: "edge-loop-after-loop",
          source: "loop",
          target: "after-loop",
          type: "add-item",
        },
        {
          id: "edge-after-loop-tail",
          source: "after-loop",
          target: "tail",
          type: "add-item",
        },
      ],
    }

    applyLoopClearance(graph)

    expectNodeRightOf(graph, "after-loop", "loop", LOOP.clearance)
    expect(getNode(graph, "tail").position.x).toBe(
      getNode(graph, "after-loop").position.x
    )
  })

  it("applies clearance to a later loop after shifting it with an earlier loop", () => {
    const loopWidth = 520
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop-1",
          type: "loop-subflow-node",
          data: { containerWidth: loopWidth },
          position: { x: 0, y: 0 },
        },
        {
          id: "loop-2",
          type: "loop-subflow-node",
          data: { containerWidth: loopWidth },
          position: { x: loopWidth, y: 0 },
        },
        {
          id: "after-loop-2",
          type: "step-node",
          data: {},
          position: { x: loopWidth * 2, y: 0 },
        },
      ],
      edges: [
        {
          id: "edge-loop-1-loop-2",
          source: "loop-1",
          target: "loop-2",
          type: "add-item",
        },
        {
          id: "edge-loop-2-after-loop-2",
          source: "loop-2",
          target: "after-loop-2",
          type: "add-item",
        },
      ],
    }

    applyLoopClearance(graph)

    const loop2 = graph.nodes.find(node => node.id === "loop-2")!
    const afterLoop2 = graph.nodes.find(node => node.id === "after-loop-2")!
    const loop2Right = loop2.position.x + loopWidth

    expect(afterLoop2.position.x).toBe(loop2Right + LOOP.clearance)
  })

  it("ignores loop edges inside subflow containers", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: 520 },
          position: { x: 0, y: 0 },
        },
        {
          id: "inner-child",
          parentId: "loop",
          type: "step-node",
          data: {},
          position: { x: 80, y: 90 },
        },
        {
          id: "inner-anchor",
          parentId: "loop",
          type: "anchor-node",
          data: {},
          position: { x: 200, y: 90 },
        },
      ],
      edges: [
        {
          id: "edge-inner-child-inner-anchor",
          source: "inner-child",
          target: "inner-anchor",
          type: "add-item",
        },
      ],
    }

    applyLoopClearance(graph)

    expect(getNode(graph, "inner-anchor").position.x).toBe(200)
  })

  it("is deterministic for repeated runs against the same graph shape", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop-1",
          type: "loop-subflow-node",
          data: { containerWidth: 520 },
          position: { x: 0, y: 0 },
        },
        {
          id: "loop-2",
          type: "loop-subflow-node",
          data: { containerWidth: 480 },
          position: { x: 400, y: 0 },
        },
        {
          id: "tail",
          type: "step-node",
          data: {},
          position: { x: 800, y: 0 },
        },
      ],
      edges: [
        {
          id: "edge-loop-1-loop-2",
          source: "loop-1",
          target: "loop-2",
          type: "add-item",
        },
        {
          id: "edge-loop-2-tail",
          source: "loop-2",
          target: "tail",
          type: "add-item",
        },
      ],
    }
    const first = cloneGraph(graph)
    const second = cloneGraph(graph)

    applyLoopClearance(first)
    applyLoopClearance(second)

    expect(second.nodes).toEqual(first.nodes)
  })
})

describe("applyBranchLaneClearance", () => {
  it("shifts branch descendants with their lane and leaves sibling lanes independent", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "source",
          type: "step-node",
          data: {},
          position: { x: 0, y: 0 },
        },
        {
          id: "branch-0",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 0 },
        },
        {
          id: "branch-0-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 0 },
        },
        {
          id: "branch-1",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 20 },
        },
        {
          id: "branch-1-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 20 },
        },
      ],
      edges: [
        {
          id: "edge-source-branch-0",
          source: "source",
          target: "branch-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 0,
          },
        },
        {
          id: "edge-branch-0-child",
          source: "branch-0",
          target: "branch-0-child",
          type: "add-item",
        },
        {
          id: "edge-source-branch-1",
          source: "source",
          target: "branch-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 1,
          },
        },
        {
          id: "edge-branch-1-child",
          source: "branch-1",
          target: "branch-1-child",
          type: "add-item",
        },
      ],
    }

    applyBranchLaneClearance(graph)

    expectNodeBelow(graph, "branch-1", "branch-0", 120)
    expect(getNode(graph, "branch-1-child").position.y).toBe(
      getNode(graph, "branch-1").position.y
    )
    expect(getNode(graph, "branch-0-child").position.y).toBe(0)
  })

  it("keeps the middle lane aligned with the source path for odd branch counts", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "source",
          type: "step-node",
          data: {},
          position: { x: 0, y: 100 },
        },
        {
          id: "branch-0",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 100 },
        },
        {
          id: "branch-1",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 100 },
        },
        {
          id: "branch-1-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 100 },
        },
        {
          id: "branch-2",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 100 },
        },
      ],
      edges: [
        {
          id: "edge-source-branch-0",
          source: "source",
          target: "branch-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 0,
          },
        },
        {
          id: "edge-source-branch-1",
          source: "source",
          target: "branch-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 1,
          },
        },
        {
          id: "edge-branch-1-child",
          source: "branch-1",
          target: "branch-1-child",
          type: "add-item",
        },
        {
          id: "edge-source-branch-2",
          source: "source",
          target: "branch-2",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 2,
          },
        },
      ],
    }

    applyBranchLaneClearance(graph)

    expect(getNode(graph, "branch-1").position.y).toBe(
      getNode(graph, "source").position.y
    )
    expect(getNode(graph, "branch-1-child").position.y).toBe(
      getNode(graph, "branch-1").position.y
    )
    expectNodeBelow(graph, "branch-1", "branch-0", 120)
    expectNodeBelow(graph, "branch-2", "branch-1-child", 120)
  })

  it("does not include shared merge junctions in branch lane clearance", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "source",
          type: "step-node",
          data: {},
          position: { x: 0, y: 120 },
        },
        {
          id: "branch-0",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 0 },
        },
        {
          id: "branch-0-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 0 },
        },
        {
          id: "branch-1",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 240 },
        },
        {
          id: "branch-1-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 240 },
        },
        {
          id: "merge-junction",
          type: "anchor-node",
          data: { variant: "junction" },
          position: { x: 1100, y: 180 },
        },
        {
          id: "merge",
          type: "step-node",
          data: {},
          position: { x: 1300, y: 120 },
        },
      ],
      edges: [
        {
          id: "edge-source-branch-0",
          source: "source",
          target: "branch-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 0,
          },
        },
        {
          id: "edge-branch-0-child",
          source: "branch-0",
          target: "branch-0-child",
          type: "add-item",
        },
        {
          id: "edge-branch-0-junction",
          source: "branch-0-child",
          target: "merge-junction",
          type: "add-item",
        },
        {
          id: "edge-source-branch-1",
          source: "source",
          target: "branch-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "branch",
            branchIdx: 1,
          },
        },
        {
          id: "edge-branch-1-child",
          source: "branch-1",
          target: "branch-1-child",
          type: "add-item",
        },
        {
          id: "edge-branch-1-junction",
          source: "branch-1-child",
          target: "merge-junction",
          type: "add-item",
        },
        {
          id: "edge-junction-merge",
          source: "merge-junction",
          target: "merge",
          type: "add-item",
        },
      ],
    }

    applyBranchLaneClearance(graph)

    expect(getNode(graph, "branch-1").position.y).toBe(240)
    expect(getNode(graph, "branch-1-child").position.y).toBe(240)
    expect(getNode(graph, "merge").position.y).toBe(120)
  })

  it("separates branch lanes when a lower branch contains a tall loop", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "source",
          type: "step-node",
          data: {},
          position: { x: 0, y: 240 },
        },
        {
          id: "branch-parent-0-a",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 0 },
        },
        {
          id: "upper-child",
          type: "step-node",
          data: {},
          position: { x: 800, y: 220 },
        },
        {
          id: "branch-nested-0-a",
          type: "branch-node",
          data: {},
          position: { x: 1200, y: 0 },
        },
        {
          id: "branch-nested-1-b",
          type: "branch-node",
          data: {},
          position: { x: 1200, y: 220 },
        },
        {
          id: "branch-nested-2-c",
          type: "branch-node",
          data: {},
          position: { x: 1200, y: 440 },
        },
        {
          id: "branch-parent-1-b",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 360 },
        },
        {
          id: "lower-loop",
          type: "loop-subflow-node",
          data: { containerWidth: 700, containerHeight: 360 },
          position: { x: 800, y: 260 },
        },
      ],
      edges: [
        {
          id: "edge-source-upper",
          source: "source",
          target: "branch-parent-0-a",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "parent",
            branchIdx: 0,
          },
        },
        {
          id: "edge-upper-child",
          source: "branch-parent-0-a",
          target: "upper-child",
          type: "add-item",
        },
        {
          id: "edge-upper-child-nested-a",
          source: "upper-child",
          target: "branch-nested-0-a",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested",
            branchIdx: 0,
          },
        },
        {
          id: "edge-upper-child-nested-b",
          source: "upper-child",
          target: "branch-nested-1-b",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested",
            branchIdx: 1,
          },
        },
        {
          id: "edge-upper-child-nested-c",
          source: "upper-child",
          target: "branch-nested-2-c",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested",
            branchIdx: 2,
          },
        },
        {
          id: "edge-source-lower",
          source: "source",
          target: "branch-parent-1-b",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "parent",
            branchIdx: 1,
          },
        },
        {
          id: "edge-lower-loop",
          source: "branch-parent-1-b",
          target: "lower-loop",
          type: "add-item",
        },
      ],
    }

    applyBranchLaneClearance(graph)

    const upperNestedBottom =
      graph.nodes.find(node => node.id === "branch-nested-2-c")!.position.y +
      120
    const lowerLoop = graph.nodes.find(node => node.id === "lower-loop")!

    expect(lowerLoop.position.y).toBeGreaterThan(upperNestedBottom)
  })

  it("rechecks parent branch lanes after nested branch lanes expand", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "source",
          type: "step-node",
          data: {},
          position: { x: 0, y: 240 },
        },
        {
          id: "parent-0",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 180 },
        },
        {
          id: "upper-action",
          type: "step-node",
          data: {},
          position: { x: 760, y: 180 },
        },
        {
          id: "nested-upper-0",
          type: "branch-node",
          data: {},
          position: { x: 1120, y: 180 },
        },
        {
          id: "nested-upper-1",
          type: "branch-node",
          data: {},
          position: { x: 1120, y: 210 },
        },
        {
          id: "nested-upper-1-action",
          type: "step-node",
          data: {},
          position: { x: 1480, y: 210 },
        },
        {
          id: "nested-upper-2",
          type: "branch-node",
          data: {},
          position: { x: 1120, y: 240 },
        },
        {
          id: "parent-1",
          type: "branch-node",
          data: {},
          position: { x: 400, y: 320 },
        },
        {
          id: "lower-action",
          type: "step-node",
          data: {},
          position: { x: 760, y: 320 },
        },
      ],
      edges: [
        {
          id: "edge-source-parent-0",
          source: "source",
          target: "parent-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "parent",
            branchIdx: 0,
          },
        },
        {
          id: "edge-parent-0-upper-action",
          source: "parent-0",
          target: "upper-action",
          type: "add-item",
        },
        {
          id: "edge-upper-action-nested-upper-0",
          source: "upper-action",
          target: "nested-upper-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested-upper",
            branchIdx: 0,
          },
        },
        {
          id: "edge-upper-action-nested-upper-1",
          source: "upper-action",
          target: "nested-upper-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested-upper",
            branchIdx: 1,
          },
        },
        {
          id: "edge-nested-upper-1-action",
          source: "nested-upper-1",
          target: "nested-upper-1-action",
          type: "add-item",
        },
        {
          id: "edge-upper-action-nested-upper-2",
          source: "upper-action",
          target: "nested-upper-2",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "nested-upper",
            branchIdx: 2,
          },
        },
        {
          id: "edge-source-parent-1",
          source: "source",
          target: "parent-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "parent",
            branchIdx: 1,
          },
        },
        {
          id: "edge-parent-1-lower-action",
          source: "parent-1",
          target: "lower-action",
          type: "add-item",
        },
      ],
    }

    applyBranchLaneClearance(graph)

    const upperLaneBottom =
      Math.max(
        getNode(graph, "parent-0").position.y,
        getNode(graph, "upper-action").position.y,
        getNode(graph, "nested-upper-0").position.y,
        getNode(graph, "nested-upper-1").position.y,
        getNode(graph, "nested-upper-1-action").position.y,
        getNode(graph, "nested-upper-2").position.y
      ) + BRANCH.height

    expect(getNode(graph, "parent-1").position.y).toBeGreaterThanOrEqual(
      upperLaneBottom + 120
    )
  })

  it("ignores branch edges inside loop subflows", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: 700, containerHeight: 360 },
          position: { x: 0, y: 0 },
        },
        {
          id: "subflow-branch-0",
          parentId: "loop",
          type: "branch-node",
          data: {},
          position: { x: 100, y: 0 },
        },
        {
          id: "subflow-branch-1",
          parentId: "loop",
          type: "branch-node",
          data: {},
          position: { x: 100, y: 20 },
        },
      ],
      edges: [
        {
          id: "edge-subflow-branch-0",
          source: "loop",
          target: "subflow-branch-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            isSubflowEdge: true,
            branchStepId: "branch",
            branchIdx: 0,
          },
        },
        {
          id: "edge-subflow-branch-1",
          source: "loop",
          target: "subflow-branch-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            isSubflowEdge: true,
            branchStepId: "branch",
            branchIdx: 1,
          },
        },
      ],
    }

    applyBranchLaneClearance(graph)

    expect(getNode(graph, "subflow-branch-1").position.y).toBe(20)
  })
})

describe("applyMergeJunctionClearance", () => {
  it("positions the merge subtree close to the branch convergence point", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "upper-step",
          type: "step-node",
          data: {},
          position: { x: 80, y: 0 },
        },
        {
          id: "lower-step",
          type: "step-node",
          data: {},
          position: { x: 80, y: 160 },
        },
        {
          id: "merge-junction",
          type: "anchor-node",
          data: { variant: "junction" },
          position: { x: 400, y: 100 },
        },
        {
          id: "merge",
          type: "step-node",
          data: {},
          position: { x: 460, y: 40 },
        },
        {
          id: "after-merge",
          type: "step-node",
          data: {},
          position: { x: 820, y: 40 },
        },
      ],
      edges: [
        {
          id: "edge-upper-junction",
          source: "upper-step",
          target: "merge-junction",
          type: "add-item",
          data: {
            hideActions: true,
          },
        },
        {
          id: "edge-lower-junction",
          source: "lower-step",
          target: "merge-junction",
          type: "add-item",
          data: {
            hideActions: true,
          },
        },
        {
          id: "edge-junction-merge",
          source: "merge-junction",
          target: "merge",
          type: "add-item",
          data: {
            mergeJunctionEdge: true,
          },
        },
        {
          id: "edge-merge-after",
          source: "merge",
          target: "after-merge",
          type: "add-item",
        },
      ],
    }

    applyMergeJunctionClearance(graph)

    expect(getNode(graph, "merge-junction").position.x).toBe(320)
    expect(getNode(graph, "merge").position.x).toBe(400)
    expect(getNode(graph, "after-merge").position.x).toBe(760)
  })
})

describe("applyPostLoopBranchClearance", () => {
  it("shifts every branch fanout descendant below the loop container", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: 700, containerHeight: 360 },
          position: { x: 0, y: 200 },
        },
        {
          id: "branch-0",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 0 },
        },
        {
          id: "branch-0-child",
          type: "step-node",
          data: {},
          position: { x: 1200, y: 0 },
        },
        {
          id: "branch-1",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 180 },
        },
        {
          id: "branch-1-child",
          type: "step-node",
          data: {},
          position: { x: 1200, y: 180 },
        },
      ],
      edges: [
        {
          id: "edge-loop-branch-0",
          source: "loop",
          target: "branch-0",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "post-loop-branch",
            branchIdx: 0,
          },
        },
        {
          id: "edge-branch-0-child",
          source: "branch-0",
          target: "branch-0-child",
          type: "add-item",
        },
        {
          id: "edge-loop-branch-1",
          source: "loop",
          target: "branch-1",
          type: "add-item",
          data: {
            isBranchEdge: true,
            branchStepId: "post-loop-branch",
            branchIdx: 1,
          },
        },
        {
          id: "edge-branch-1-child",
          source: "branch-1",
          target: "branch-1-child",
          type: "add-item",
        },
      ],
    }

    applyPostLoopBranchClearance(graph)

    expectNodeBelow(graph, "branch-0", "loop", 120)
    expect(getNode(graph, "branch-0-child").position.y).toBe(
      getNode(graph, "branch-0").position.y
    )
    expect(getNode(graph, "branch-1-child").position.y).toBe(
      getNode(graph, "branch-1").position.y
    )
  })

  it("moves branch fan-outs after loops below the loop container", () => {
    const graph: { nodes: FlowNode[]; edges: FlowEdge[] } = {
      nodes: [
        {
          id: "loop",
          type: "loop-subflow-node",
          data: { containerWidth: 700, containerHeight: 360 },
          position: { x: 0, y: 200 },
        },
        {
          id: "branch-0",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 0 },
        },
        {
          id: "branch-1",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 180 },
        },
        {
          id: "branch-2",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 360 },
        },
        {
          id: "branch-3",
          type: "branch-node",
          data: {},
          position: { x: 900, y: 540 },
        },
      ],
      edges: [0, 1, 2, 3].map(branchIdx => ({
        id: `edge-loop-branch-${branchIdx}`,
        source: "loop",
        target: `branch-${branchIdx}`,
        type: "add-item",
        data: {
          isBranchEdge: true,
          branchStepId: "post-loop-branch",
          branchIdx,
        },
      })),
    }

    applyPostLoopBranchClearance(graph)

    const loop = graph.nodes.find(node => node.id === "loop")!
    const firstBranch = graph.nodes.find(node => node.id === "branch-0")!
    const loopBottom = loop.position.y + 360

    expect(firstBranch.position.y).toBeGreaterThan(loopBottom)
  })
})
