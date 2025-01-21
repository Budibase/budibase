import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import * as automation from "../index"
import * as setup from "./utilities"
import { Table } from "@budibase/types"

describe("Execute Script Automations", () => {
  let config = setup.getConfig(),
    table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(setup.afterAll)

  it("should execute a basic script and return the result", async () => {
    const builder = createAutomationBuilder({
      name: "Basic Script Execution",
    })

    const results = await builder
      .appAction({ fields: {} })
      .executeScript({ code: "return 2 + 2" })
      .run()

    expect(results.steps[0].outputs.value).toEqual(4)
  })

  it("should access bindings from previous steps", async () => {
    const builder = createAutomationBuilder({
      name: "Access Bindings",
    })

    const results = await builder
      .appAction({ fields: { data: [1, 2, 3] } })
      .executeScript(
        {
          code: "return trigger.fields.data.map(x => x * 2)",
        },
        { stepId: "binding-script-step" }
      )
      .run()

    expect(results.steps[0].outputs.value).toEqual([2, 4, 6])
  })

  it("should handle script execution errors gracefully", async () => {
    const builder = createAutomationBuilder({
      name: "Handle Script Errors",
    })

    const results = await builder
      .appAction({ fields: {} })
      .executeScript({ code: "return nonexistentVariable.map(x => x)" })
      .run()

    expect(results.steps[0].outputs.response).toContain(
      "ReferenceError: nonexistentVariable is not defined"
    )
    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should handle conditional logic in scripts", async () => {
    const builder = createAutomationBuilder({
      name: "Conditional Script Logic",
    })

    const results = await builder
      .appAction({ fields: { value: 10 } })
      .executeScript({
        code: `
            if (trigger.fields.value > 5) {
              return "Value is greater than 5";
            } else {
              return "Value is 5 or less";
            }
          `,
      })
      .run()

    expect(results.steps[0].outputs.value).toEqual("Value is greater than 5")
  })

  it("should use multiple steps and validate script execution", async () => {
    const builder = createAutomationBuilder({
      name: "Multi-Step Script Execution",
    })

    const results = await builder
      .appAction({ fields: {} })
      .serverLog(
        { text: "Starting multi-step automation" },
        { stepId: "start-log-step" }
      )
      .createRow(
        { row: { name: "Test Row", value: 42, tableId: table._id } },
        { stepId: "abc123" }
      )
      .executeScript(
        {
          code: `
            const createdRow = steps['abc123'];
            return createdRow.row.value * 2;
          `,
        },
        { stepId: "ScriptingStep1" }
      )
      .serverLog({
        text: `Final result is {{ steps.ScriptingStep1.value }}`,
      })
      .run()

    expect(results.steps[0].outputs.message).toContain(
      "Starting multi-step automation"
    )
    expect(results.steps[1].outputs.row.value).toEqual(42)
    expect(results.steps[2].outputs.value).toEqual(84)
    expect(results.steps[3].outputs.message).toContain("Final result is 84")
  })
})
