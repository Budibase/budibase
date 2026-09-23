import { asSchema } from "@ai-sdk/provider-utils"
import { FieldType, type TableSchema } from "@budibase/types"
import { buildRowDataSchema } from "../rows"

const tableSchema: TableSchema = {
  Cost: {
    name: "Cost",
    type: FieldType.NUMBER,
    constraints: { presence: true },
  },
  "Expense Tags": {
    name: "Expense Tags",
    type: FieldType.OPTIONS,
    constraints: {
      presence: true,
      inclusion: ["Equipment", "Food", "Office"],
    },
  },
  Currency: {
    name: "Currency",
    type: FieldType.STRING,
    constraints: { presence: true },
    default: "EUR",
  },
}
const fields = Object.entries(tableSchema).map(([name, schema]) => ({
  name,
  schema,
}))

describe("row tool data schema", () => {
  it("requires mandatory create fields", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(schema.safeParse({ Cost: 20 }).success).toBe(false)
    expect(schema.safeParse({ Cost: 20, "Expense Tags": "Food" }).success).toBe(
      true
    )
  })

  it("validates field types and option values", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(
      schema.safeParse({ Cost: "20", "Expense Tags": "Food" }).success
    ).toBe(false)
    expect(
      schema.safeParse({ Cost: 20, "Expense Tags": "Unknown" }).success
    ).toBe(false)
  })

  it("rejects fields that are not in the table schema", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(
      schema.safeParse({
        Cost: 20,
        "Expense Tags": "Food",
        Unknown: "value",
      }).success
    ).toBe(false)
  })

  it("canonicalizes backtick-wrapped field names", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(
      schema.parse({ Cost: 20, "`Expense Tags`": "Food" })
    ).toEqual({ Cost: 20, "Expense Tags": "Food" })
  })

  it("only advertises canonical field names to the model", () => {
    const schema = buildRowDataSchema(fields, "", true)
    const jsonSchema = asSchema(schema).jsonSchema

    expect(jsonSchema).toEqual(
      expect.objectContaining({
        properties: expect.objectContaining({
          "Expense Tags": expect.any(Object),
        }),
      })
    )
    expect(jsonSchema).not.toEqual(
      expect.objectContaining({
        properties: expect.objectContaining({
          "`Expense Tags`": expect.any(Object),
        }),
      })
    )
  })

  it("rejects a wrapped field when the canonical field is also present", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(
      schema.safeParse({
        Cost: 20,
        "Expense Tags": "Food",
        "`Expense Tags`": "Office",
      }).success
    ).toBe(false)
  })

  it("keeps fields optional for partial updates", () => {
    const schema = buildRowDataSchema(fields, "")

    expect(schema.safeParse({ Cost: 20 }).success).toBe(true)
    expect(schema.safeParse({ Cost: null }).success).toBe(true)
  })

  it("allows required fields with defaults to be omitted", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(schema.safeParse({ Cost: 20, "Expense Tags": "Food" }).success).toBe(
      true
    )
  })
})
