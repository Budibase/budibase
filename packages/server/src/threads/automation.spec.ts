import { context } from "@budibase/backend-core"
import {
  AutomationActionStepId,
  AutomationData,
  AutomationStep,
  AutomationEventType,
  AutomationStepType,
  AutomationTestProgressEvent,
  AutomationTriggerStepId,
  AutomationStepResult,
} from "@budibase/types"
import { Job } from "bull"
import { BUILTIN_ACTION_DEFINITIONS, TRIGGER_DEFINITIONS } from "../automations"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import { basicAutomation } from "../tests/utilities/structures"
import { executeInThread } from "./automation"
import sdk from "../sdk"
import { automations } from "@budibase/shared-core"

const isAutomationStepResult = (
  result: AutomationTestProgressEvent["result"]
): result is AutomationStepResult => !!result && "outputs" in result

describe("automation thread", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("executes the latest automation definition for cron jobs", async () => {
    const prodAppId = config.getProdWorkspaceId()

    const initialAutomation = await context.doInWorkspaceContext(
      prodAppId,
      async () =>
        sdk.automations.create(
          basicAutomation({
            appId: prodAppId,
            definition: {
              trigger: {
                id: "cron-trigger",
                type: AutomationStepType.TRIGGER,
                name: TRIGGER_DEFINITIONS.CRON.name,
                tagline: TRIGGER_DEFINITIONS.CRON.tagline,
                description: TRIGGER_DEFINITIONS.CRON.description,
                icon: TRIGGER_DEFINITIONS.CRON.icon,
                schema: TRIGGER_DEFINITIONS.CRON.schema,
                stepId: AutomationTriggerStepId.CRON,
                event: AutomationEventType.CRON_TRIGGER,
                inputs: { cron: "* * * * *" },
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
          timestamp: Date.now(),
        },
      },
    } as Job<AutomationData>

    const result = await executeInThread(job)

    expect(result.steps[0].stepId).toBe(AutomationTriggerStepId.CRON)
    const logStepResult = result.steps.find(
      step => step.id === serverLogStep.id
    )
    expect(logStepResult?.stepId).toBe(AutomationActionStepId.SERVER_LOG)
    expect(logStepResult?.outputs?.success).toBe(true)
    expect(updatedAutomation.definition.steps).toHaveLength(1)
  })

  it("uses the queued automation definition for non-cron jobs", async () => {
    const prodAppId = config.getProdWorkspaceId()

    const initialAutomation = await context.doInWorkspaceContext(
      prodAppId,
      async () => sdk.automations.create(basicAutomation({ appId: prodAppId }))
    )

    const { id: _ignored, ...serverLogDefinition } =
      BUILTIN_ACTION_DEFINITIONS.SERVER_LOG as AutomationStep
    const serverLogStep: AutomationStep = {
      ...serverLogDefinition,
      id: "server-log-step",
      stepId: AutomationActionStepId.SERVER_LOG,
      inputs: { text: "updated definition" },
    }

    await context.doInWorkspaceContext(prodAppId, async () =>
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
      step => step.stepId === AutomationActionStepId.SERVER_LOG
    )
    expect(logStepResult).toBeUndefined()
  })

  it("emits selected branch ID while branch children execute", async () => {
    const appId = config.getDevWorkspaceId()

    const branch1Id = "branch-1"
    const branch2Id = "branch-2"
    const branchStepId = "branch-step"
    const childStepId = "branch-child-step"

    const { id: _ignored, ...serverLogDefinition } =
      BUILTIN_ACTION_DEFINITIONS.SERVER_LOG as AutomationStep

    const branchStep: AutomationStep = {
      ...automations.steps.branch.definition,
      id: branchStepId,
      stepId: AutomationActionStepId.BRANCH,
      inputs: {
        branches: [
          { id: branch1Id, name: "Branch 1", condition: {} },
          { id: branch2Id, name: "Branch 2", condition: {} },
        ],
        children: {
          [branch1Id]: [
            {
              ...serverLogDefinition,
              id: childStepId,
              stepId: AutomationActionStepId.SERVER_LOG,
              inputs: { text: "child step" },
            },
          ],
          [branch2Id]: [],
        },
      },
    }

    const job = {
      data: {
        automation: basicAutomation({
          appId,
          definition: {
            trigger: {
              stepId: AutomationTriggerStepId.APP,
              name: "test",
              tagline: "test",
              icon: "test",
              description: "test",
              type: AutomationStepType.TRIGGER,
              inputs: {},
              id: "trigger",
              schema: {
                inputs: { properties: {} },
                outputs: { properties: {} },
              },
            },
            steps: [branchStep],
          },
        }),
        event: {
          appId,
        },
      },
    } as Job<AutomationData>

    const progressEvents: AutomationTestProgressEvent[] = []
    await executeInThread(job, {
      onProgress: event => progressEvents.push(event),
    })

    const branchEvents = progressEvents.filter(e => e.blockId === branchStepId)
    expect(branchEvents.length).toBeGreaterThan(0)

    const firstBranchEvent = branchEvents[0]
    expect(firstBranchEvent.status).toBe("running")

    expect(isAutomationStepResult(firstBranchEvent.result)).toBe(true)
    if (isAutomationStepResult(firstBranchEvent.result)) {
      expect(firstBranchEvent.result.outputs).toMatchObject({
        branchId: branch1Id,
      })
    }

    const firstBranchEventIndex = progressEvents.findIndex(
      e => e === firstBranchEvent
    )
    const firstChildRunningIndex = progressEvents.findIndex(
      e => e.blockId === childStepId && e.status === "running"
    )
    expect(firstChildRunningIndex).toBeGreaterThan(firstBranchEventIndex)
  })
})
