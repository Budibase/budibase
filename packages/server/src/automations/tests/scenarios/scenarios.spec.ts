import { createAutomationBuilder } from "../utilities/AutomationBuilder"
import { TRIGGER_DEFINITIONS, BUILTIN_ACTION_DEFINITIONS } from "../.."

const setup = require("./utilities")

describe("Automation Builder Tests", () => {
  let config: any

  beforeAll(async () => {
    config = setup.getConfig()
    await config.init()
  })

  it("should run a ROW_SAVE and CREATE_ROW automation", async () => {
    const table = await config.createTable()

    const results = await createAutomationBuilder(config)
      .trigger(TRIGGER_DEFINITIONS.ROW_SAVED, { tableId: table._id })
      .step(BUILTIN_ACTION_DEFINITIONS.CREATE_ROW, {
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id,
        },
      })
      .run({
        row: {
          name: "Test",
          description: "TEST",
        },
      })

    expect(results.trigger).toBeDefined()
    expect(results.steps[0]).toBeDefined()
    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[0].outputs.row.name).toBe("Test")
    expect(results.steps[0].outputs.row.description).toBe("TEST")
  })
})
