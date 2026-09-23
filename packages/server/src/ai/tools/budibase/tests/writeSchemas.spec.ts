import { AutomationIOType } from "@budibase/types"
import { buildParametersSchema } from "../../restQuery"
import { buildAutomationFieldsSchema } from "../automations"

describe("write tool schemas", () => {
  describe("queries", () => {
    const schema = buildParametersSchema({
      parameters: [
        { name: "accountId", default: "" },
        { name: "region", default: "eu" },
      ],
    })

    it("accepts declared parameters and optional defaults", () => {
      expect(schema.safeParse({ accountId: "acct_1" }).success).toBe(true)
      expect(schema.safeParse({}).success).toBe(true)
    })

    it("rejects undeclared parameters and invalid types", () => {
      expect(schema.safeParse({ unknown: "value" }).success).toBe(false)
      expect(schema.safeParse({ accountId: 42 }).success).toBe(false)
    })
  })

  describe("automations", () => {
    const schema = buildAutomationFieldsSchema({
      definition: {
        trigger: {
          inputs: {
            fields: {
              description: AutomationIOType.STRING,
              amount: AutomationIOType.NUMBER,
              approved: AutomationIOType.BOOLEAN,
              tags: AutomationIOType.ARRAY,
            },
          },
        },
      },
    })

    it("validates declared trigger field types", () => {
      expect(
        schema.safeParse({
          description: "Expense",
          amount: 20,
          approved: false,
          tags: ["Food"],
        }).success
      ).toBe(true)
      expect(schema.safeParse({ amount: "20" }).success).toBe(false)
    })

    it("keeps trigger fields optional and rejects undeclared fields", () => {
      expect(schema.safeParse({}).success).toBe(true)
      expect(schema.safeParse({ unknown: "value" }).success).toBe(false)
    })
  })
})
