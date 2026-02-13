import * as automation from "../../../../automations"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../../../../automations/tests/utilities/AutomationTestBuilder"
import {
  AutomationIOType,
  AutomationStatus,
  AutomationStepResult,
  AutomationTriggerStepId,
  AutomationTriggerResult,
} from "@budibase/types"
import createAutomationTools from "../automations"

interface TriggerAutomationStepsResult {
  success: boolean
  status: AutomationStatus
  steps: [AutomationTriggerResult, ...AutomationStepResult[]]
}

interface TriggerAutomationErrorResult {
  success?: false
  error: string
}

type TriggerAutomationResult =
  | TriggerAutomationStepsResult
  | TriggerAutomationErrorResult

describe("AI Tools - Automations", () => {
  const config = new TestConfiguration()

  const getTriggerAutomationTool = (automation: any) => {
    const tools = createAutomationTools([automation])
    const automationName = automation.name || automation._id
    const tool = tools.find(t => t.readableName === `${automationName}.trigger`)
    if (!tool) {
      throw new Error("trigger tool not found")
    }
    return tool
  }

  const findTriggerAutomationTool = (automation: any) => {
    const tools = createAutomationTools([automation])
    const automationName = automation.name || automation._id
    return tools.find(t => t.readableName === `${automationName}.trigger`)
  }

  const executeTool = async <T>(
    toolDef: ReturnType<typeof getTriggerAutomationTool>,
    input: unknown
  ): Promise<T> => {
    if (!toolDef.tool.execute) {
      throw new Error("tool.execute is not a function")
    }
    return (await toolDef.tool.execute(input, {
      toolCallId: "test-tool-call",
      messages: [],
    })) as T
  }

  const runInContext = async <T>(fn: () => Promise<T>): Promise<T> => {
    return config.doInContext(undefined, fn)
  }

  const isStepsResult = (
    result: TriggerAutomationResult
  ): result is TriggerAutomationStepsResult => {
    return "steps" in result
  }

  const isErrorResult = (
    result: TriggerAutomationResult
  ): result is TriggerAutomationErrorResult => {
    return "error" in result
  }

  beforeAll(async () => {
    await automation.init()
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  describe("trigger_automation tool", () => {
    it("should trigger an automation and return all step outputs", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction()
        .serverLog({ text: "Step 1" })
        .serverLog({ text: "Step 2" })
        .save()

      const tool = getTriggerAutomationTool(targetAutomation)
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          fields: {},
        })
      )) as TriggerAutomationResult

      expect(isStepsResult(result)).toBe(true)
      if (isStepsResult(result)) {
        expect(result.status).toBe(AutomationStatus.SUCCESS)
        expect(result.steps).toBeDefined()
        expect(result.steps.length).toBeGreaterThan(0)
      }
    })

    it("should run synchronously and wait for automation completion", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction()
        .delay({ time: 100 })
        .serverLog({ text: "After delay" })
        .save()

      const tool = getTriggerAutomationTool(targetAutomation)
      const startTime = performance.now()

      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          fields: {},
        })
      )) as TriggerAutomationResult

      const endTime = performance.now()
      const totalTime = endTime - startTime

      expect(totalTime).toBeGreaterThanOrEqual(100)
      expect(isStepsResult(result)).toBe(true)
      if (isStepsResult(result)) {
        expect(result.status).toBe(AutomationStatus.SUCCESS)
      }
    })

    it("should not create tool for non-APP automations", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: "ta_123" })
        .serverLog({ text: "Row saved" })
        .save()

      const tool = findTriggerAutomationTool(targetAutomation)
      expect(tool).toBeUndefined()
    })

    it("should return error for non-existent automation", async () => {
      const tool = getTriggerAutomationTool({
        _id: "non_existent_id",
        name: "Missing Automation",
        definition: {
          trigger: { stepId: AutomationTriggerStepId.APP },
        },
      })
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          fields: {},
        })
      )) as TriggerAutomationResult

      expect(isErrorResult(result)).toBe(true)
      if (isErrorResult(result)) {
        expect(result.error).toContain("not found")
      }
    })

    it("should pass fields to the triggered automation", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction({ fields: { message: AutomationIOType.STRING } })
        .serverLog({ text: "{{ trigger.fields.message }}" })
        .save()

      const tool = getTriggerAutomationTool(targetAutomation)
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          fields: { message: "Hello from agent" },
        })
      )) as TriggerAutomationResult

      expect(isStepsResult(result)).toBe(true)
      if (isStepsResult(result)) {
        expect(result.status).toBe(AutomationStatus.SUCCESS)
      }
    })
  })
})
