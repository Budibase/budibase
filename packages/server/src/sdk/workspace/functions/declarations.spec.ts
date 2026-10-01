import ts from "typescript"
import type {
  FunctionInputDefinition,
  FunctionQueryCapability,
} from "@budibase/types"
import {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"

const getDiagnostics = (files: Map<string, string>) => {
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    noEmit: true,
    strict: true,
    target: ts.ScriptTarget.ES2020,
    types: [],
  }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)

  host.fileExists = fileName =>
    files.has(fileName) || ts.sys.fileExists(fileName)
  host.readFile = fileName => files.get(fileName) || ts.sys.readFile(fileName)
  host.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile
  ) => {
    const source = files.get(fileName)
    if (source !== undefined) {
      return ts.createSourceFile(fileName, source, languageVersion)
    }
    return getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile
    )
  }

  const program = ts.createProgram([...files.keys()], options, host)
  return ts.getPreEmitDiagnostics(program)
}

describe("generateFunctionDeclarations", () => {
  it("generates valid declarations for parameter names requiring quoting", () => {
    const capabilities: FunctionQueryCapability[] = [
      {
        capabilityId: "capability_1",
        queryId: "query_1",
        datasourceAlias: "DataWarehouse",
        queryAlias: "findRooms",
        parameterNames: ['building "name"'],
      },
    ]
    const declarations = generateFunctionDeclarations({
      capabilities,
    })
    const usage = `import { queries } from "@budibase/functions"

queries.DataWarehouse.findRooms({
  'building "name"': null,
})
`

    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", usage],
        ])
      )
    ).toEqual([])
  })
})

describe("typed Function input declarations", () => {
  const inputSchema: FunctionInputDefinition[] = [
    {
      name: "text",
      type: "string",
      required: true,
      description: "A description */\nwith newlines",
    },
    { name: "count", type: "number", required: true },
    { name: "flag", type: "boolean", required: true },
    { name: "data", type: "object", required: true },
    { name: "items", type: "array", required: true },
  ]

  it("type-checks every supported required input type", () => {
    const declarations = generateFunctionDeclarations({
      capabilities: [],
      inputSchema,
    })
    const source = `import { inputs, type JsonValue } from "@budibase/functions"
const text: string = inputs.text
const count: number = inputs.count
const flag: boolean = inputs.flag
const data: Record<string, JsonValue> = inputs.data
const items: JsonValue[] = inputs.items
`
    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", source],
        ])
      )
    ).toEqual([])
  })

  it("type-checks every supported optional input type, including null values", () => {
    const declarations = generateFunctionDeclarations({
      capabilities: [],
      inputSchema: inputSchema.map(input => ({ ...input, required: false })),
    })
    const source = `import { inputs, type GeneratedInputs, type JsonValue } from "@budibase/functions"
const text: string | null | undefined = inputs.text
const count: number | null | undefined = inputs.count
const flag: boolean | null | undefined = inputs.flag
const data: Record<string, JsonValue> | null | undefined = inputs.data
const items: JsonValue[] | null | undefined = inputs.items
const nullable: GeneratedInputs = { text: null, count: null, flag: null, data: null, items: null }
`
    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", source],
        ])
      )
    ).toEqual([])
  })

  it("reports wrong types, unknown inputs and writes to readonly inputs", () => {
    const declarations = generateFunctionDeclarations({
      capabilities: [],
      inputSchema: inputSchema,
    })
    const diagnostics = getDiagnostics(
      new Map([
        ["functions.d.ts", declarations],
        [
          "usage.ts",
          'import { inputs } from "@budibase/functions"; const text: number = inputs.text; inputs.text = "changed"; inputs.missing',
        ],
      ])
    )
    expect(diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining([2322, 2540, 2339])
    )
  })

  it("hashes complete schema metadata deterministically", () => {
    const declarations = generateFunctionDeclarations({
      capabilities: [],
      inputSchema: inputSchema,
    })
    const hash = hashFunctionDeclarations({
      declarations: declarations,
      inputSchema: inputSchema,
    })
    expect(
      hashFunctionDeclarations({
        declarations: generateFunctionDeclarations({
          capabilities: [],
          inputSchema: [...inputSchema].reverse(),
        }),
        inputSchema: [...inputSchema].reverse(),
      })
    ).toBe(hash)
    expect(
      hashFunctionDeclarations({
        declarations: declarations,
        inputSchema: inputSchema.map(input => ({
          ...input,
          description: "changed",
        })),
      })
    ).not.toBe(hash)
    expect(generateFunctionDeclarations({ capabilities: [] })).toContain(
      "Readonly<Record<string, JsonValue>>"
    )
    expect(
      generateFunctionDeclarations({ capabilities: [], inputSchema: [] })
    ).toBe(generateFunctionDeclarations({ capabilities: [] }))
  })
})
