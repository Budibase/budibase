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
        cleanInputValues(
          {
            row: {
              relationship: `[{"_id": "ro_ta_users_us_3"}]`,
            },
            schema,
          },
          schema
        )
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
        cleanInputValues(
          {
            row: {
              relationship: `ro_ta_users_us_3`,
            },
            schema,
          },
          schema
        )
      ).toEqual({
        row: {
          relationship: "ro_ta_users_us_3",
        },
        schema,
      })
    })

    it("should be able to clean inputs with the utilities", () => {
      // can't clean without a schema
      let output = cleanInputValues({ a: "1" })
      expect(output.a).toBe("1")
      output = cleanInputValues(
        { a: "1", b: "true", c: "false", d: 1, e: "help" },
        {
          properties: {
            a: {
              type: "number",
            },
            b: {
              type: "boolean",
            },
            c: {
              type: "boolean",
            },
          },
        }
      )
      expect(output.a).toBe(1)
      expect(output.b).toBe(true)
      expect(output.c).toBe(false)
      expect(output.d).toBe(1)
    })
  })
})
