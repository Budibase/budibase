import * as automation from "../../index"
import env from "../../../environment"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Test triggering an automation from another automation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("should trigger an other server log automation", async () => {
    const automation = await createAutomationBuilder(config)
      .serverLog({ text: "Hello World" })
      .save()

    const result = await createAutomationBuilder(config)
      .triggerAutomationRun({
        automation: {
          automationId: automation._id!,
        },
        timeout: env.getDefaults().AUTOMATION_THREAD_TIMEOUT,
      })
      .run()

    expect(result.steps[0].outputs.success).toBe(true)
  })

  it("should fail gracefully if the automation id is incorrect", async () => {
    const result = await createAutomationBuilder(config)
      .triggerAutomationRun({
        automation: {
          // @ts-expect-error - incorrect on purpose
          automationId: null,
        },
        timeout: env.getDefaults().AUTOMATION_THREAD_TIMEOUT,
      })
      .run()

    expect(result.steps[0].outputs.success).toBe(false)
  })
})
