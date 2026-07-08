import { FieldType, JsonFieldSubType } from "@budibase/types"
import { mergePreviewSchema } from "../schema"

describe("mergePreviewSchema", () => {
  it("returns the detected schema when there is no existing schema", () => {
    const detected = { id: { type: FieldType.NUMBER, name: "id" } }
    expect(
      mergePreviewSchema({
        previewSchema: detected,
        existingSchema: undefined,
        firstRow: { id: 1 },
      })
    ).toEqual(detected)
  })

  it("keeps a previously set DATETIME when the value is still a parseable date string", () => {
    const merged = mergePreviewSchema({
      previewSchema: { created: { type: FieldType.STRING, name: "created" } },
      existingSchema: {
        created: { type: FieldType.DATETIME, name: "created" },
      },
      firstRow: { created: "2024-01-01 10:00:00" },
    })
    expect(merged).toEqual({
      created: { type: FieldType.DATETIME, name: "created" },
    })
  })

  it("keeps a previously set NUMBER when the value is still a numeric string", () => {
    const merged = mergePreviewSchema({
      previewSchema: { code: { type: FieldType.STRING, name: "code" } },
      existingSchema: { code: { type: FieldType.NUMBER, name: "code" } },
      firstRow: { code: "00123" },
    })
    expect(merged).toEqual({
      code: { type: FieldType.NUMBER, name: "code" },
    })
  })

  it("keeps an explicit Text downgrade for scalar values", () => {
    const merged = mergePreviewSchema({
      previewSchema: { amount: { type: FieldType.NUMBER, name: "amount" } },
      existingSchema: { amount: { type: FieldType.STRING, name: "amount" } },
      firstRow: { amount: 42 },
    })
    expect(merged).toEqual({
      amount: { type: FieldType.STRING, name: "amount" },
    })
  })

  it("keeps an explicit Text override when the value is a Date object", () => {
    const merged = mergePreviewSchema({
      previewSchema: { created: { type: FieldType.DATETIME, name: "created" } },
      existingSchema: { created: { type: FieldType.STRING, name: "created" } },
      firstRow: { created: new Date("2024-01-01T10:00:00Z") },
    })
    expect(merged).toEqual({
      created: { type: FieldType.STRING, name: "created" },
    })
  })

  it("re-detects when a NUMBER column starts returning non-numeric strings", () => {
    const merged = mergePreviewSchema({
      previewSchema: { data: { type: FieldType.STRING, name: "data" } },
      existingSchema: { data: { type: FieldType.NUMBER, name: "data" } },
      firstRow: { data: "string value" },
    })
    expect(merged).toEqual({
      data: { type: FieldType.STRING, name: "data" },
    })
  })

  it("re-detects when a JSON column starts returning arrays", () => {
    const merged = mergePreviewSchema({
      previewSchema: { obj: { type: FieldType.ARRAY, name: "obj" } },
      existingSchema: { obj: { type: FieldType.JSON, name: "obj" } },
      firstRow: { obj: ["value1", "value2"] },
    })
    expect(merged).toEqual({
      obj: { type: FieldType.ARRAY, name: "obj" },
    })
  })

  it("re-detects a stale json-array entry when the value is a plain object", () => {
    const merged = mergePreviewSchema({
      previewSchema: { field: { type: FieldType.JSON, name: "field" } },
      existingSchema: {
        field: {
          type: FieldType.JSON,
          name: "field",
          subtype: JsonFieldSubType.ARRAY,
        },
      },
      firstRow: { field: { nested: "value" } },
    })
    expect(merged).toEqual({
      field: { type: FieldType.JSON, name: "field" },
    })
  })

  it("keeps a previously set BOOLEAN when the value is a boolean string", () => {
    const merged = mergePreviewSchema({
      previewSchema: { active: { type: FieldType.STRING, name: "active" } },
      existingSchema: { active: { type: FieldType.BOOLEAN, name: "active" } },
      firstRow: { active: "true" },
    })
    expect(merged).toEqual({
      active: { type: FieldType.BOOLEAN, name: "active" },
    })
  })

  it("re-detects when a BOOLEAN column starts returning non-boolean strings", () => {
    const merged = mergePreviewSchema({
      previewSchema: { active: { type: FieldType.STRING, name: "active" } },
      existingSchema: { active: { type: FieldType.BOOLEAN, name: "active" } },
      firstRow: { active: "banana" },
    })
    expect(merged).toEqual({
      active: { type: FieldType.STRING, name: "active" },
    })
  })

  it("keeps a previously set JSON type when the value is a JSON string", () => {
    const merged = mergePreviewSchema({
      previewSchema: { config: { type: FieldType.STRING, name: "config" } },
      existingSchema: { config: { type: FieldType.JSON, name: "config" } },
      firstRow: { config: '{"nested": "value"}' },
    })
    expect(merged).toEqual({
      config: { type: FieldType.JSON, name: "config" },
    })
  })

  it("re-detects when a JSON column starts returning plain strings", () => {
    const merged = mergePreviewSchema({
      previewSchema: { config: { type: FieldType.STRING, name: "config" } },
      existingSchema: { config: { type: FieldType.JSON, name: "config" } },
      firstRow: { config: "plain text" },
    })
    expect(merged).toEqual({
      config: { type: FieldType.STRING, name: "config" },
    })
  })

  it("keeps the existing type when the value is null", () => {
    const merged = mergePreviewSchema({
      previewSchema: { updated: { type: FieldType.STRING, name: "updated" } },
      existingSchema: {
        updated: { type: FieldType.DATETIME, name: "updated" },
      },
      firstRow: { updated: null },
    })
    expect(merged).toEqual({
      updated: { type: FieldType.DATETIME, name: "updated" },
    })
  })

  it("keeps columns that disappeared from the results and detects new ones", () => {
    const merged = mergePreviewSchema({
      previewSchema: { added: { type: FieldType.NUMBER, name: "added" } },
      existingSchema: {
        removed: { type: FieldType.DATETIME, name: "removed" },
      },
      firstRow: { added: 1 },
    })
    expect(merged).toEqual({
      added: { type: FieldType.NUMBER, name: "added" },
      removed: { type: FieldType.DATETIME, name: "removed" },
    })
  })

  it("supports legacy plain string schema entries", () => {
    const merged = mergePreviewSchema({
      previewSchema: { created: { type: FieldType.STRING, name: "created" } },
      existingSchema: { created: FieldType.DATETIME },
      firstRow: { created: "2024-01-01" },
    })
    expect(merged).toEqual({ created: FieldType.DATETIME })
  })
})
