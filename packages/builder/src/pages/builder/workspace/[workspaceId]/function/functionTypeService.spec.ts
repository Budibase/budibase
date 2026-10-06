import { generateFunctionDeclarations } from "@budibase/shared-core"
import type { FunctionQueryCapability } from "@budibase/types"
import { afterAll, describe, expect, it } from "vitest"
import { createFunctionTypeService } from "./functionTypeService"

const typedQuery: FunctionQueryCapability = {
  capabilityId: "cap_customers",
  queryId: "query_customers",
  datasourceAlias: "mongoDB",
  queryAlias: "readQuery",
  parameterNames: [],
  responseSchema: {
    fields: [
      { name: "name", type: "string" },
      { name: "age", type: "number" },
      { name: "active", type: "boolean" },
    ],
  },
}

const sourcePrefix = `import { queries } from "@budibase/functions"
async function run() {
  const res = await queries.mongoDB.readQuery()
  `

describe("Function TypeScript completions", () => {
  const service = createFunctionTypeService()
  afterAll(() => service.destroy())

  const complete = ({
    expression,
    capability = typedQuery,
  }: {
    expression: string
    capability?: FunctionQueryCapability
  }) => {
    const source = sourcePrefix + expression
    return service.complete({
      source,
      declarations: generateFunctionDeclarations({
        capabilities: [capability],
      }),
      position: source.length,
    })
  }

  it("infers the query response through an awaited local variable", () => {
    expect(complete({ expression: "res." })).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "data" })])
    )
  })

  it.each([
    "res.data[0].",
    "res.data.map(row => row.",
    "const { data } = res; for (const row of data) { row.",
    "const rows = res.data; const customer = rows[0]; customer?.",
  ])("infers row fields through %s", expression => {
    expect(complete({ expression })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "name",
          detail: expect.stringContaining("string"),
        }),
        expect.objectContaining({
          label: "age",
          detail: expect.stringContaining("number"),
        }),
        expect.objectContaining({
          label: "active",
          detail: expect.stringContaining("boolean"),
        }),
      ])
    )
  })

  it("provides standard array and narrowed scalar members", () => {
    expect(complete({ expression: "res.data." })).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "map" })])
    )
    expect(complete({ expression: "res.data[0].name?." })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "toUpperCase" }),
      ])
    )
  })

  it("keeps array suggestions compact and shows documentation instead of expanded row types", () => {
    const completions = complete({ expression: "res.data." })
    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "length", detail: "number" }),
        expect.objectContaining({
          label: "at",
          detail: "(index) → undefined | object",
        }),
        expect.objectContaining({
          label: "map",
          detail: "(callbackfn, thisArg?) → array",
          info: expect.stringContaining("Calls a defined callback function"),
        }),
      ])
    )
    expect(complete({ expression: "res." })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "data", detail: "array" }),
      ])
    )
  })

  it("updates field suggestions and clears them when inference falls back", () => {
    const updated: FunctionQueryCapability = {
      ...typedQuery,
      responseSchema: { fields: [{ name: "total", type: "number" }] },
    }
    expect(
      complete({ expression: "res.data[0].", capability: updated })
    ).toEqual([
      expect.objectContaining({
        label: "total",
        detail: expect.stringContaining("number"),
      }),
    ])
    expect(
      complete({
        expression: "res.data[0].",
        capability: { ...typedQuery, responseSchema: undefined },
      })
    ).toEqual([])
  })

  it("respects lexical scope and does not complete comments or strings", () => {
    expect(complete({ expression: "{ const res = { own: 1 }; res." })).toEqual([
      expect.objectContaining({ label: "own" }),
    ])
    expect(complete({ expression: "// res.data[0]." })).toEqual([])
    expect(complete({ expression: '"res.data[0].' })).toEqual([])
  })
})
