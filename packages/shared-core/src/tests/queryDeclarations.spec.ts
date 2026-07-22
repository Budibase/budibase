import { FieldType, Query } from "@budibase/types"
import {
  DEFAULT_LIMITS,
  hashDeclarations,
  JSON_VALUE,
  queryFunctionDeclaration,
  queryResponseType,
} from "../functions/queryDeclarations"

type QuerySchemaInput = Pick<Query, "schema" | "nestedSchemaFields">

const query = (
  schema: Query["schema"],
  nestedSchemaFields?: Query["nestedSchemaFields"]
): QuerySchemaInput => ({ schema, nestedSchemaFields })

describe("queryResponseType", () => {
  it("translates a representative Data/API schema of primitives", () => {
    const { type, fallback } = queryResponseType(
      query({
        id: { type: FieldType.NUMBER },
        name: { type: FieldType.STRING },
        active: { type: FieldType.BOOLEAN },
        createdAt: { type: FieldType.DATETIME },
      })
    )
    expect(fallback).toBe(false)
    expect(type).toBe(
      'Array<{ "id": number; "name": string; "active": boolean; "createdAt": string }>'
    )
  })

  it("supports the string-shorthand schema form", () => {
    const { type, fallback } = queryResponseType(
      query({ title: "string", count: "number" })
    )
    expect(fallback).toBe(false)
    expect(type).toBe('Array<{ "title": string; "count": number }>')
  })

  it("maps multi-select and bb_reference to string arrays", () => {
    const { type, fallback } = queryResponseType(
      query({
        tags: { type: FieldType.ARRAY },
        owners: { type: FieldType.BB_REFERENCE },
      })
    )
    expect(fallback).toBe(false)
    expect(type).toBe('Array<{ "tags": string[]; "owners": string[] }>')
  })

  it("expands nested JSON objects using nestedSchemaFields", () => {
    const { type, fallback } = queryResponseType(
      query(
        { meta: { type: FieldType.JSON } },
        {
          meta: {
            score: { type: FieldType.NUMBER },
            label: { type: FieldType.STRING },
          },
        }
      )
    )
    expect(fallback).toBe(false)
    expect(type).toBe(
      'Array<{ "meta": { "score": number; "label": string } }>'
    )
  })

  it("falls back to JsonValue for a JSON field with no nested metadata", () => {
    const { type, fallback } = queryResponseType(
      query({ blob: { type: FieldType.JSON } })
    )
    expect(fallback).toBe(true)
    expect(type).toBe(`Array<{ "blob": ${JSON_VALUE} }>`)
  })

  it("falls back to JsonValue for unsupported/ambiguous field types", () => {
    const { type, fallback } = queryResponseType(
      query({
        rel: { type: FieldType.LINK },
        files: { type: FieldType.ATTACHMENTS },
      })
    )
    expect(fallback).toBe(true)
    expect(type).toBe(
      `Array<{ "rel": ${JSON_VALUE}; "files": ${JSON_VALUE} }>`
    )
  })

  it("falls back for a missing/empty schema", () => {
    expect(queryResponseType(query({})).fallback).toBe(true)
    expect(queryResponseType(query({})).type).toBe(JSON_VALUE)
    expect(
      queryResponseType({ schema: undefined as unknown as Query["schema"] })
        .fallback
    ).toBe(true)
  })

  it("falls back when the schema exceeds the field-count limit", () => {
    const schema: Query["schema"] = {}
    for (let i = 0; i < DEFAULT_LIMITS.maxFields + 1; i++) {
      schema[`f${i}`] = { type: FieldType.STRING }
    }
    const { type, fallback } = queryResponseType(query(schema))
    expect(fallback).toBe(true)
    expect(type).toBe(`Array<${JSON_VALUE}>`)
  })

  it("falls back when nested JSON exceeds the depth limit", () => {
    const { fallback } = queryResponseType(
      query({ a: { type: FieldType.JSON } }, {
        a: { b: { type: FieldType.JSON } },
      }),
      { ...DEFAULT_LIMITS, maxDepth: 1 }
    )
    expect(fallback).toBe(true)
  })

  it("falls back wholesale when the type exceeds the char limit", () => {
    const { type, fallback } = queryResponseType(
      query({
        id: { type: FieldType.NUMBER },
        name: { type: FieldType.STRING },
      }),
      { ...DEFAULT_LIMITS, maxChars: 10 }
    )
    expect(fallback).toBe(true)
    expect(type).toBe(JSON_VALUE)
  })
})

describe("queryFunctionDeclaration", () => {
  it("wraps the response type in a Promise-returning signature", () => {
    const { type } = queryFunctionDeclaration(
      query({ id: { type: FieldType.NUMBER } })
    )
    expect(type).toBe(
      `(params?: Record<string, ${JSON_VALUE}>) => Promise<Array<{ "id": number }>>`
    )
  })

  it("produces a valid Promise<JsonValue> on fallback", () => {
    const { type, fallback } = queryFunctionDeclaration(query({}))
    expect(fallback).toBe(true)
    expect(type).toBe(
      `(params?: Record<string, ${JSON_VALUE}>) => Promise<${JSON_VALUE}>`
    )
  })
})

describe("hashDeclarations", () => {
  it("is deterministic for the same input", () => {
    expect(hashDeclarations(["a", "b"])).toBe(hashDeclarations(["a", "b"]))
  })

  it("changes when a query schema changes (flips Functions to Build required)", () => {
    const before = queryResponseType(
      query({ id: { type: FieldType.NUMBER } })
    ).type
    const after = queryResponseType(
      query({ id: { type: FieldType.STRING } })
    ).type
    expect(hashDeclarations([before])).not.toBe(hashDeclarations([after]))
  })

  it("is order-sensitive across multiple declarations", () => {
    expect(hashDeclarations(["a", "b"])).not.toBe(hashDeclarations(["b", "a"]))
  })
})
