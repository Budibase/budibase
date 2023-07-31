jest.mock("../../threads/automation")
jest.mock("../../utilities/redis", () => ({
  init: jest.fn(),
  checkTestFlag: () => {
    return false
  },
  shutdown: jest.fn(),
}))

jest.spyOn(global.console, "error")

import "../../environment"
import * as automation from "../index"
import * as thread from "../../threads/automation"
import * as triggers from "../triggers"
import { basicAutomation } from "../../tests/utilities/structures"
import { wait } from "../../utilities"
import { makePartial } from "../../tests/utilities"
import { cleanInputValues } from "../automationUtils"
import * as setup from "./utilities"
import { Automation } from "@budibase/types"

describe("Run through some parts of the automations system", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(async () => {
    await automation.shutdown()
    setup.afterAll()
  })

  it("should be able to init in builder", async () => {
    const automation: Automation = {
      ...basicAutomation(),
      appId: config.appId,
    }
    const fields: any = { a: 1, appId: config.appId }
    await triggers.externalTrigger(automation, fields)
    await wait(100)
    expect(thread.execute).toHaveBeenCalled()
  })

  it("should check coercion", async () => {
    const table = await config.createTable()
    const automation: any = basicAutomation()
    automation.definition.trigger.inputs.tableId = table._id
    automation.definition.trigger.stepId = "APP"
    automation.definition.trigger.inputs.fields = { a: "number" }
    const fields: any = {
      appId: config.getAppId(),
      fields: {
        a: "1",
      },
    }
    await triggers.externalTrigger(automation, fields)
    await wait(100)
    expect(thread.execute).toHaveBeenCalledWith(
      makePartial({
        data: {
          event: {
            fields: {
              a: 1,
            },
          },
        },
      }),
      expect.any(Function)
    )
  })

  it("should be able to clean inputs with the utilities", () => {
    // can't clean without a schema
    let output = cleanInputValues({ a: "1" })
    expect(output.a).toBe("1")
    output = cleanInputValues(
      { a: "1", b: "true", c: "false", d: 1, e: "help" },
      {
        properties: {
          a: {
            type: "number",
          },
          b: {
            type: "boolean",
          },
          c: {
            type: "boolean",
          },
        },
      }
    )
    expect(output.a).toBe(1)
    expect(output.b).toBe(true)
    expect(output.c).toBe(false)
    expect(output.d).toBe(1)
  })
})
