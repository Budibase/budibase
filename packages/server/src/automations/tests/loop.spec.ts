import * as automation from "../index"
import * as triggers from "../triggers"
import { loopAutomation } from "../../tests/utilities/structures"
import { context } from "@budibase/backend-core"
import * as setup from "./utilities"

describe("Attempt to run a basic loop automation", () => {
  let config = setup.getConfig(),
    table: any,
    row: any

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    row = await config.createRow()
  })

  afterAll(setup.afterAll)

  async function runLoop(loopOpts?: any) {
    const appId = config.getAppId()
    return await context.doInAppContext(appId, async () => {
      const params = { fields: { appId } }
      return await triggers.externalTrigger(
        loopAutomation(table._id, loopOpts),
        params,
        { getResponses: true }
      )
    })
  }

  it("attempt to run a basic loop", async () => {
    const resp = await runLoop()
    expect(resp.steps[2].outputs.iterations).toBe(1)
  })

  it("test a loop with a string", async () => {
    const resp = await runLoop({
      type: "String",
      binding: "a,b,c",
    })
    expect(resp.steps[2].outputs.iterations).toBe(3)
  })
})
