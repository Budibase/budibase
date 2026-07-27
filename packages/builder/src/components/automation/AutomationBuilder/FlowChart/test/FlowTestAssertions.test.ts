import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge } from "@xyflow/svelte"
import { FLOW_NODE_TYPE, type FlowNode } from "../FlowCanvas/FlowGraphTypes"
import { expectSubflowNodesInsideParent } from "./FlowTestAssertions"

const createGraph = (childPosition: { x: number; y: number }) => ({
  nodes: [
    {
      id: "parent",
      type: FLOW_NODE_TYPE.LOOP_SUBFLOW,
      data: { containerWidth: 360, containerHeight: 120 },
      position: { x: 0, y: 0 },
    },
    {
      id: "child",
      parentId: "parent",
      type: FLOW_NODE_TYPE.STEP,
      data: {},
      position: childPosition,
    },
  ] as FlowNode[],
  edges: [] as FlowEdge[],
})

describe("expectSubflowNodesInsideParent", () => {
  it("allows child nodes that fit inside their parent bounds", () => {
    expect(() =>
      expectSubflowNodesInsideParent(createGraph({ x: 0, y: 0 }))
    ).not.toThrow()
  })

  it("fails when child nodes overflow their parent bounds", () => {
    expect(() =>
      expectSubflowNodesInsideParent(createGraph({ x: 1, y: 1 }))
    ).toThrow()
  })

  it("allows anchor handle positions on the parent boundary", () => {
    const graph = createGraph({ x: 0, y: 0 })
    graph.nodes[1] = {
      id: "anchor",
      parentId: "parent",
      type: FLOW_NODE_TYPE.ANCHOR,
      data: {},
      position: { x: 360, y: 120 },
    } as FlowNode

    expect(() => expectSubflowNodesInsideParent(graph)).not.toThrow()
  })
})
