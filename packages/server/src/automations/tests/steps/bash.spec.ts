import execa from "execa"
import fs from "fs"
import os from "os"
import path from "path"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { run as runBash } from "../../steps/bash"
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

  it.each(["bash", "sh"])(
    "should reject bindings in %s script arguments",
    async command => {
      const injectedPath = path.join(
        os.tmpdir(),
        "budibase-bash-step-injection"
      )
      const payload = `safe'; printf injected > ${injectedPath}; #`

      const result = await createAutomationBuilder(config)
        .onAppAction()
        .bash({
          command,
          args: ["-c", "printf '%s\\n' '{{ trigger.fields.value }}'"],
        })
        .test({ fields: { value: payload } })

      expect(result.steps[0].outputs.success).toEqual(false)
      expect(fs.existsSync(injectedPath)).toEqual(false)
    }
  )

  it("should reject bindings in node script arguments", async () => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")
    const payload = `safe'); require('fs').writeFileSync('${injectedPath}', 'injected'); //`

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: "node",
        args: ["-e", "process.stdout.write('{{ trigger.fields.value }}')"],
      })
      .test({ fields: { value: payload } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it.each([
    { command: "env", args: ["bash", "-c"] },
    { command: "env", args: ["-u", "BASH_ENV", "bash", "-c"] },
    { command: "timeout", args: ["5", "bash", "-c"] },
    { command: "timeout", args: ["--signal", "TERM", "5", "bash", "-c"] },
  ])("should reject script bindings through $command", async input => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")
    const payload = `safe'; printf injected > ${injectedPath}; #`

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: input.command,
        args: [...input.args, "printf '%s\\n' '{{ trigger.fields.value }}'"],
      })
      .test({ fields: { value: payload } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it.each([
    { command: "env", prefix: ["-S"] },
    { command: "timeout", prefix: ["5", "env", "-S"] },
  ])(
    "should reject a bound executable inside $command before execution",
    async input => {
      const execute = jest.spyOn(execa, "sync").mockImplementation(() => {
        throw new Error("Unexpected subprocess")
      })
      try {
        const result = await runBash({
          inputs: {
            command: input.command,
            args: [...input.prefix, "{{ executable }}"],
          },
          context: { executable: "echo" },
        })
        expect(result.response).toContain("Command bindings are not supported")
        expect(execute).not.toHaveBeenCalled()
      } finally {
        execute.mockRestore()
      }
    }
  )

  it("should reject a script binding when another Bash flag follows c", async () => {
    const execute = jest.spyOn(execa, "sync").mockImplementation(() => {
      throw new Error("Unexpected subprocess")
    })
    try {
      const result = await runBash({
        inputs: { command: "bash", args: ["-ce", "{{ script }}"] },
        context: { script: "true" },
      })
      expect(result.response).toContain("Script bindings are not supported")
      expect(execute).not.toHaveBeenCalled()
    } finally {
      execute.mockRestore()
    }
  })

  it("should reject a script binding when a dynamic option selects bash -c", async () => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: "bash",
        args: [
          "{{ trigger.fields.option }}",
          `printf '{{ trigger.fields.value }}' > ${injectedPath}`,
        ],
      })
      .test({ fields: { option: "-c", value: "unsafe" } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it.each([
    { name: "-S", args: ["-S", "bash", "-c"] },
    { name: "--split-string", args: ["--split-string", "bash", "-c"] },
    { name: "split command", args: ["-S", "bash -c"] },
  ])("should reject a script binding through env $name", async input => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: "env",
        args: [
          ...input.args,
          `printf '{{ trigger.fields.value }}' > ${injectedPath}`,
        ],
      })
      .test({ fields: { value: "unsafe" } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it.each([
    {
      command: "python3",
      option: "-Ic",
      script: (injectedPath: string) =>
        `open("${injectedPath}", "w").write("{{ trigger.fields.value }}")`,
    },
    {
      command: "node",
      option: "-pe",
      script: (injectedPath: string) =>
        `require("fs").writeFileSync("${injectedPath}", "{{ trigger.fields.value }}")`,
    },
  ])("should reject a script binding through $command $option", async input => {
    const injectedPath = path.join(os.tmpdir(), "budibase-bash-step-injection")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: input.command,
        args: [input.option, input.script(injectedPath)],
      })
      .test({ fields: { value: "unsafe" } })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(fs.existsSync(injectedPath)).toEqual(false)
  })

  it("should pass positional values through env -S to a fixed script", async () => {
    const payload = "hello'; printf injected; #"
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: "env",
        args: [
          "-S",
          "bash",
          "-c",
          'printf "%s\\n" "$1"',
          "budibase",
          "{{ trigger.fields.value }}",
        ],
      })
      .test({ fields: { value: payload } })

    expect(result.steps[0].outputs.success).toEqual(true)
    expect(result.steps[0].outputs.stdout).toEqual(`${payload}\n`)
  })

  it("should pass SOAP XML from a JavaScript step as a positional argument", async () => {
    const xml = '<Envelope><Body customer="O\'Hara">\ninvoice</Body></Envelope>'
    const caBundle = "/opt/soap-trust/host-ca-bundle.pem"

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript(
        { code: "return trigger.fields.xml" },
        { stepName: "JavaScript" }
      )
      .bash({
        command: "bash",
        args: [
          "-c",
          `request="\${1-}"; ca_bundle="\${2-}"; printf "%s\\n" "$0" "$request" "$ca_bundle"`,
          "soap-request",
          "{{{ steps.JavaScript.value }}}",
          caBundle,
        ],
      })
      .test({ fields: { xml } })

    expect(result.steps[1].outputs.success).toEqual(true)
    expect(result.steps[1].outputs.stdout).toEqual(
      `soap-request\n${xml}\n${caBundle}\n`
    )
  })

  it("should pass bindings as positional values to a fixed shell script", async () => {
    const payload = "hello'; printf injected; #"
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .bash({
        command: "bash",
        args: [
          "-c",
          'printf "%s\\n" "$1"',
          "budibase",
          "{{ trigger.fields.value }}",
        ],
      })
      .test({ fields: { value: payload } })

    expect(result.steps[0].outputs.success).toEqual(true)
    expect(result.steps[0].outputs.stdout).toEqual(`${payload}\n`)
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
