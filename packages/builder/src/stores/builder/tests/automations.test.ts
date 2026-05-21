import { describe, it, vi, expect } from "vitest"
import { get, writable } from "svelte/store"
import {
  automationStore,
  getToolbarFlowEndInsertion,
  isNoOpBlockMove,
  selectedAutomation,
} from "../automations"
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
  isBranchStep,
  isLoopV2Step,
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

  it("allows moving the first branch step into another branch on the same branch block", () => {
    const sourcePath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 0,
        branchStepId: "branch",
        stepIdx: 0,
        id: "source-step",
      },
    ]
    const destPath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 1,
        branchStepId: "branch",
        stepIdx: 0,
        id: "branch",
      },
    ]

    expect(isNoOpBlockMove(sourcePath, destPath)).toBe(false)
  })

  it("allows moving the first branch step into a branch with the same index on another branch block", () => {
    const sourcePath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "source-branch",
      },
      {
        branchIdx: 0,
        branchStepId: "source-branch",
        stepIdx: 0,
        id: "source-step",
      },
    ]
    const destPath = [
      {
        stepIdx: 2,
        branchIdx: -1,
        branchStepId: "",
        id: "dest-branch",
      },
      {
        branchIdx: 0,
        branchStepId: "dest-branch",
        stepIdx: 0,
        id: "dest-branch",
      },
    ]

    expect(isNoOpBlockMove(sourcePath, destPath)).toBe(false)
  })

  it("treats moving the first branch step into its own branch node as a no-op", () => {
    const sourcePath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 0,
        branchStepId: "branch",
        stepIdx: 0,
        id: "source-step",
      },
    ]
    const destPath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 0,
        branchStepId: "branch",
        stepIdx: 0,
        id: "branch",
      },
    ]

    expect(isNoOpBlockMove(sourcePath, destPath)).toBe(true)
  })

  it("treats moving a step above itself in the same container as a no-op", () => {
    const sourcePath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 0,
        branchStepId: "branch",
        stepIdx: 1,
        id: "source-step",
      },
    ]
    const destPath = [
      {
        stepIdx: 1,
        branchIdx: -1,
        branchStepId: "",
        id: "branch",
      },
      {
        branchIdx: 0,
        branchStepId: "branch",
        stepIdx: 0,
        id: "previous-step",
      },
    ]

    expect(isNoOpBlockMove(sourcePath, destPath)).toBe(true)
  })

  it("deletes a linear Loop V2 child without deleting the following branch", async () => {
    const branchChild = serverLogStep("branch-child")
    const branch = branchStep([branchChild])
    const linearStep = serverLogStep("before-branch")
    const loop = loopStep([linearStep, branch])
    const automation: Automation = {
      _id: "automation",
      name: "Automation",
      appId: "app",
      type: "automation",
      definition: {
        trigger: automationTrigger,
        steps: [loop],
      },
    }
    let savedAutomation: Automation | undefined
    const save = vi
      .spyOn(automationStore.actions, "save")
      .mockImplementation(async updatedAutomation => {
        savedAutomation = updatedAutomation
        return updatedAutomation
      })

    automationStore.update(state => ({
      ...state,
      automations: [automation],
      selectedAutomationId: automation._id!,
    }))

    const pathToDelete =
      get(selectedAutomation).blockRefs["before-branch"].pathTo

    await automationStore.actions.deleteAutomationBlock(pathToDelete)

    const savedLoop = savedAutomation?.definition.steps[0]
    if (!savedLoop || !isLoopV2Step(savedLoop)) {
      throw new Error("Expected saved loop step")
    }
    const loopChildren = savedLoop.inputs.children
    if (!loopChildren) {
      throw new Error("Expected loop children")
    }
    const savedBranch = loopChildren[0]
    if (!savedBranch || !isBranchStep(savedBranch)) {
      throw new Error("Expected saved branch step")
    }
    const branchChildren = savedBranch.inputs.children
    if (!branchChildren) {
      throw new Error("Expected branch children")
    }

    expect(loopChildren.map(step => step.id)).toEqual(["branch"])
    expect(branchChildren.matched.map(step => step.id)).toEqual([
      "branch-child",
    ])

    save.mockRestore()
  })

  it("deletes the following Loop V2 branch when cascade deletion is confirmed", async () => {
    const branchChild = serverLogStep("branch-child")
    const branch = branchStep([branchChild])
    const linearStep = serverLogStep("before-branch")
    const loop = loopStep([linearStep, branch])
    const automation: Automation = {
      _id: "automation",
      name: "Automation",
      appId: "app",
      type: "automation",
      definition: {
        trigger: automationTrigger,
        steps: [loop],
      },
    }
    let savedAutomation: Automation | undefined
    const save = vi
      .spyOn(automationStore.actions, "save")
      .mockImplementation(async updatedAutomation => {
        savedAutomation = updatedAutomation
        return updatedAutomation
      })

    automationStore.update(state => ({
      ...state,
      automations: [automation],
      selectedAutomationId: automation._id!,
    }))

    const pathToDelete =
      get(selectedAutomation).blockRefs["before-branch"].pathTo

    await automationStore.actions.deleteAutomationBlock(pathToDelete, {
      cascadeNextBranchInLoop: true,
    })

    const savedLoop = savedAutomation?.definition.steps[0]
    if (!savedLoop || !isLoopV2Step(savedLoop)) {
      throw new Error("Expected saved loop step")
    }

    expect(savedLoop.inputs.children).toEqual([])

    save.mockRestore()
  })

  it("adds a block to a Loop V2 child nested inside a branch", async () => {
    const loop = loopStep()
    const branch = branchStep([loop])
    const automation: Automation = {
      _id: "automation",
      name: "Automation",
      appId: "app",
      type: "automation",
      definition: {
        trigger: automationTrigger,
        steps: [branch],
      },
    }
    const newBlock = serverLogStep("loop-child")
    let savedAutomation: Automation | undefined
    const save = vi
      .spyOn(automationStore.actions, "save")
      .mockImplementation(async updatedAutomation => {
        savedAutomation = updatedAutomation
        return updatedAutomation
      })

    automationStore.update(state => ({
      ...state,
      automations: [automation],
      selectedAutomationId: automation._id!,
    }))

    await automationStore.actions.addBlockToLoopChildren("loop", newBlock, 0)

    const savedBranch = savedAutomation?.definition.steps[0]
    if (!savedBranch || !isBranchStep(savedBranch)) {
      throw new Error("Expected saved branch step")
    }
    const savedLoop = savedBranch.inputs.children?.matched[0]
    if (!savedLoop || !isLoopV2Step(savedLoop)) {
      throw new Error("Expected saved loop step")
    }

    expect(savedLoop.inputs.children?.map(step => step.id)).toEqual([
      "loop-child",
    ])

    save.mockRestore()
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
          stepIdx: -1,
          loopStepId: "loop",
          id: "loop",
        },
      ])
    })
  })
})
