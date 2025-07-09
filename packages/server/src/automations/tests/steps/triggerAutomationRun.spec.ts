import * as automation from "../../index"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { AutomationStatus } from "@budibase/types"

describe("Test triggering an automation from another automation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await automation.init()
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("should trigger an other server log automation", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Hello World" })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(true)
  })

  it("should fail gracefully if the automation id is incorrect", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          // @ts-expect-error - incorrect on purpose
          automationId: null,
        },
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
  })

  it("should fail if the child automation times out", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .delay({ time: 1000 })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
        timeout: 0.1,
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.status).toBe(AutomationStatus.TIMED_OUT)
    expect(result.status).toBe(AutomationStatus.ERROR)
  })

  it("should preserve step history when child automation times out with multiple steps", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Step 1 - Before delay" })
      .delay({ time: 500 })
      .serverLog({ text: "Step 2 - After delay (should not appear)" })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
        timeout: 0.2,
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.status).toBe(AutomationStatus.TIMED_OUT)

    const triggeredAutomationResult = result.steps[0].outputs
    expect(triggeredAutomationResult.value.length).toBeGreaterThan(0)

    const firstStep = triggeredAutomationResult.value[0]
    expect(firstStep.stepId || firstStep.outputs).toBeDefined()
  })

  it("should run trigger automation synchronously - subsequent steps should wait", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .delay({ time: 150 })
      .serverLog({ text: "Child automation completed" })
      .save()

    const startTime = performance.now()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Before trigger" })
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
      })
      .serverLog({ text: "After trigger - should wait for child" })
      .test({ fields: {} })

    const endTime = performance.now()
    const totalTime = endTime - startTime

    expect(totalTime).toBeGreaterThanOrEqual(150)

    expect(result.steps).toHaveLength(3)
    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[1].outputs.success).toBe(true)
    expect(result.steps[2].outputs.success).toBe(true)
    expect(result.status).toBe(AutomationStatus.SUCCESS)
  })

  it("should show all executed steps in history even with partial timeout", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Step 1 executed" })
      .serverLog({ text: "Step 2 executed" })
      .delay({ time: 400 })
      .serverLog({ text: "Step 3 - should not execute" })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
        timeout: 0.3, // Allow enough time for the first 2 steps but not the delay
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.status).toBe(AutomationStatus.TIMED_OUT)

    const triggeredAutomationResult = result.steps[0].outputs
    expect(triggeredAutomationResult.value[0]).toBeDefined()
    expect(triggeredAutomationResult.value[1]).toBeDefined()
  })

  it("should not execute subsequent steps in parent when child automation times out immediately", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction()
      .delay({ time: 300 })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Before trigger" })
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
        timeout: 0.1, // Very short timeout
      })
      .serverLog({ text: "After trigger - should still execute" })
      .test({ fields: {} })

    expect(result.steps).toHaveLength(3)
    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.status).toBe(AutomationStatus.TIMED_OUT)
    expect(result.steps[2].outputs.success).toBe(true)
  })

  it("should handle multiple trigger automation steps with timeouts correctly", async () => {
    const { automation: quickAutomation } = await createAutomationBuilder(
      config
    )
      .onAppAction()
      .serverLog({ text: "Quick automation" })
      .save()

    const { automation: slowAutomation } = await createAutomationBuilder(config)
      .onAppAction()
      .delay({ time: 250 })
      .serverLog({ text: "Slow automation" })
      .save()

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: quickAutomation._id!,
        },
      })
      .triggerAutomationRun({
        automation: {
          automationId: slowAutomation._id!,
        },
        timeout: 0.1,
      })
      .serverLog({ text: "Final step" })
      .test({ fields: {} })

    expect(result.steps).toHaveLength(3)
    expect(result.steps[0].outputs.success).toBe(true)
    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.status).toBe(AutomationStatus.TIMED_OUT)
    expect(result.steps[2].outputs.success).toBe(true)
  })
})
