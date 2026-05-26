import { FieldType, FilterCondition, Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Filtering automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()

    table = await config.api.table.save({
      ...basicTable(),
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

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("stops an automation if the condition is not met", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
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
        condition: FilterCondition.EQUAL,
        value: 20,
      })
      .serverLog({ text: "Equal condition met" })
      .test({ fields: {} })

    expect(results.steps[2].outputs.success).toBeTrue()
    expect(results.steps[2].outputs.result).toBeFalse()
    expect(results.steps[3]).toBeUndefined()
  })

  it("continues the automation if the condition is met", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
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
        condition: FilterCondition.NOT_EQUAL,
        value: 20,
      })
      .serverLog({ text: "Not Equal condition met" })
      .test({ fields: {} })

    expect(results.steps[2].outputs.success).toBeTrue()
    expect(results.steps[2].outputs.result).toBeTrue()
    expect(results.steps[3].outputs.success).toBeTrue()
  })
})
