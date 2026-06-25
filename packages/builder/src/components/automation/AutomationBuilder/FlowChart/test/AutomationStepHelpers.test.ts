import { describe, expect, it, vi } from "vitest"
import type { Edge as FlowEdge, Node as FlowNode } from "@xyflow/svelte"
import { writable } from "svelte/store"
import { AutomationActionStepId } from "@budibase/types"
import {
  automationBlockDefinitions,
  automationTrigger,
  automationLog,
  branchStep,
  mergeStep,
  nestedLoopBranchAutomation,
  serverLogStep,
} from "@/test/automationFixtures"
import {
  buildTopLevelGraph,
  dagreLayoutAutomation,
  getLogStepData,
  processLogSteps,
} from "../AutomationStepHelpers"
import {
  expectAllEdgesResolvable,
  expectUniqueGraphIds,
  getEdge,
  getNode,
} from "./../FlowCanvas/FlowTestAssertions"

vi.mock("@/stores/builder", () => {
  return {
    automationStore: writable({
      blockDefinitions: {
        ACTION: {},
        TRIGGER: {},
      },
      selectedLog: undefined,
    }),
  }
})

describe("AutomationStepHelpers", () => {
  const createGraphDeps = (graph: { nodes: FlowNode[]; edges: FlowEdge[] }) => {
    return {
      xSpacing: 160,
      ySpacing: 340,
      blockRefs: {},
      newNodes: graph.nodes,
      newEdges: graph.edges,
    }
  }

  it("joins selected branch leaves before an inline merge step", () => {
    const graph = {
      nodes: [] as FlowNode[],
      edges: [] as FlowEdge[],
    }
    const merge = mergeStep("alpha-merge")
    const branch = branchStep([], {
      id: "branch-many",
      branches: [
        {
          id: "alpha",
          name: "Alpha",
          children: [serverLogStep("alpha-1"), merge],
        },
        {
          id: "beta",
          name: "Beta",
          children: [],
        },
        {
          id: "gamma",
          name: "Gamma",
          children: [serverLogStep("gamma-1")],
        },
      ],
    })
    branch.inputs.mergeConnections = [
      {
        sourceBranchId: "beta",
        targetStepId: merge.id,
      },
    ]

    buildTopLevelGraph([automationTrigger, branch], createGraphDeps(graph))

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)
    const joinAnchorId = "anchor-branch-many-merge-alpha-merge"

    getNode(graph, merge.id)
    expect(getNode(graph, joinAnchorId).data).toMatchObject({
      variant: "junction",
    })
    expect(getEdge(graph, "alpha-1", joinAnchorId).data).toMatchObject({
      hideActions: true,
    })
    expect(
      getEdge(graph, "anchor-branch-branch-many-1-beta", joinAnchorId).data
    ).toMatchObject({ hideActions: true })
    expect(getEdge(graph, joinAnchorId, merge.id).data).not.toMatchObject({
      hideActions: true,
    })
    expect(getEdge(graph, "gamma-1", "anchor-gamma-1").data).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 2,
    })
    expect(
      graph.edges.some(
        edge => edge.source === "alpha-1" && edge.target === merge.id
      )
    ).toBe(false)
    expect(
      graph.edges.some(
        edge =>
          edge.source === "branch-branch-many-1-beta" &&
          edge.target === merge.id
      )
    ).toBe(false)
    expect(
      graph.edges.some(
        edge =>
          edge.source === "branch-branch-many-1-beta" &&
          edge.target === joinAnchorId
      )
    ).toBe(false)
    expect(
      getEdge(
        graph,
        "branch-branch-many-1-beta",
        "anchor-branch-branch-many-1-beta"
      ).data
    ).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 1,
      continueThroughActions: true,
    })
    getNode(graph, "anchor-gamma-1")

    dagreLayoutAutomation(graph)

    const joinAnchor = getNode(graph, joinAnchorId)
    const mergeNode = getNode(graph, merge.id)
    const joinCenterY = joinAnchor.position.y + 0.5
    const mergeHandleY = mergeNode.position.y + 30

    expect(Math.abs(joinCenterY - mergeHandleY)).toBeLessThanOrEqual(1)
    expect(mergeNode.position.x - joinAnchor.position.x).toBe(80)
  })

  it("renders separate branch endings when merge connection targets are missing", () => {
    const graph = {
      nodes: [] as FlowNode[],
      edges: [] as FlowEdge[],
    }
    const branch = branchStep([], {
      id: "branch-many",
      branches: [
        {
          id: "alpha",
          name: "Alpha",
          children: [serverLogStep("alpha-1")],
        },
        {
          id: "beta",
          name: "Beta",
          children: [],
        },
      ],
    })
    branch.inputs.mergeConnections = [
      {
        sourceBranchId: "beta",
        targetStepId: "deleted-merge",
      },
    ]

    buildTopLevelGraph([automationTrigger, branch], createGraphDeps(graph))

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)
    expect(getEdge(graph, "alpha-1", "anchor-alpha-1").data).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 0,
    })
    expect(
      getEdge(
        graph,
        "branch-branch-many-1-beta",
        "anchor-branch-branch-many-1-beta"
      ).data
    ).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 1,
    })
  })

  it("keeps branch children when reconstructing loop log steps", () => {
    const { automation, branch } = nestedLoopBranchAutomation()
    const automationWithDefinitions = {
      ...automation,
      blockDefinitions: automationBlockDefinitions,
    }

    const blocks = processLogSteps(automationWithDefinitions, automationLog())
    const reconstructedLoop = blocks.find(block => block.id === "loop")

    expect(reconstructedLoop).toMatchObject({
      inputs: {
        children: [branch],
      },
    })
  })

  it("finds nested branch results stored under loop output items", () => {
    const branchResults = [
      {
        id: "branch",
        stepId: AutomationActionStepId.BRANCH,
        inputs: {},
        outputs: {
          branchId: "matched",
          branchName: "Matched",
        },
      },
      {
        id: "branch",
        stepId: AutomationActionStepId.BRANCH,
        inputs: {},
        outputs: {
          branchId: "fallback",
          branchName: "Fallback",
        },
      },
    ]
    const logData = automationLog({
      success: true,
      iterations: 2,
      items: {
        branch: branchResults,
      },
    })

    const result = getLogStepData(branchStep(), logData)

    expect(result?.outputs).toMatchObject({
      branchId: "fallback",
      branchName: "Fallback",
      iterations: 2,
      items: branchResults,
    })
  })
})
