import { z } from "zod"
import { normalizeToolInputForSchema } from "./inputValidation"

describe("tool input normalization", () => {
  const schema = z.object({
    data: z.object({
      "Expense Tags": z.array(z.enum(["Food", "Other"])),
      Cost: z.number(),
    }),
  })

  it("unwraps markdown backticks from known field names", async () => {
    await expect(
      normalizeToolInputForSchema(
        {
          data: {
            "`Expense Tags`": ["Other"],
            Cost: 10,
          },
        },
        schema
      )
    ).resolves.toEqual({
      changed: true,
      value: {
        data: {
          "Expense Tags": ["Other"],
          Cost: 10,
        },
      },
    })
  })

  it("does not rename unknown or ambiguous fields", async () => {
    await expect(
      normalizeToolInputForSchema(
        {
          data: {
            "`Unknown`": "value",
            "Expense Tags": ["Food"],
            "`Expense Tags`": ["Other"],
            Cost: 10,
          },
        },
        schema
      )
    ).resolves.toEqual({
      changed: false,
      value: {
        data: {
          "`Unknown`": "value",
          "Expense Tags": ["Food"],
          "`Expense Tags`": ["Other"],
          Cost: 10,
        },
      },
    })
  })

  it("normalizes root keys and keys inside tuple items", async () => {
    const tupleSchema = z.tuple([
      z.object({ Name: z.string() }),
      z.object({ Category: z.string() }),
    ])
    const nestedSchema = z.object({ Items: tupleSchema })

    await expect(
      normalizeToolInputForSchema(
        {
          "`Items`": [{ "`Name`": "Breakfast" }, { "`Category`": "Food" }],
        },
        nestedSchema
      )
    ).resolves.toEqual({
      changed: true,
      value: {
        Items: [{ Name: "Breakfast" }, { Category: "Food" }],
      },
    })
  })

  it("normalizes fields whose names exist on the object prototype", async () => {
    const inheritedNameSchema = z.object({ constructor: z.string() })

    await expect(
      normalizeToolInputForSchema(
        { "`constructor`": "value" },
        inheritedNameSchema
      )
    ).resolves.toEqual({
      changed: true,
      value: { constructor: "value" },
    })
  })
})
