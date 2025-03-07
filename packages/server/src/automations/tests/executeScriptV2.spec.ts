import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import * as automation from "../index"
import * as setup from "./utilities"
import { Table } from "@budibase/types"

function encodeJS(js: string): string {
  return `{{ js "${Buffer.from(js, "utf-8").toString("base64")}" }}`
}

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
    config.name = "Basic Script Execution"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2({ code: encodeJS("return 2 + 2") })
      .test({ fields: {} })

    expect(results.steps[0].outputs.value).toEqual(4)
  })

  it("should access bindings from previous steps", async () => {
    config.name = "Access Bindings"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2(
        {
          code: encodeJS(`return $("trigger.fields.data").map(x => x * 2)`),
        },
        { stepId: "binding-script-step" }
      )
      .test({ fields: { data: [1, 2, 3] } })

    expect(results.steps[0].outputs.value).toEqual([2, 4, 6])
  })

  it("should handle script execution errors gracefully", async () => {
    config.name = "Handle Script Errors"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2({
        code: encodeJS("return nonexistentVariable.map(x => x)"),
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response).toContain(
      "ReferenceError: nonexistentVariable is not defined"
    )
    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("should handle conditional logic in scripts", async () => {
    config.name = "Conditional Script Logic"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2({
        code: encodeJS(`
            if ($("trigger.fields.value") > 5) {
              return "Value is greater than 5";
            } else {
              return "Value is 5 or less";
            }
          `),
      })
      .test({ fields: { value: 10 } })

    expect(results.steps[0].outputs.value).toEqual("Value is greater than 5")
  })

  it("should use multiple steps and validate script execution", async () => {
    config.name = "Multi-Step Script Execution"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .serverLog(
        { text: "Starting multi-step automation" },
        { stepId: "start-log-step" }
      )
      .createRow(
        { row: { name: "Test Row", value: 42, tableId: table._id } },
        { stepId: "abc123" }
      )
      .executeScriptV2(
        {
          code: encodeJS(`
            const createdRow = $("steps")['abc123'];
            return createdRow.row.value * 2;
          `),
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

  it("should fail if the code has not been encoded as a handlebars template", async () => {
    config.name = "Invalid Code Encoding"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2({
        code: "return 2 + 2",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.response.message).toEqual(
      "Expected code to be a {{ js }} template block"
    )
    expect(results.steps[0].outputs.success).toEqual(false)
  })

  it("does not process embedded handlebars templates", async () => {
    config.name = "Embedded Handlebars"
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .executeScriptV2({
        code: encodeJS(`return "{{ triggers.row.whatever }}"`),
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.value).toEqual(
      "{{ triggers.row.whatever }}"
    )
    expect(results.steps[0].outputs.success).toEqual(true)
  })
})
