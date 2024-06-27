jest.spyOn(global.console, "error")

import { runStep } from "./utilities"
import { init, shutdown } from "../index"
import { serverLogAutomation } from "../../tests/utilities/structures"
import env from "../../environment"
import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"
import { AutomationActionStepId } from "@budibase/types"

describe("Test triggering an automation from another automation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await init()
    await config.init()
  })

  afterAll(async () => {
    await shutdown()
    config.end()
  })

  it("should trigger an other server log automation", async () => {
    let automation = serverLogAutomation()
    let newAutomation = await config.createAutomation(automation)

    const inputs: any = {
      automation: {
        automationId: newAutomation._id,
        timeout: env.getDefaults().AUTOMATION_THREAD_TIMEOUT,
      },
    }
    const res = await runStep(
      config,
      AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
      inputs
    )
    // Check if the SERVER_LOG step was successful
    expect(res.value[1].outputs.success).toBe(true)
  })

  it("should fail gracefully if the automation id is incorrect", async () => {
    const inputs: any = {
      automation: {
        automationId: null,
        timeout: env.getDefaults().AUTOMATION_THREAD_TIMEOUT,
      },
    }
    const res = await runStep(
      config,
      AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
      inputs
    )
    expect(res.success).toBe(false)
  })
})
