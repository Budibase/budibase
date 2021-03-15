const automation = require("../index")
const usageQuota = require("../../utilities/usageQuota")
const thread = require("../thread")
const triggers = require("../triggers")
const { basicAutomation, basicTable } = require("../../tests/utilities/structures")
const { wait } = require("../../utilities")
const env = require("../../environment")
const { makePartial } = require("../../tests/utilities")
const { cleanInputValues } = require("../automationUtils")
const setup = require("./utilities")

let workerJob

jest.mock("../../utilities/usageQuota")
usageQuota.getAPIKey.mockReturnValue({ apiKey: "test" })
jest.mock("../thread")
jest.spyOn(global.console, "error")
jest.mock("worker-farm", () => {
  return () => {
    const value = jest
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce("Error")
    return (input, callback) => {
      workerJob = input
      if (callback) {
        callback(value())
      }
    }
  }
})

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
    expect(workerJob).toBeUndefined()
    expect(thread).toHaveBeenCalled()
  })

  it("should be able to init in cloud", async () => {
    env.CLOUD = true
    env.BUDIBASE_ENVIRONMENT = "PRODUCTION"
    await triggers.externalTrigger(basicAutomation(), { a: 1 })
    await wait(100)
    // haven't added a mock implementation so getAPIKey of usageQuota just returns undefined
    expect(usageQuota.update).toHaveBeenCalledWith("test", "automationRuns", 1)
    expect(workerJob).toBeDefined()
    env.BUDIBASE_ENVIRONMENT = "JEST"
    env.CLOUD = false
  })

  it("try error scenario", async () => {
    env.CLOUD = true
    env.BUDIBASE_ENVIRONMENT = "PRODUCTION"
    // the second call will throw an error
    await triggers.externalTrigger(basicAutomation(), { a: 1 })
    await wait(100)
    expect(console.error).toHaveBeenCalled()
    env.BUDIBASE_ENVIRONMENT = "JEST"
    env.CLOUD = false
  })

  it("should be able to check triggering row filling", async () => {
    const automation = basicAutomation()
    let table = basicTable()
    table.schema.boolean = {
      type: "boolean",
      constraints: {
        type: "boolean",
      },
    }
    table.schema.number = {
      type: "number",
      constraints: {
        type: "number",
      },
    }
    table.schema.datetime = {
      type: "datetime",
      constraints: {
        type: "datetime",
      },
    }
    table = await config.createTable(table)
    automation.definition.trigger.inputs.tableId = table._id
    const params = await triggers.fillRowOutput(automation, { appId: config.getAppId() })
    expect(params.row).toBeDefined()
    const date = new Date(params.row.datetime)
    expect(typeof params.row.name).toBe("string")
    expect(typeof params.row.boolean).toBe("boolean")
    expect(typeof params.row.number).toBe("number")
    expect(date.getFullYear()).toBe(1970)
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
    expect(thread).toHaveBeenCalledWith(makePartial({
      data: {
        event: {
          fields: {
            a: 1
          }
        }
      }
    }))
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