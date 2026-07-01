import {
  AutomationActionStepId,
  AutomationStatus,
  AutomationTriggerStepId,
} from "@budibase/types"
import { sanitizeAutomationTestResult } from "../sanitizeTestResult"

describe("sanitizeAutomationTestResult", () => {
  it("strips OAuth2 tokens from trigger and step user outputs", () => {
    const result = sanitizeAutomationTestResult({
      status: AutomationStatus.SUCCESS,
      trigger: {
        id: "trigger",
        stepId: AutomationTriggerStepId.APP,
        inputs: null,
        outputs: {
          user: {
            email: "user@example.com",
            oauth2: {
              accessToken: "access-token",
              refreshToken: "refresh-token",
            },
          },
        },
      },
      steps: [
        {
          id: "trigger",
          stepId: AutomationTriggerStepId.APP,
          inputs: null,
          outputs: {
            user: {
              email: "user@example.com",
              oauth2: {
                accessToken: "access-token",
                refreshToken: "refresh-token",
              },
            },
          },
        },
        {
          id: "step",
          stepId: AutomationActionStepId.SERVER_LOG,
          inputs: {},
          outputs: {
            success: true,
            user: {
              email: "user@example.com",
              oauth2: {
                accessToken: "access-token",
                refreshToken: "refresh-token",
              },
            },
          },
        },
      ],
    })

    expect(result).toEqual({
      status: AutomationStatus.SUCCESS,
      trigger: expect.objectContaining({
        outputs: {
          user: {
            email: "user@example.com",
          },
        },
      }),
      steps: [
        expect.objectContaining({
          outputs: {
            user: {
              email: "user@example.com",
            },
          },
        }),
        expect.objectContaining({
          outputs: {
            success: true,
            user: {
              email: "user@example.com",
            },
          },
        }),
      ],
    })
  })
})
