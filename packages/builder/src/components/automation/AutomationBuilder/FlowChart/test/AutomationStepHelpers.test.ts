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

  it("connects selected branch leaves to an inline merge step", () => {
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
    getNode(graph, merge.id)
    getEdge(graph, "alpha-1", merge.id)
    expect(getEdge(graph, "branch-branch-many-1-beta", merge.id).data).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 1,
    })
    expect(getEdge(graph, "gamma-1", "anchor-gamma-1").data).toMatchObject({
      terminalBranchStepId: "branch-many",
      terminalBranchIdx: 2,
    })
    expect(
      graph.nodes.some(node => node.id === "anchor-branch-branch-many-1-beta")
    ).toBe(false)
    getNode(graph, "anchor-gamma-1")
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
