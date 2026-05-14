import { describe, it, vi } from "vitest"
import { writable } from "svelte/store"
import { automationStore, isNoOpBlockMove } from "../automations"
import { type AutomationBlockRef } from "@/types/automations"
import { nestedLoopBranchAutomation } from "@/test/automationFixtures"

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
})
