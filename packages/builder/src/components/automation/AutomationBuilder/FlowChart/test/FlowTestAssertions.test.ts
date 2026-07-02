import { describe, expect, it } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import { expectSubflowNodesInsideParent } from "./FlowTestAssertions"

const createGraph = (childPosition: { x: number; y: number }) => ({
  nodes: [
    {
      id: "parent",
      type: "loop-subflow-node",
      data: { containerWidth: 360, containerHeight: 120 },
      position: { x: 0, y: 0 },
    },
    {
      id: "child",
      parentId: "parent",
      type: "step-node",
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
      type: "anchor-node",
      data: {},
      position: { x: 360, y: 120 },
    } as FlowNode

    expect(() => expectSubflowNodesInsideParent(graph)).not.toThrow()
  })
})
