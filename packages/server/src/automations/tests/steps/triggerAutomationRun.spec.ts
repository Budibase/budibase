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
})
