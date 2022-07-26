jest.mock("../../threads/automation")
jest.mock("../../utilities/redis", () => ({
  init: jest.fn(),
  checkTestFlag: () => {
    return false
  },
}))

jest.spyOn(global.console, "error")

require("../../environment")
const automation = require("../index")
const thread = require("../../threads/automation")
const triggers = require("../triggers")
const { basicAutomation } = require("../../tests/utilities/structures")
const { wait } = require("../../utilities")
const { makePartial } = require("../../tests/utilities")
const { cleanInputValues } = require("../automationUtils")
const setup = require("./utilities")

describe("Run through some parts of the automations system", () => {
  let config = setup.getConfig()

  beforeEach(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should be able to init in builder", async () => {
    await triggers.externalTrigger(basicAutomation(), { a: 1 })
    await wait(100)
    expect(thread.execute).toHaveBeenCalled()
  })

  it("should be able to init in prod", async () => {
    await triggers.externalTrigger(basicAutomation(), { a: 1 })
    await wait(100)
  })

  it("should check coercion", async () => {
    const table = await config.createTable()
    const automation = basicAutomation()
    automation.definition.trigger.inputs.tableId = table._id
    automation.definition.trigger.stepId = "APP"
    automation.definition.trigger.inputs.fields = { a: "number" }
    await triggers.externalTrigger(automation, {
      appId: config.getAppId(),
      fields: {
        a: "1"
      }
    })
    await wait(100)
    expect(thread.execute).toHaveBeenCalledWith(makePartial({
      data: {
        event: {
          fields: {
            a: 1
          }
        }
      }
    }), expect.any(Function))
  })

  it("should be able to clean inputs with the utilities", () => {
    // can't clean without a schema
    let output = cleanInputValues({a: "1"})
    expect(output.a).toBe("1")
    output = cleanInputValues({a: "1", b: "true", c: "false", d: 1, e: "help"}, {
      properties: {
        a: {
          type: "number",
        },
        b: {
          type: "boolean",
        },
        c: {
          type: "boolean",
        }
      }
    })
    expect(output.a).toBe(1)
    expect(output.b).toBe(true)
    expect(output.c).toBe(false)
    expect(output.d).toBe(1)
    expect(output.e).toBe("help")
  })
})
