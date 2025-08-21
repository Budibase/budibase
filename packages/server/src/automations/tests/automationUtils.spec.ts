import { AutomationIOType } from "@budibase/types"
import { cleanInputValues, substituteLoopStep } from "../automationUtils"

describe("automationUtils", () => {
  describe("substituteLoopStep", () => {
    it("should allow multiple loop binding substitutes", () => {
      expect(
        substituteLoopStep(
          `{{ loop.currentItem._id }} {{ loop.currentItem._id }} {{ loop.currentItem._id }}`,
          "step.2"
        )
      ).toBe(
        `{{ step.2.currentItem._id }} {{ step.2.currentItem._id }} {{ step.2.currentItem._id }}`
      )
    })

    it("should handle not subsituting outside of curly braces", () => {
      expect(
        substituteLoopStep(
          `loop {{ loop.currentItem._id }}loop loop{{ loop.currentItem._id }}loop`,
          "step.2"
        )
      ).toBe(
        `loop {{ step.2.currentItem._id }}loop loop{{ step.2.currentItem._id }}loop`
      )
    })
  })

  describe("cleanInputValues", () => {
    it("should handle array relationship fields from read binding", () => {
      const schema = {
        relationship: {
          type: "link",
          constraints: {
            type: "array",
            presence: false,
          },
          fieldName: "Users",
          name: "relationship",
          relationshipType: "many-to-many",
          tableId: "ta_users",
          sortable: false,
        },
      }
      expect(
        cleanInputValues({
          row: {
            relationship: `[{"_id": "ro_ta_users_us_3"}]`,
          },
          schema,
        })
      ).toEqual({
        row: {
          relationship: [{ _id: "ro_ta_users_us_3" }],
        },
        schema,
      })
    })

    it("should handle single string relationship field", () => {
      const schema = {
        relationship: {
          type: "link",
          constraints: {
            type: "array",
            presence: false,
          },
          fieldName: "Users",
          name: "relationship",
          relationshipType: "many-to-many",
          tableId: "ta_users",
          sortable: false,
        },
      }
      expect(
        cleanInputValues({
          row: {
            relationship: `ro_ta_users_us_3`,
          },
          schema,
        })
      ).toEqual({
        row: {
          relationship: "ro_ta_users_us_3",
        },
        schema,
      })
    })

    it("should be able to clean inputs with the utilities", () => {
      // can't clean without a schema
      const one = cleanInputValues({ a: "1" })
      expect(one.a).toBe("1")

      const two = cleanInputValues(
        { a: "1", b: "true", c: "false", d: 1, e: "help" },
        {
          a: {
            type: AutomationIOType.NUMBER,
          },
          b: {
            type: AutomationIOType.BOOLEAN,
          },
          c: {
            type: AutomationIOType.BOOLEAN,
          },
        }
      )
      expect(two.a).toBe(1)
      expect(two.b).toBe(true)
      expect(two.c).toBe(false)
      expect(two.d).toBe(1)
    })
  })
})
