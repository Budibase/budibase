import { describe, it, vi } from "vitest"
import { writable } from "svelte/store"
import { AutomationActionStepId } from "@budibase/types"
import {
  automationBlockDefinitions,
  automationLog,
  branchStep,
  nestedLoopBranchAutomation,
} from "@/test/automationFixtures"
import { getLogStepData, processLogSteps } from "./AutomationStepHelpers"

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
