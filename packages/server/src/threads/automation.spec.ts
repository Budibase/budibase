import { context } from "@budibase/backend-core"
import {
  AutomationActionStepId,
  AutomationData,
  AutomationStep,
  AutomationStepType,
  AutomationTriggerStepId,
} from "@budibase/types"
import { Job } from "bull"
import { BUILTIN_ACTION_DEFINITIONS } from "../automations"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import { basicAutomation } from "../tests/utilities/structures"
import { executeInThread } from "./automation"
import sdk from "../sdk"

describe("automation thread", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("executes the latest automation definition for queued jobs", async () => {
    const prodAppId = config.getProdWorkspaceId()

    const initialAutomation = await context.doInWorkspaceContext(
      prodAppId,
      async () =>
        sdk.automations.create(
          basicAutomation({
            appId: prodAppId,
            definition: {
              trigger: {
                ...basicAutomation().definition.trigger,
                stepId: AutomationTriggerStepId.APP,
                type: AutomationStepType.TRIGGER,
              },
              steps: [],
            },
          })
        )
    )

    const { id: _ignored, ...serverLogDefinition } =
      BUILTIN_ACTION_DEFINITIONS.SERVER_LOG as AutomationStep
    const serverLogStep: AutomationStep = {
      ...serverLogDefinition,
      id: "server-log-step",
      stepId: AutomationActionStepId.SERVER_LOG,
      inputs: { text: "updated definition" },
    }

    const updatedAutomation = await context.doInWorkspaceContext(
      prodAppId,
      async () =>
        sdk.automations.update({
          ...initialAutomation,
          definition: {
            ...initialAutomation.definition,
            steps: [serverLogStep],
          },
        })
    )

    const job = {
      data: {
        automation: initialAutomation,
        event: {
          appId: prodAppId,
        },
      },
    } as Job<AutomationData>

    const result = await executeInThread(job)

    expect(result.steps[0].stepId).toBe(AutomationTriggerStepId.APP)
    const logStepResult = result.steps.find(
      step => step.id === serverLogStep.id
    )
    expect(logStepResult?.stepId).toBe(AutomationActionStepId.SERVER_LOG)
    expect(logStepResult?.outputs?.success).toBe(true)
    expect(updatedAutomation.definition.steps).toHaveLength(1)
  })
})
