import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("Execute Bash Automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await automation.init()
    await config.init()
    table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {
      name: "test row",
      description: "test description",
    })
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    automation.shutdown()
    config.end()
  })

  it("should use trigger data in bash command and pass output to subsequent steps", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        { code: "echo '{{ trigger.fields.command }}'" },
        { stepName: "Echo Command" }
      )
      .serverLog(
        { text: "Bash output was: {{ steps.[Echo Command].stdout }}" },
        { stepName: "Log Output" }
      )
      .test({ fields: { command: "hello world" } })

    expect(result.steps[0].outputs.stdout).toEqual("hello world\n")
    expect(result.steps[1].outputs.message).toContain(
      "Bash output was: hello world"
    )
  })

  it("should chain multiple bash commands using previous outputs", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        { code: "echo 'initial content' > {{ trigger.fields.filename }}" },
        { stepName: "Create File" }
      )
      .bash(
        { code: "cat {{ trigger.fields.filename }} | tr '[a-z]' '[A-Z]'" },
        { stepName: "Transform Content" }
      )
      .bash(
        { code: "rm {{ trigger.fields.filename }}" },
        { stepName: "Cleanup" }
      )
      .test({ fields: { filename: "testfile.txt" } })

    expect(result.steps[1].outputs.stdout).toEqual("INITIAL CONTENT\n")
    expect(result.steps[1].outputs.success).toEqual(true)
  })

  it("should integrate bash output with row operations", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows(
        {
          tableId: table._id!,
          filters: {},
        },
        { stepName: "Get Row" }
      )
      .bash(
        {
          code: "echo Row data: {{ steps.[Get Row].rows.[0].name }} - {{ steps.[Get Row].rows.[0].description }}",
        },
        { stepName: "Process Row Data" }
      )
      .serverLog(
        { text: "{{ steps.[Process Row Data].stdout }}" },
        { stepName: "Log Result" }
      )
      .test({ fields: {} })

    expect(result.steps[1].outputs.stdout).toContain(
      "Row data: test row - test description"
    )
    expect(result.steps[2].outputs.message).toContain(
      "Row data: test row - test description"
    )
  })

  it("should handle bash output in conditional logic", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        { code: "echo $(( {{ trigger.fields.threshold }} + 5 ))" },
        { stepName: "Calculate Value" }
      )
      .executeScript(
        {
          code: `
            const value = parseInt(steps["Calculate Value"].stdout);
            return value > 8 ? "high" : "low";
          `,
        },
        { stepName: "Check Value" }
      )
      .serverLog(
        { text: "Value was {{ steps.[Check Value].value }}" },
        { stepName: "Log Result" }
      )
      .test({ fields: { threshold: "5" } })

    expect(result.steps[0].outputs.stdout).toEqual("10\n")
    expect(result.steps[1].outputs.value).toEqual("high")
    expect(result.steps[2].outputs.message).toContain("Value was high")
  })

  it("should handle null values gracefully", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        // @ts-expect-error - testing null input
        { code: null },
        { stepName: "Null Command" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.stdout).toBe(
      "Budibase bash automation failed: Invalid inputs"
    )
  })
})
