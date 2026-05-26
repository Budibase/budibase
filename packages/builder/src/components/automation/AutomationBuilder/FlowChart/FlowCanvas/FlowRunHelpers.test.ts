import { describe, expect, it } from "vitest"
import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationTriggerStepId,
} from "@budibase/types"
import { getRunHighlight } from "./FlowRunHelpers"

describe("FlowRunHelpers", () => {
  it("treats unmatched switch conditions as a stopped warning highlight", () => {
    const triggerResult = {
      id: "trigger",
      stepId: AutomationTriggerStepId.APP,
      outputs: {
        success: true,
      },
    }
    const results = {
      status: AutomationStatus.NO_CONDITION_MET,
      trigger: triggerResult,
      steps: [
        triggerResult,
        {
          id: "switch",
          stepId: AutomationActionStepId.BRANCH,
          inputs: {},
          outputs: {
            success: false,
            status: AutomationStatus.NO_CONDITION_MET,
          },
        },
      ],
    }

    expect(getRunHighlight(results)).toBe("stopped")
  })
})
