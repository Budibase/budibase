import { FieldType } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Row workflow automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await automation.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("creates a row from a row trigger payload", async () => {
    const table = await config.api.table.save(basicTable())

    const results = await createAutomationBuilder(config)
      .onRowUpdated({ tableId: table._id! })
      .createRow({
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id,
        },
      })
      .test({
        row: { name: "Test", description: "TEST" },
        id: "1234",
      })

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      row: {
        name: "Test",
        description: "TEST",
      },
    })
  })

  it("queries rows from a table", async () => {
    const table = await config.api.table.save(basicTable())
    const row = {
      name: "Test Row",
      description: "original description",
    }
    await config.api.row.save(table._id!, row)
    await config.api.row.save(table._id!, row)

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.rows).toHaveLength(2)
  })

  it("queries rows and deletes a selected row", async () => {
    const table = await config.api.table.save(basicTable())
    const row = {
      name: "DFN",
      description: "original description",
    }
    await config.api.row.save(table._id!, row)
    await config.api.row.save(table._id!, row)

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows({
        tableId: table._id!,
      })
      .deleteRow({
        tableId: table._id!,
        id: "{{ steps.1.rows.0._id }}",
      })
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    expect(results.steps).toHaveLength(3)
    expect(results.steps[1].outputs.success).toBeTruthy()
    expect(results.steps[2].outputs.rows).toHaveLength(1)
  })

  it("creates and then updates a row", async () => {
    const table = await config.api.table.save({
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

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .createRow(
        {
          row: {
            name: "Initial Row",
            value: 1,
            tableId: table._id,
          },
        },
        { stepName: "CreateRowStep" }
      )
      .updateRow(
        {
          rowId: "{{ steps.CreateRowStep.row._id }}",
          row: {
            name: "Updated Row",
            value: 2,
            tableId: table._id,
          },
          meta: {},
        },
        { stepName: "UpdateRowStep" }
      )
      .queryRows(
        {
          tableId: table._id!,
        },
        { stepName: "QueryRowsStep" }
      )
      .test({ fields: {} })

    expect(results.steps).toHaveLength(3)
    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      row: {
        name: "Initial Row",
        value: 1,
      },
    })
    expect(results.steps[1].outputs).toMatchObject({
      success: true,
      row: {
        name: "Updated Row",
        value: 2,
      },
    })
    expect(results.steps[2].outputs.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Updated Row", value: 2 }),
      ])
    )
  })
})
