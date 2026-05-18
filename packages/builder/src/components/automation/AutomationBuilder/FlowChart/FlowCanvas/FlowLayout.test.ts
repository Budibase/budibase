import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import {
  applyBranchLaneClearance,
  applyLoopClearance,
  applyPostLoopBranchClearance,
} from "./FlowLayout"
import {
  FLOW_ITEM_ACTION_BAR_WIDTH,
  LOOP,
  LOOP_INSERT_ACTION_OFFSET,
} from "./FlowGeometry"

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
