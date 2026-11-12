import { describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import {
  AutomationActionStepId,
  AutomationStatus,
  type Automation,
  type AutomationLog,
  type AutomationStep,
  type AutomationStepResult,
} from "@budibase/types"
import {
  automationBlockDefinitions,
  automationLog,
  automationWithSteps,
  branchStep,
  loopStep,
  nestedLoopBranchAutomation,
  serverLogStep,
} from "@/test/automationFixtures"
import {
  buildAutomationGraph,
  getLogStepData,
  processLogSteps,
} from "../AutomationStepHelpers"
import {
  expectAllEdgesResolvable,
  expectNodeRightOf,
  expectUniqueGraphIds,
  getNode,
} from "./FlowTestAssertions"

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

interface LogGraphOptions {
  automation: Automation
  log: AutomationLog
}

const buildLogGraph = ({ automation, log }: LogGraphOptions) => {
  const blocks = processLogSteps({
    automation: { ...automation, blockDefinitions: automationBlockDefinitions },
    selectedLog: log,
  })
  return buildAutomationGraph(blocks, {
    xSpacing: 160,
    ySpacing: 340,
    blockRefs: {},
    newNodes: [],
    newEdges: [],
    subflowNodePositions: {},
  })
}

const stepResult = (step: AutomationStep): AutomationStepResult => ({
  id: step.id,
  stepId: step.stepId,
  inputs: step.inputs,
  outputs: { success: true },
})

describe("AutomationStepHelpers", () => {
  it.each([2, 40])(
    "renders a timed-out loop after %i iterations with unique nodes inside its container",
    iterations => {
      const before = serverLogStep("before")
      const children = [serverLogStep("first"), serverLogStep("second")]
      const loop = loopStep(children)
      const automation = automationWithSteps([
        before,
        loop,
        serverLogStep("not-run"),
      ])
      const log = automationLog()
      log.status = AutomationStatus.TIMED_OUT
      log.steps = [
        log.trigger,
        stepResult(before),
        ...Array.from({ length: iterations }, () =>
          children.map(stepResult)
        ).flat(),
      ]

      const graph = buildLogGraph({ automation, log })

      expectUniqueGraphIds(graph)
      expectAllEdgesResolvable(graph)
      expect(
        graph.nodes.filter(node => !node.parentId).map(node => node.id)
      ).toEqual(["trigger", "before", "loop", "anchor-loop"])
      expect(getNode(graph, "first").parentId).toBe("loop")
      expect(getNode(graph, "second").parentId).toBe("loop")
      expectNodeRightOf(graph, "loop", "before")
    }
  )

  it("preserves the loop result and following steps when a later step times out", () => {
    const children = [serverLogStep("first"), serverLogStep("second")]
    const loop = loopStep(children)
    const after = serverLogStep("after")
    const automation = automationWithSteps([
      loop,
      after,
      serverLogStep("times-out"),
    ])
    const log = automationLog()
    log.status = AutomationStatus.TIMED_OUT
    log.steps = [
      log.trigger,
      ...children.map(stepResult),
      ...children.map(stepResult),
      {
        ...stepResult(loop),
        outputs: { success: true, iterations: 2 },
      },
      stepResult(after),
    ]

    const graph = buildLogGraph({ automation, log })

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)
    expect(
      graph.nodes.filter(node => !node.parentId).map(node => node.id)
    ).toEqual(["trigger", "loop", "after", "anchor-after"])
    expect(getNode(graph, "loop").data.block).toMatchObject({
      outputs: { success: true, iterations: 2 },
    })
    expectNodeRightOf(graph, "after", "loop")
  })

  it("reconstructs a missing loop container around nested branch results", () => {
    const { automation, branch, branchChild } = nestedLoopBranchAutomation()
    const log = automationLog()
    log.status = AutomationStatus.TIMED_OUT
    log.steps = [
      log.trigger,
      stepResult(branchChild),
      {
        ...stepResult(branch),
        outputs: { branchId: "matched", success: true },
      },
      stepResult(branchChild),
      stepResult(branchChild),
    ]

    const graph = buildLogGraph({ automation, log })

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)
    expect(
      graph.nodes.filter(node => !node.parentId).map(node => node.id)
    ).toEqual(["trigger", "loop", "anchor-loop"])
    expect(getNode(graph, "branch-child").parentId).toBe("loop")
  })

  it("renders repeated historical steps only once when their definitions are missing", () => {
    const child = serverLogStep("removed")
    const log = automationLog()
    log.steps = [log.trigger, stepResult(child), stepResult(child)]

    const graph = buildLogGraph({ automation: automationWithSteps([]), log })

    expectUniqueGraphIds(graph)
    expectAllEdgesResolvable(graph)
    expect(graph.nodes.map(node => node.id)).toEqual([
      "trigger",
      "removed",
      "anchor-removed",
    ])
    expectNodeRightOf(graph, "removed", "trigger")
  })

  it("keeps branch children when reconstructing loop log steps", () => {
    const { automation, branch } = nestedLoopBranchAutomation()
    const automationWithDefinitions = {
      ...automation,
      blockDefinitions: automationBlockDefinitions,
    }

    const blocks = processLogSteps({
      automation: automationWithDefinitions,
      selectedLog: automationLog(),
    })
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
