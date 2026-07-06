import { FieldType, JsonFieldSubType } from "@budibase/types"
import { mergePreviewSchema } from "../schema"

describe("mergePreviewSchema", () => {
  it("returns the detected schema when there is no existing schema", () => {
    const detected = { id: { type: FieldType.NUMBER, name: "id" } }
    expect(mergePreviewSchema(detected, undefined, { id: 1 })).toEqual(detected)
  })

  it("keeps a previously set DATETIME when the value is still a parseable date string", () => {
    const merged = mergePreviewSchema(
      { created: { type: FieldType.STRING, name: "created" } },
      { created: { type: FieldType.DATETIME, name: "created" } },
      { created: "2024-01-01 10:00:00" }
    )
    expect(merged).toEqual({
      created: { type: FieldType.DATETIME, name: "created" },
    })
  })

  it("keeps a previously set NUMBER when the value is still a numeric string", () => {
    const merged = mergePreviewSchema(
      { code: { type: FieldType.STRING, name: "code" } },
      { code: { type: FieldType.NUMBER, name: "code" } },
      { code: "00123" }
    )
    expect(merged).toEqual({
      code: { type: FieldType.NUMBER, name: "code" },
    })
  })

  it("keeps an explicit Text downgrade for scalar values", () => {
    const merged = mergePreviewSchema(
      { amount: { type: FieldType.NUMBER, name: "amount" } },
      { amount: { type: FieldType.STRING, name: "amount" } },
      { amount: 42 }
    )
    expect(merged).toEqual({
      amount: { type: FieldType.STRING, name: "amount" },
    })
  })

  it("re-detects when a NUMBER column starts returning non-numeric strings", () => {
    const merged = mergePreviewSchema(
      { data: { type: FieldType.STRING, name: "data" } },
      { data: { type: FieldType.NUMBER, name: "data" } },
      { data: "string value" }
    )
    expect(merged).toEqual({
      data: { type: FieldType.STRING, name: "data" },
    })
  })

  it("re-detects when a JSON column starts returning arrays", () => {
    const merged = mergePreviewSchema(
      { obj: { type: FieldType.ARRAY, name: "obj" } },
      { obj: { type: FieldType.JSON, name: "obj" } },
      { obj: ["value1", "value2"] }
    )
    expect(merged).toEqual({
      obj: { type: FieldType.ARRAY, name: "obj" },
    })
  })

  it("re-detects a stale json-array entry when the value is a plain object", () => {
    const merged = mergePreviewSchema(
      { field: { type: FieldType.JSON, name: "field" } },
      {
        field: {
          type: FieldType.JSON,
          name: "field",
          subtype: JsonFieldSubType.ARRAY,
        },
      },
      { field: { nested: "value" } }
    )
    expect(merged).toEqual({
      field: { type: FieldType.JSON, name: "field" },
    })
  })

  it("keeps the existing type when the value is null", () => {
    const merged = mergePreviewSchema(
      { updated: { type: FieldType.STRING, name: "updated" } },
      { updated: { type: FieldType.DATETIME, name: "updated" } },
      { updated: null }
    )
    expect(merged).toEqual({
      updated: { type: FieldType.DATETIME, name: "updated" },
    })
  })

  it("keeps columns that disappeared from the results and detects new ones", () => {
    const merged = mergePreviewSchema(
      { added: { type: FieldType.NUMBER, name: "added" } },
      { removed: { type: FieldType.DATETIME, name: "removed" } },
      { added: 1 }
    )
    expect(merged).toEqual({
      added: { type: FieldType.NUMBER, name: "added" },
      removed: { type: FieldType.DATETIME, name: "removed" },
    })
  })

  it("supports legacy plain string schema entries", () => {
    const merged = mergePreviewSchema(
      { created: { type: FieldType.STRING, name: "created" } },
      { created: FieldType.DATETIME },
      { created: "2024-01-01" }
    )
    expect(merged).toEqual({ created: FieldType.DATETIME })
  })
})
