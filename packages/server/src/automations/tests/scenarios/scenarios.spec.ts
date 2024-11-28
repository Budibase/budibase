import * as automation from "../../index"
import * as setup from "../utilities"
import { LoopStepType, FieldType, Table, Datasource } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { FilterConditions } from "../../../automations/steps/filter"
import { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"

describe("Automation Scenarios", () => {
  let config = setup.getConfig()

  beforeEach(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(setup.afterAll)

  describe("Row Automations", () => {
    it("should trigger an automation which then creates a row", async () => {
      const table = await config.createTable()

      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .rowUpdated(
          { tableId: table._id! },
          {
            row: { name: "Test", description: "TEST" },
            id: "1234",
          }
        )
        .createRow({
          row: {
            name: "{{trigger.row.name}}",
            description: "{{trigger.row.description}}",
            tableId: table._id,
          },
        })
        .run()

      expect(results.steps).toHaveLength(1)

      expect(results.steps[0].outputs).toMatchObject({
        success: true,
        row: {
          name: "Test",
          description: "TEST",
        },
      })
    })

    it("should trigger an automation which querys the database", async () => {
      const table = await config.createTable()
      const row = {
        name: "Test Row",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .appAction({ fields: {} })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps).toHaveLength(1)
      expect(results.steps[0].outputs.rows).toHaveLength(2)
    })

    it("should trigger an automation which querys the database then deletes a row", async () => {
      const table = await config.createTable()
      const row = {
        name: "DFN",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .appAction({ fields: {} })
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
        .run()

      expect(results.steps).toHaveLength(3)
      expect(results.steps[1].outputs.success).toBeTruthy()
      expect(results.steps[2].outputs.rows).toHaveLength(1)
    })

    it("should trigger an automation which creates and then updates a row", async () => {
      const table = await config.createTable({
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

      const builder = createAutomationBuilder({
        name: "Test Create and Update Row",
      })

      const results = await builder
        .appAction({ fields: {} })
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
        .run()

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

      const expectedRows = [{ name: "Updated Row", value: 2 }]

      expect(results.steps[2].outputs.rows).toEqual(
        expect.arrayContaining(
          expectedRows.map(row => expect.objectContaining(row))
        )
      )
    })
  })

  describe("Name Based Automations", () => {
    it("should fetch and delete a rpw using automation naming", async () => {
      const table = await config.createTable()
      const row = {
        name: "DFN",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Query and Delete Row",
      })

      const results = await builder
        .appAction({ fields: {} })
        .queryRows(
          {
            tableId: table._id!,
          },
          { stepName: "InitialQueryStep" }
        )
        .deleteRow({
          tableId: table._id!,
          id: "{{ steps.InitialQueryStep.rows.0._id }}",
        })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps).toHaveLength(3)
      expect(results.steps[1].outputs.success).toBeTruthy()
      expect(results.steps[2].outputs.rows).toHaveLength(1)
    })
  })
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

  it("Check user is passed through from row trigger", async () => {
    const table = await config.createTable()

    const builder = createAutomationBuilder({
      name: "Test a user is successfully passed from the trigger",
    })

    const results = await builder
      .rowUpdated(
        { tableId: table._id! },
        {
          row: { name: "Test", description: "TEST" },
          id: "1234",
        }
      )
      .serverLog({ text: "{{ [user].[email] }}" })
      .run()

    expect(results.steps[0].outputs.message).toContain("example.com")
  })

  it("Check user is passed through from app trigger", async () => {
    const builder = createAutomationBuilder({
      name: "Test a user is successfully passed from the trigger",
    })

    const results = await builder
      .appAction({ fields: {} })
      .serverLog({ text: "{{ [user].[email] }}" })
      .run()

    expect(results.steps[0].outputs.message).toContain("example.com")
  })
})

const descriptions = datasourceDescribe({ only: [DatabaseName.MYSQL] })

if (descriptions.length) {
  describe.each(descriptions)("/rows ($dbName)", ({ config, dsProvider }) => {
    let datasource: Datasource
    let client: Knex

    beforeAll(async () => {
      const ds = await dsProvider()
      datasource = ds.datasource!
      client = ds.client!
    })

    it("should query an external database for some data then insert than into an internal table", async () => {
      const newTable = await config.createTable({
        name: "table",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          age: {
            name: "age",
            type: FieldType.NUMBER,
            constraints: {
              presence: true,
            },
          },
        },
      })

      const tableName = generator.guid()
      await client.schema.createTable(tableName, table => {
        table.string("name")
        table.integer("age")
      })

      const rows = [
        { name: "Joe", age: 20 },
        { name: "Bob", age: 25 },
        { name: "Paul", age: 30 },
      ]

      await client(tableName).insert(rows)

      const query = await setup.saveTestQuery(
        config,
        client,
        tableName,
        datasource
      )

      const builder = createAutomationBuilder({
        name: "Test external query and save",
        config,
      })

      const results = await builder
        .appAction({
          fields: {},
        })
        .executeQuery({
          query: {
            queryId: query._id!,
          },
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: "{{ steps.1.response }}",
        })
        .createRow({
          row: {
            name: "{{ loop.currentItem.name }}",
            age: "{{ loop.currentItem.age }}",
            tableId: newTable._id!,
          },
        })
        .queryRows({
          tableId: newTable._id!,
        })
        .run()

      expect(results.steps).toHaveLength(3)

      expect(results.steps[1].outputs.iterations).toBe(3)
      expect(results.steps[1].outputs.items).toHaveLength(3)

      expect(results.steps[2].outputs.rows).toHaveLength(3)

      rows.forEach(expectedRow => {
        expect(results.steps[2].outputs.rows).toEqual(
          expect.arrayContaining([expect.objectContaining(expectedRow)])
        )
      })
    })
  })
}
