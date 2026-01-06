import * as automation from "../../../../automations"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../../../../automations/tests/utilities/AutomationTestBuilder"
import {
  AutomationIOType,
  AutomationStatus,
  AutomationStepResult,
  AutomationTriggerResult,
} from "@budibase/types"
import automationTools from "../automations"

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

  const getTriggerAutomationTool = () => {
    const tool = automationTools.find(t => t.name === "trigger_automation")
    if (!tool) {
      throw new Error("trigger_automation tool not found")
    }
    return tool
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

      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: "{}",
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

      const tool = getTriggerAutomationTool()
      const startTime = performance.now()

      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: "{}",
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

    it("should return error for non-APP trigger automations", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: "ta_123" })
        .serverLog({ text: "Row saved" })
        .save()

      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: "{}",
        })
      )) as TriggerAutomationResult

      expect(isErrorResult(result)).toBe(true)
      if (isErrorResult(result)) {
        expect(result.error).toContain("Only APP trigger type supported")
      }
    })

    it("should return error for non-existent automation", async () => {
      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: "non_existent_id",
          fields: "{}",
        })
      )) as TriggerAutomationResult

      expect(isErrorResult(result)).toBe(true)
      if (isErrorResult(result)) {
        expect(result.error).toContain("not found")
      }
    })

    it("should return error for invalid JSON in fields", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction()
        .serverLog({ text: "Test" })
        .save()

      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: "invalid json",
        })
      )) as TriggerAutomationResult

      expect(isErrorResult(result)).toBe(true)
      if (isErrorResult(result)) {
        expect(result.error).toContain("Invalid JSON")
      }
    })

    it("should pass fields to the triggered automation", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction({ fields: { message: AutomationIOType.STRING } })
        .serverLog({ text: "{{ trigger.fields.message }}" })
        .save()

      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: JSON.stringify({ message: "Hello from agent" }),
        })
      )) as TriggerAutomationResult

      expect(isStepsResult(result)).toBe(true)
      if (isStepsResult(result)) {
        expect(result.status).toBe(AutomationStatus.SUCCESS)
      }
    })

    it("should handle timeout parameter", async () => {
      const { automation: targetAutomation } = await createAutomationBuilder(
        config
      )
        .onAppAction()
        .delay({ time: 500 })
        .serverLog({ text: "After long delay" })
        .save()

      const tool = getTriggerAutomationTool()
      const result = (await runInContext(() =>
        executeTool<TriggerAutomationResult>(tool, {
          automationId: targetAutomation._id!,
          fields: "{}",
          timeout: 0.1,
        })
      )) as TriggerAutomationResult

      // Timeout still returns steps but with success: false
      expect(isStepsResult(result)).toBe(true)
      if (isStepsResult(result)) {
        expect(result.success).toBe(false)
        expect(result.status).toBe(AutomationStatus.TIMED_OUT)
      }
    })
  })
})
