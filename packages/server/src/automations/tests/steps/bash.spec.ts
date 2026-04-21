import fs from "fs"
import os from "os"
import path from "path"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import * as automation from "../../index"
import { Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("Execute Bash Automations", () => {
  const config = new TestConfiguration()
  let table: Table
  const writeFileScript =
    "require('fs').writeFileSync(process.argv[1], 'initial content')"
  const uppercaseFileScript =
    "const fs = require('fs'); process.stdout.write(fs.readFileSync(process.argv[1], 'utf8').toUpperCase() + '\\n')"
  const deleteFileScript = "require('fs').unlinkSync(process.argv[1])"
  const addFiveScript =
    "process.stdout.write(String(Number(process.argv[1]) + 5) + '\\n')"

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

  afterEach(() => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")
    if (fs.existsSync(injectedPath)) {
      fs.unlinkSync(injectedPath)
    }
  })

  it("should use trigger data in bash command and pass output to subsequent steps", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "echo",
          args: ["{{ trigger.fields.command }}"],
        },
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
        {
          command: "node",
          args: ["-e", writeFileScript, "{{ trigger.fields.filename }}"],
        },
        { stepName: "Create File" }
      )
      .bash(
        {
          command: "node",
          args: ["-e", uppercaseFileScript, "{{ trigger.fields.filename }}"],
        },
        { stepName: "Transform Content" }
      )
      .bash(
        {
          command: "node",
          args: ["-e", deleteFileScript, "{{ trigger.fields.filename }}"],
        },
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
        { stepName: "Get row" }
      )
      .bash(
        {
          command: "echo",
          args: [
            "Row data: {{ steps.[Get row].rows.[0].name }} - {{ steps.[Get row].rows.[0].description }}",
          ],
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
        {
          command: "node",
          args: ["-e", addFiveScript, "{{ trigger.fields.threshold }}"],
        },
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

  it("should escape unquoted bindings before executing the command", async () => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")
    const payload = `hello; touch ${injectedPath}`

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "echo",
          args: ["{{ trigger.fields.command }}"],
        },
        { stepName: "Echo Command" }
      )
      .test({ fields: { command: payload } })

    expect(result.steps[0].outputs.stdout).toEqual(`${payload}\n`)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it("should reject command bindings", async () => {
    const payload = "echo"

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "{{ trigger.fields.command }}",
          args: ["hello world"],
        },
        { stepName: "Dynamic Command" }
      )
      .test({ fields: { command: payload } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(result.steps[0].outputs.stdout).toEqual(
      "Budibase bash automation failed: Command bindings are not supported. Use the args field for dynamic values."
    )
  })

  it("should accept args provided in the builder JSON editor shape", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "echo",
          args: {
            value: JSON.stringify(["{{ trigger.fields.command }}"]),
          },
        },
        { stepName: "JSON Editor Args" }
      )
      .test({ fields: { command: "hello world" } })

    expect(result.steps[0].outputs.success).toEqual(true)
    expect(result.steps[0].outputs.stdout).toEqual("hello world\n")
  })

  it("should reject invalid JSON editor args", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "echo",
          args: {
            value: "{ invalid json }",
          },
        },
        { stepName: "Invalid JSON Editor Args" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(result.steps[0].outputs.response).toEqual(
      "Budibase bash automation failed: Args must be a JSON array of strings."
    )
  })

  it("should handle null values gracefully", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        // @ts-expect-error - testing null input
        { command: null },
        { stepName: "Null Command" }
      )
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.stdout).toBe(
      "Budibase bash automation failed: Invalid inputs"
    )
  })

  it("should reject empty commands as failed invalid inputs", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({ command: "   " }, { stepName: "Empty Command" })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toBe(false)
    expect(result.steps[0].outputs.stdout).toBe(
      "Budibase bash automation failed: Invalid inputs"
    )
  })
})
