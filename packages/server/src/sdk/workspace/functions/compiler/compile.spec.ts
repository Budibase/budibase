import { join } from "path"
import { generateFunctionDeclarations } from "../declarations"
import { compileFunctionInProcess } from "./compile"
import { runFunctionCompilerProcess } from "./index"

const declarations = generateFunctionDeclarations([])

describe("Function compiler", () => {
  it("type-checks and bundles a valid async entrypoint", async () => {
    const result = await compileFunctionInProcess({
      declarations,
      source: `import { inputs, type FunctionResult } from "@budibase/functions"

export default async function (): Promise<FunctionResult> {
  return { output: { value: inputs.value || null } }
}`,
    })

    expect(result.diagnostics).toEqual([])
    expect(result.output?.compiledJavaScript).toContain(
      "__budibaseFunctionsRuntime"
    )
    expect(result.output?.compiledJavaScript).not.toContain(
      'from "@budibase/functions"'
    )
    expect(result.output?.sourceMap).toBeDefined()
  })

  it("returns TypeScript diagnostics without bundling invalid source", async () => {
    const result = await compileFunctionInProcess({
      declarations,
      source: `export default async function () {
  const value: string = 42
  return { output: { value } }
}`,
    })

    expect(result.output).toBeUndefined()
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "TS2322",
          line: 2,
        }),
      ])
    )
  })

  it.each([
    {
      source: 'import fs from "fs"\nexport default async function () {}',
      code: "FUNCTION_IMPORT_NOT_ALLOWED",
    },
    {
      source: 'export default async function () { await import("x") }',
      code: "FUNCTION_DYNAMIC_IMPORT_NOT_ALLOWED",
    },
    {
      source: 'export default async function () { require("x") }',
      code: "FUNCTION_IMPORT_NOT_ALLOWED",
    },
  ])("rejects prohibited module loading", async ({ source, code }) => {
    const result = await compileFunctionInProcess({ declarations, source })

    expect(result.output).toBeUndefined()
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([expect.objectContaining({ code })])
    )
  })

  it.each([
    "export default function () {}",
    "export const value = 1",
    "const entrypoint = async () => {}\nexport default entrypoint",
  ])("rejects an invalid entrypoint", async source => {
    const result = await compileFunctionInProcess({ declarations, source })

    expect(result.output).toBeUndefined()
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "FUNCTION_ENTRYPOINT_INVALID" }),
      ])
    )
  })

  it("bounds compiler diagnostics", async () => {
    const assignments = Array.from(
      { length: 60 },
      (_, index) => `const value${index}: string = ${index}`
    ).join("\n")
    const result = await compileFunctionInProcess({
      declarations,
      source: `${assignments}\nexport default async function () {}`,
    })

    expect(result.diagnostics).toHaveLength(50)
    expect(result.diagnostics.every(item => item.message.length <= 512)).toBe(
      true
    )
  })

  it("terminates a compiler child at the deadline", async () => {
    const result = await runFunctionCompilerProcess(
      { declarations, source: "export default async function () {}" },
      {
        timeoutMs: 50,
        workerPath: join(__dirname, "tests/fixtures/hangingCompiler.js"),
      }
    )

    expect(result).toEqual({
      diagnostics: [
        expect.objectContaining({ code: "FUNCTION_COMPILE_TIMEOUT" }),
      ],
    })
  })

  it("contains compiler child failures", async () => {
    const result = await runFunctionCompilerProcess(
      { declarations, source: "export default async function () {}" },
      {
        timeoutMs: 5_000,
        workerPath: join(__dirname, "tests/fixtures/failedCompiler.js"),
      }
    )

    expect(result).toEqual({
      diagnostics: [
        expect.objectContaining({ code: "FUNCTION_COMPILE_ERROR" }),
      ],
    })
  })

  it("rejects invalid diagnostics returned by the compiler child", async () => {
    const result = await runFunctionCompilerProcess(
      { declarations, source: "export default async function () {}" },
      {
        timeoutMs: 5_000,
        workerPath: join(__dirname, "tests/fixtures/invalidCompiler.js"),
      }
    )

    expect(result).toEqual({
      diagnostics: [
        expect.objectContaining({ code: "FUNCTION_COMPILE_ERROR" }),
      ],
    })
  })
})
