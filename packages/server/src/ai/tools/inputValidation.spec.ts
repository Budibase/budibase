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
})
