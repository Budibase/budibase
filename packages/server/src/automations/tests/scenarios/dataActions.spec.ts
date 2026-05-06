import { FieldType, Row, Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Data action automations", () => {
  const config = new TestConfiguration()
  let table: Table
  let gammaRow: Row

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()

    table = await config.api.table.save({
      ...basicTable(),
      name: "AutomationDataActions",
      type: "table",
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: {
            presence: true,
          },
        },
        category: {
          name: "category",
          type: FieldType.STRING,
        },
        value: {
          name: "value",
          type: FieldType.NUMBER,
        },
      },
    })

    await config.api.row.save(table._id!, {
      name: "Alpha",
      category: "standard",
      value: 10,
    })
    await config.api.row.save(table._id!, {
      name: "Beta",
      category: "standard",
      value: 30,
    })
    gammaRow = await config.api.row.save(table._id!, {
      name: "Gamma",
      category: "priority",
      value: 20,
    })
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("gets a row by id and makes it available to later steps", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .getRow({
        tableId: table._id!,
        rowId: gammaRow._id,
      })
      .serverLog({ text: "Found {{ steps.1.row.name }}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[0].outputs.row).toMatchObject({
      _id: gammaRow._id,
      name: "Gamma",
    })
    expect(results.steps[1].outputs.message).toContain("Found Gamma")
  })

  it("creates, updates, reads and deletes a row in one automation", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .createRow(
        {
          row: {
            tableId: table._id,
            name: "Created",
            category: "temporary",
            value: 1,
          },
        },
        { stepName: "CreateRow" }
      )
      .updateRow(
        {
          rowId: "{{ stepsByName.CreateRow.row._id }}",
          row: {
            tableId: table._id,
            name: "Updated",
            category: "temporary",
            value: 2,
          },
          meta: {
            fields: {
              name: {},
              category: {},
              value: {},
            },
          },
        },
        { stepName: "UpdateRow" }
      )
      .getRow(
        {
          tableId: table._id!,
          rowId: "{{ stepsByName.UpdateRow.row._id }}",
        },
        { stepName: "GetRow" }
      )
      .deleteRow({
        tableId: table._id!,
        id: "{{ stepsByName.GetRow.row._id }}",
        revision: "{{ stepsByName.GetRow.row._rev }}",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[1].outputs).toMatchObject({
      success: true,
      row: {
        name: "Updated",
        category: "temporary",
        value: 2,
      },
    })
    expect(results.steps[2].outputs.row).toMatchObject({
      name: "Updated",
      category: "temporary",
      value: 2,
    })
    expect(results.steps[3].outputs.success).toBe(true)
  })
})
