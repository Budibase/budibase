import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("Execute Script Automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await automation.init()
    await config.init()
    table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {})
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should execute a basic script and return the result", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({ code: "return 2 + 2" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.value).toEqual(4)
  })

  it("should access bindings from previous steps", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript(
        {
          code: "return trigger.fields.data.map(x => x * 2)",
        },
        { stepId: "binding-script-step" }
      )
      .test({ fields: { data: [1, 2, 3] } })

    expect(results.steps[0].outputs.value).toEqual([2, 4, 6])
  })

  it("should handle script execution errors gracefully", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({ code: "return nonexistentVariable.map(x => x)" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response).toContain(
      "ReferenceError: nonexistentVariable is not defined"
    )
    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should handle conditional logic in scripts", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({
        code: `
            if (trigger.fields.value > 5) {
              return "Value is greater than 5";
            } else {
              return "Value is 5 or less";
            }
          `,
      })
      .test({ fields: { value: 10 } })

    expect(results.steps[0].outputs.value).toEqual("Value is greater than 5")
  })

  it("should use multiple steps and validate script execution", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    expect(results.steps[0].outputs.message).toContain(
      "Starting multi-step automation"
    )
    expect(results.steps[1].outputs.row.value).toEqual(42)
    expect(results.steps[2].outputs.value).toEqual(84)
    expect(results.steps[3].outputs.message).toContain("Final result is 84")
  })
})
