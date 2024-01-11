jest.spyOn(global.console, "error")

import * as setup from "./utilities"
import * as automation from "../index"
import { serverLogAutomation } from "../../tests/utilities/structures"

describe("Test triggering an automation from another automation", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(async () => {
    await automation.shutdown()
    setup.afterAll()
  })

  it("should trigger an other server log automation", async () => {
    let automation = serverLogAutomation()
    let newAutomation = await config.createAutomation(automation)

    const inputs: any = { automationId: newAutomation._id, timeout: 12000 }
    const res = await setup.runStep(setup.actions.TRIGGER.stepId, inputs)
    // Check if the SERVER_LOG step was successful
    expect(res.value[1].outputs.success).toBe(true)
  })

  it("should fail gracefully if the automation id is incorrect", async () => {
    const inputs: any = { automationId: null, timeout: 12000 }
    const res = await setup.runStep(setup.actions.TRIGGER.stepId, inputs)
    expect(res.success).toBe(false)
  })
})
