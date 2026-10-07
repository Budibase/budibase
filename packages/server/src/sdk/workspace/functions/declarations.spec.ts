import ts from "typescript"
import type {
  FunctionInputDefinition,
  FunctionQueryCapability,
} from "@budibase/types"
import {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"
import { FUNCTION_QUERY_RESPONSE_LIMITS } from "./responseTypes"

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
  it("accepts omitted query parameters while checking provided overrides", () => {
    const capabilities: FunctionQueryCapability[] = [
      {
        capabilityId: "capability_1",
        queryId: "query_1",
        datasourceAlias: "Inventory",
        queryAlias: "findRooms",
        parameterNames: ["building", "floor"],
      },
    ]
    const declarations = generateFunctionDeclarations({ capabilities })
    const usage = `import { queries } from "@budibase/functions"
queries.Inventory.findRooms()
queries.Inventory.findRooms({})
queries.Inventory.findRooms({ building: "HQ" })
queries.Inventory.findRooms({ floor: null })
queries.Inventory.findRooms({ building: "HQ", floor: "2" })
`
    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", usage],
        ])
      )
    ).toEqual([])
    const diagnostics = getDiagnostics(
      new Map([
        ["functions.d.ts", declarations],
        [
          "usage.ts",
          `import { queries } from "@budibase/functions"
queries.Inventory.findRooms({ building: 2 })
queries.Inventory.findRooms({ missing: "value" })
`,
        ],
      ])
    )
    expect(diagnostics.map(diagnostic => diagnostic.code)).toEqual([2322, 2353])
  })

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

  it("checks typed response fields while accepting nullable, missing and extra data", () => {
    const capabilities: FunctionQueryCapability[] = [
      {
        capabilityId: "capability_1",
        queryId: "query_1",
        datasourceAlias: "Inventory",
        queryAlias: "findRooms",
        parameterNames: [],
        responseSchema: {
          fields: [
            { name: 'room "name"', type: "string" },
            { name: "count", type: "number" },
            { name: "enabled", type: "boolean" },
            { name: "details", type: "json" },
            { name: "items", type: "array" },
          ],
        },
      },
    ]
    const declarations = generateFunctionDeclarations({ capabilities })
    const source = `import { queries, type JsonValue, type FunctionResult } from "@budibase/functions"
async function check(): Promise<FunctionResult> {
  const response = await queries.Inventory.findRooms()
  const row = response.data[0]
  const name: string | null | undefined = row['room "name"']
  const count: number | null | undefined = row.count
  const enabled: boolean | null | undefined = row.enabled
  const details: JsonValue | undefined = row.details
  const items: JsonValue[] | null | undefined = row.items
  const extraRow = { count: 2, extra: true, items: ["text", 1, true, null, {}, []], details: { nested: [] } }
  const value: typeof response = { data: [{}, { count: null }, extraRow], pagination: null }
  return { output: { response, value } }
}`
    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", source],
        ])
      )
    ).toEqual([])
    const diagnostics = getDiagnostics(
      new Map([
        ["functions.d.ts", declarations],
        [
          "usage.ts",
          `import { queries } from "@budibase/functions"
async function check() {
  const row = (await queries.Inventory.findRooms()).data[0]
  const count: string = row.count
  row.count.toUpperCase()
  row.missing
  row["missing"]
}`,
        ],
      ])
    )
    expect(diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining([2322, 2339, 18049, 7053])
    )
  })

  it("hashes the effective response contract independently of query and field order", () => {
    const capability: FunctionQueryCapability = {
      capabilityId: "capability_1",
      queryId: "query_1",
      datasourceAlias: "Inventory",
      queryAlias: "findRooms",
      parameterNames: [],
      responseSchema: {
        fields: [
          { name: "name", type: "string" },
          { name: "count", type: "number" },
        ],
      },
    }
    const hash = (capabilities: FunctionQueryCapability[]) =>
      hashFunctionDeclarations({
        declarations: generateFunctionDeclarations({ capabilities }),
      })
    const typedHash = hash([capability])
    expect(
      hash([
        {
          ...capability,
          responseSchema: {
            fields: [...capability.responseSchema!.fields].reverse(),
          },
        },
      ])
    ).toBe(typedHash)
    expect(
      hash([
        {
          ...capability,
          responseSchema: {
            fields: [
              { name: "name", type: "number" },
              { name: "count", type: "number" },
            ],
          },
        },
      ])
    ).not.toBe(typedHash)
    expect(hash([{ ...capability, responseSchema: undefined }])).not.toBe(
      typedHash
    )
  })

  it("bounds the total response declarations deterministically", () => {
    const capabilities: FunctionQueryCapability[] = Array.from(
      { length: 10 },
      (_, i) => ({
        capabilityId: `capability_${i}`,
        queryId: `query_${i}`,
        datasourceAlias: "Data",
        queryAlias: `query${i}`,
        parameterNames: [],
        responseSchema: {
          fields: Array.from({ length: 90 }, (_, j) => ({
            name: `field${j}${"x".repeat(100)}`,
            type: "string",
          })),
        },
      })
    )
    const declarations = generateFunctionDeclarations({ capabilities })
    expect(declarations).toContain("Promise<JsonValue>")
    expect(Buffer.byteLength(declarations, "utf8")).toBeLessThan(
      FUNCTION_QUERY_RESPONSE_LIMITS.maxTotalTypeBytes + 4096
    )
    expect(
      generateFunctionDeclarations({
        capabilities: [...capabilities].reverse(),
      })
    ).toBe(declarations)
    expect(getDiagnostics(new Map([["functions.d.ts", declarations]]))).toEqual(
      []
    )
  })
})

describe("typed Function input declarations", () => {
  const inputSchema: FunctionInputDefinition[] = [
    {
      name: "text",
      type: "string",
    },
    { name: "count", type: "number" },
    { name: "flag", type: "boolean" },
    { name: "data", type: "object" },
    { name: "items", type: "array" },
  ]

  it("type-checks every supported optional input type, including null values", () => {
    const declarations = generateFunctionDeclarations({
      capabilities: [],
      inputSchema,
    })
    const source = `import { inputs, type GeneratedInputs, type JsonValue } from "@budibase/functions"
const text: string | null | undefined = inputs.text
const count: number | null | undefined = inputs.count
const flag: boolean | null | undefined = inputs.flag
const data: Record<string, JsonValue> | null | undefined = inputs.data
const items: JsonValue[] | null | undefined = inputs.items
const nullable: GeneratedInputs = { text: null, count: null, flag: null, data: null, items: null }
const omitted: GeneratedInputs = {}
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
          name: `${input.name}Changed`,
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
