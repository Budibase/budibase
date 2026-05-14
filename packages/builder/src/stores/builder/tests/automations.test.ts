import { describe, it, vi } from "vitest"
import { get, writable } from "svelte/store"
import {
  automationStore,
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
import { isBranchStep, isLoopV2Step, type Automation } from "@budibase/types"

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

    const pathToDelete = get(selectedAutomation).blockRefs["before-branch"]
      .pathTo

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

    const pathToDelete = get(selectedAutomation).blockRefs["before-branch"]
      .pathTo

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
})
