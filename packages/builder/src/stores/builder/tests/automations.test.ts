import { describe, it, vi, expect } from "vitest"
import { writable } from "svelte/store"
import { automationStore, getToolbarFlowEndInsertion } from "../automations"
import { type AutomationBlockRef } from "@/types/automations"
import {
  automationTrigger,
  branchStep,
  loopStep,
  nestedLoopBranchAutomation,
  serverLogStep,
} from "@/test/automationFixtures"
import {
  AutomationActionStepId,
  AutomationStepType,
  type Automation,
  type BranchStep,
} from "@budibase/types"

vi.mock("@/stores/builder", () => {
  return {
    appStore: writable({}),
    deploymentStore: writable({}),
    permissions: writable({}),
    tables: writable({ list: [] }),
    workspaceDeploymentStore: writable({ automations: {} }),
  }
})

interface TestBlockRef extends AutomationBlockRef {
  isLoopV2Child?: boolean
}

describe("automation store", () => {
  it("traverses branch steps inside Loop V2 subflows", () => {
    const { automation } = nestedLoopBranchAutomation()
    const blockRefs: Record<string, TestBlockRef> = {}

    automationStore.actions.traverse(blockRefs, automation)

    expect(blockRefs.branch.pathTo).toEqual([
      {
        stepIdx: 1,
        id: "loop",
      },
      {
        loopStepId: "loop",
        stepIdx: 0,
        id: "branch",
      },
    ])
    expect(blockRefs.branch.isLoopV2Child).toEqual(true)
    expect(blockRefs["branch-child"].pathTo).toEqual([
      {
        stepIdx: 1,
        id: "loop",
      },
      {
        loopStepId: "loop",
        stepIdx: 0,
        id: "branch",
      },
      {
        branchIdx: 0,
        loopStepId: "loop",
        stepIdx: 0,
        id: "branch-child",
      },
    ])
    expect(blockRefs["branch-child"].isLoopV2Child).toEqual(true)
  })

  it("resolves path steps through a Loop V2 branch child", () => {
    const { automation } = nestedLoopBranchAutomation()
    const blockRefs: Record<string, TestBlockRef> = {}
    automationStore.actions.traverse(blockRefs, automation)

    const pathSteps = automationStore.actions.getPathSteps(
      blockRefs["branch-child"].pathTo,
      automation
    )

    expect(pathSteps.map(step => step.id)).toEqual([
      "trigger",
      "loop",
      "branch",
      "branch-child",
    ])
  })

  describe("getToolbarFlowEndInsertion", () => {
    const baseAutomation = (
      steps: Automation["definition"]["steps"]
    ): Automation => ({
      name: "Automation",
      appId: "app",
      type: "automation",
      definition: {
        trigger: automationTrigger,
        steps,
      },
    })

    it("uses trigger path when there are no steps", () => {
      const automation = baseAutomation([])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.targetPath).toEqual(blockRefs.trigger.pathTo)
      expect(result.anchorRef).toBeUndefined()
    })

    it("targets the last top-level step on a linear chain", () => {
      const a = serverLogStep("a")
      const b = serverLogStep("b")
      const automation = baseAutomation([a, b])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.targetPath).toEqual(blockRefs.b.pathTo)
      expect(result.anchorRef).toEqual(blockRefs.b)
    })

    it("walks to the empty last branch when that branch is last in definition order", () => {
      const { automation } = nestedLoopBranchAutomation()
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.anchorRef).toBeUndefined()
      expect(result.insertInsideLoopV2Children).toBe(true)
      expect(result.targetPath).toEqual([
        ...blockRefs.branch.pathTo,
        {
          branchIdx: 1,
          branchStepId: "branch",
          stepIdx: -1,
        },
      ])
    })

    it("when the last branch holds the tail inside a loop, uses that step pathTo", () => {
      const tail = serverLogStep("branch-child")
      const branch = branchStep([])
      branch.inputs = {
        ...branch.inputs,
        children: {
          matched: [],
          fallback: [tail],
        },
      }
      const loop = loopStep([branch])
      const automation = baseAutomation([loop])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.targetPath).toEqual(blockRefs["branch-child"].pathTo)
      expect(result.anchorRef).toEqual(blockRefs["branch-child"])
    })

    it("appends into an empty last branch with branchIdx and stepIdx -1", () => {
      const branch = branchStep([])
      const automation = baseAutomation([branch])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.anchorRef).toBeUndefined()
      expect(result.insertInsideLoopV2Children).toBeFalsy()
      expect(result.targetPath).toEqual([
        ...blockRefs.branch.pathTo,
        {
          branchIdx: 1,
          branchStepId: "branch",
          stepIdx: -1,
        },
      ])
    })

    it("prefers the last branch when an earlier branch has steps", () => {
      const tail = serverLogStep("tail")
      const customBranch: BranchStep = {
        id: "branch",
        stepId: AutomationActionStepId.BRANCH,
        type: AutomationStepType.LOGIC,
        name: "Branch",
        tagline: "",
        icon: "",
        description: "",
        inputs: {
          branches: [
            { id: "first", name: "First", condition: {} },
            { id: "second", name: "Second", condition: {} },
          ],
          children: {
            first: [serverLogStep("only-first")],
            second: [tail],
          },
        },
        schema: {
          inputs: { required: [], properties: {} },
          outputs: { required: [], properties: {} },
        },
      }
      const automation = baseAutomation([customBranch])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.targetPath).toEqual(blockRefs.tail.pathTo)
      expect(result.anchorRef).toEqual(blockRefs.tail)
    })

    it("targets empty Loop V2 body with an extra hop and flags loop context", () => {
      const loop = loopStep([])
      const automation = baseAutomation([loop])
      const blockRefs: Record<string, TestBlockRef> = {}
      automationStore.actions.traverse(blockRefs, automation)

      const result = getToolbarFlowEndInsertion(automation, blockRefs)
      expect(result.anchorRef).toBeUndefined()
      expect(result.insertInsideLoopV2Children).toBe(true)
      expect(result.targetPath).toEqual([
        ...blockRefs.loop.pathTo,
        {
          branchIdx: 0,
          branchStepId: "loop",
          stepIdx: -1,
          id: "loop",
        },
      ])
    })
  })
})
