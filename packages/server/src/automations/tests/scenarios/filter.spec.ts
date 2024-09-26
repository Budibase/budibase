import * as automation from "../../index"
import * as setup from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { FilterConditions } from "../../../automations/steps/filter"
import { LoopStepType, FieldType, Table } from "@budibase/types"

describe("Automation Scenarios", () => {
  let config = setup.getConfig()

  beforeEach(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(setup.afterAll)

  describe("Automations with filter", () => {
    let table: Table

    beforeEach(async () => {
      table = await config.createTable({
        name: "TestTable",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          value: {
            name: "value",
            type: FieldType.NUMBER,
            constraints: {
              presence: true,
            },
          },
        },
      })
    })

    it("should stop an automation if the condition is not met", async () => {
      const builder = createAutomationBuilder({
        name: "Test Equal",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow({
          row: {
            name: "Equal Test",
            value: 10,
            tableId: table._id,
          },
        })
        .queryRows({
          tableId: table._id!,
        })
        .filter({
          field: "{{ steps.2.rows.0.value }}",
          condition: FilterConditions.EQUAL,
          value: 20,
        })
        .serverLog({ text: "Equal condition met" })
        .run()

      expect(results.steps[2].outputs.success).toBeTrue()
      expect(results.steps[2].outputs.result).toBeFalse()
      expect(results.steps[3]).toBeUndefined()
    })

    it("should continue the automation if the condition is met", async () => {
      const builder = createAutomationBuilder({
        name: "Test Not Equal",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow({
          row: {
            name: "Not Equal Test",
            value: 10,
            tableId: table._id,
          },
        })
        .queryRows({
          tableId: table._id!,
        })
        .filter({
          field: "{{ steps.2.rows.0.value }}",
          condition: FilterConditions.NOT_EQUAL,
          value: 20,
        })
        .serverLog({ text: "Not Equal condition met" })
        .run()

      expect(results.steps[2].outputs.success).toBeTrue()
      expect(results.steps[2].outputs.result).toBeTrue()
      expect(results.steps[3].outputs.success).toBeTrue()
    })

    const testCases = [
      {
        condition: FilterConditions.EQUAL,
        value: 10,
        rowValue: 10,
        expectPass: true,
      },
      {
        condition: FilterConditions.NOT_EQUAL,
        value: 10,
        rowValue: 20,
        expectPass: true,
      },
      {
        condition: FilterConditions.GREATER_THAN,
        value: 10,
        rowValue: 15,
        expectPass: true,
      },
      {
        condition: FilterConditions.LESS_THAN,
        value: 10,
        rowValue: 5,
        expectPass: true,
      },
      {
        condition: FilterConditions.GREATER_THAN,
        value: 10,
        rowValue: 5,
        expectPass: false,
      },
      {
        condition: FilterConditions.LESS_THAN,
        value: 10,
        rowValue: 15,
        expectPass: false,
      },
    ]

    it.each(testCases)(
      "should pass the filter when condition is $condition",
      async ({ condition, value, rowValue, expectPass }) => {
        const builder = createAutomationBuilder({
          name: `Test ${condition}`,
        })

        const results = await builder
          .appAction({ fields: {} })
          .createRow({
            row: {
              name: `${condition} Test`,
              value: rowValue,
              tableId: table._id,
            },
          })
          .queryRows({
            tableId: table._id!,
          })
          .filter({
            field: "{{ steps.2.rows.0.value }}",
            condition,
            value,
          })
          .serverLog({
            text: `${condition} condition ${expectPass ? "passed" : "failed"}`,
          })
          .run()

        expect(results.steps[2].outputs.result).toBe(expectPass)
        if (expectPass) {
          expect(results.steps[3].outputs.success).toBeTrue()
        } else {
          expect(results.steps[3]).toBeUndefined()
        }
      }
    )
  })
})
