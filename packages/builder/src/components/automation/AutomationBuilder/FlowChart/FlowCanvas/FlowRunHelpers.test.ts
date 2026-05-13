import { describe, expect, it } from "vitest"
import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationTriggerStepId,
  type AutomationResults,
} from "@budibase/types"
import { getRunHighlight } from "./FlowRunHelpers"

describe("FlowRunHelpers", () => {
  it("treats unmatched switch conditions as a stopped warning highlight", () => {
    const results = {
      status: AutomationStatus.NO_CONDITION_MET,
      trigger: {
        id: "trigger",
        stepId: AutomationTriggerStepId.APP,
        outputs: {
          success: true,
        },
      },
      steps: [
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
    } as AutomationResults

    expect(getRunHighlight(results)).toBe("stopped")
  })
})
