import { asSchema } from "@ai-sdk/provider-utils"
import { FieldType, JsonFieldSubType, type TableSchema } from "@budibase/types"
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
  it.each([true, false])(
    "validates JSON arrays and objects by subtype (create: %s)",
    requirePresentFields => {
      const jsonFields: TableSchema = {
        Items: {
          name: "Items",
          type: FieldType.JSON,
          subtype: JsonFieldSubType.ARRAY,
        },
        Details: { name: "Details", type: FieldType.JSON },
      }
      const schema = buildRowDataSchema(
        Object.entries(jsonFields).map(([name, schema]) => ({ name, schema })),
        "",
        requirePresentFields
      )
      const input = {
        Items: [{ name: "Breakfast", tags: ["Food"] }, 15, "note"],
        Details: { tags: ["Food"] },
      }

      expect(schema.parse(input)).toEqual(input)
      expect(schema.safeParse({ Items: [] }).success).toBe(true)
      expect(schema.safeParse({ Items: {} }).success).toBe(false)
      expect(schema.safeParse({ Details: [] }).success).toBe(false)
      expect(schema.safeParse({ Items: "invalid" }).success).toBe(false)
    }
  )

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

    expect(schema.parse({ Cost: 20, "`Expense Tags`": "Food" })).toEqual({
      Cost: 20,
      "Expense Tags": "Food",
    })
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
    expect(schema.safeParse({}).success).toBe(true)
    expect(schema.safeParse({ Cost: null }).success).toBe(false)
    expect(schema.safeParse({ Currency: null }).success).toBe(false)
  })

  it("enforces configured email and length constraints on supplied values", () => {
    const schema = buildRowDataSchema(
      [
        {
          name: "Email",
          schema: {
            name: "Email",
            type: FieldType.STRING,
            constraints: { email: true },
          },
        },
        {
          name: "Notes",
          schema: {
            name: "Notes",
            type: FieldType.STRING,
            constraints: { length: { maximum: 5 } },
          },
        },
      ],
      ""
    )

    expect(
      schema.safeParse({ Email: "user@example.com", Notes: "Lunch" }).success
    ).toBe(true)
    expect(schema.safeParse({ Email: "invalid" }).success).toBe(false)
    expect(schema.safeParse({ Notes: "Too long" }).success).toBe(false)
    expect(schema.safeParse({ Notes: null }).success).toBe(true)
  })

  it("enforces configured numericality constraints on supplied values", () => {
    const schema = buildRowDataSchema(
      [
        {
          name: "Cost",
          schema: {
            name: "Cost",
            type: FieldType.NUMBER,
            constraints: {
              numericality: {
                greaterThanOrEqualTo: "10",
                lessThanOrEqualTo: "20",
              },
            },
          },
        },
      ],
      ""
    )

    expect(schema.safeParse({ Cost: 10 }).success).toBe(true)
    expect(schema.safeParse({ Cost: 20 }).success).toBe(true)
    expect(schema.safeParse({ Cost: 9 }).success).toBe(false)
    expect(schema.safeParse({ Cost: 21 }).success).toBe(false)
    expect(schema.safeParse({ Cost: null }).success).toBe(true)
  })

  it("enforces configured datetime constraints on supplied values", () => {
    const schema = buildRowDataSchema(
      [
        {
          name: "Due",
          schema: {
            name: "Due",
            type: FieldType.DATETIME,
            constraints: {
              datetime: {
                earliest: "2024-01-10T00:00:00.000Z",
                latest: "2024-01-20T00:00:00.000Z",
              },
            },
          },
        },
      ],
      ""
    )

    expect(schema.safeParse({ Due: "2024-01-10T00:00:00.000Z" }).success).toBe(
      true
    )
    expect(schema.safeParse({ Due: "2024-01-20T00:00:00.000Z" }).success).toBe(
      true
    )
    expect(schema.safeParse({ Due: "2024-01-09T23:59:59.000Z" }).success).toBe(
      false
    )
    expect(schema.safeParse({ Due: "2024-01-20T00:00:01.000Z" }).success).toBe(
      false
    )
    expect(schema.safeParse({ Due: null }).success).toBe(true)
  })

  it("enforces time-only datetime constraints on supplied values", () => {
    const schema = buildRowDataSchema(
      [
        {
          name: "Start",
          schema: {
            name: "Start",
            type: FieldType.DATETIME,
            timeOnly: true,
            constraints: {
              datetime: {
                earliest: "10:00",
                latest: "15:00",
              },
            },
          },
        },
      ],
      ""
    )

    expect(schema.safeParse({ Start: "10:00" }).success).toBe(true)
    expect(schema.safeParse({ Start: "15:00" }).success).toBe(true)
    expect(schema.safeParse({ Start: "09:59" }).success).toBe(false)
    expect(schema.safeParse({ Start: "15:01" }).success).toBe(false)
    expect(
      schema.safeParse({ Start: "2024-01-10T10:00:00.000Z" }).success
    ).toBe(false)
    expect(schema.safeParse({ Start: null }).success).toBe(true)
  })

  it("requires a writable primary display value on create but allows omission on update", () => {
    const displayFields = [
      {
        name: "Name",
        schema: { name: "Name", type: FieldType.STRING as const },
        isPrimaryDisplay: true,
      },
    ]
    const create = buildRowDataSchema(displayFields, "", true)
    const update = buildRowDataSchema(displayFields, "")
    expect(create.safeParse({}).success).toBe(false)
    expect(create.safeParse({ Name: "Lunch" }).success).toBe(true)
    expect(update.safeParse({}).success).toBe(true)
    expect(update.safeParse({ Name: null }).success).toBe(false)
    expect(update.safeParse({ Name: "" }).success).toBe(false)
  })

  it.each([true, false])(
    "rejects empty required enum values (primary display: %s)",
    isPrimaryDisplay => {
      const optionFields = [
        {
          name: "Category",
          schema: {
            name: "Category",
            type: FieldType.OPTIONS as const,
            constraints: {
              inclusion: ["", "Food"],
              presence: !isPrimaryDisplay,
            },
          },
          isPrimaryDisplay,
        },
      ]
      const create = buildRowDataSchema(optionFields, "", true)
      const update = buildRowDataSchema(optionFields, "")

      expect(create.safeParse({ Category: "" }).success).toBe(false)
      expect(update.safeParse({ Category: "" }).success).toBe(false)
      expect(create.safeParse({ Category: "Food" }).success).toBe(true)
      expect(update.safeParse({ Category: "Food" }).success).toBe(true)
      expect(create.safeParse({}).success).toBe(false)
      expect(update.safeParse({}).success).toBe(true)
    }
  )

  it.each([true, false])(
    "allows clearing optional dropdowns (create: %s)",
    requirePresentFields => {
      const schema = buildRowDataSchema(
        [
          {
            name: "Category",
            schema: {
              name: "Category",
              type: FieldType.OPTIONS,
              constraints: { inclusion: ["Food", "Other"] },
            },
          },
        ],
        "",
        requirePresentFields
      )

      expect(schema.parse({ Category: "" })).toEqual({ Category: "" })
      expect(schema.safeParse({ Category: null }).success).toBe(true)
      expect(schema.safeParse({}).success).toBe(true)
      expect(schema.safeParse({ Category: "Food" }).success).toBe(true)
      expect(schema.safeParse({ Category: "Invalid" }).success).toBe(false)
    }
  )

  it("allows an explicitly configured empty option for non-required fields", () => {
    const schema = buildRowDataSchema(
      [
        {
          name: "Category",
          schema: {
            name: "Category",
            type: FieldType.OPTIONS,
            constraints: { inclusion: ["", "Food"] },
          },
        },
      ],
      "",
      true
    )

    expect(schema.safeParse({ Category: "" }).success).toBe(true)
  })

  it("allows required fields with defaults to be omitted", () => {
    const schema = buildRowDataSchema(fields, "", true)

    expect(schema.safeParse({ Cost: 20, "Expense Tags": "Food" }).success).toBe(
      true
    )
  })
})
