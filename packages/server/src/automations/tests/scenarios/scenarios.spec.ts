import * as automation from "../../index"
import * as setup from "../utilities"
import {
  Table,
  LoopStepType,
  CreateRowStepOutputs,
  ServerLogStepOutputs,
  FieldType,
  Row,
} from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationBuilder"
import {
  DatabaseName,
  getDatasource,
  knexClient,
} from "../../../integrations/tests/utils"
import { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"

describe("Automation Scenarios", () => {
  let config = setup.getConfig(),
    table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(setup.afterAll)

  describe("Loop automations", () => {
    it("should run an automation with a trigger, loop, and create row step", async () => {
      const builder = createAutomationBuilder({
        name: "Test Trigger with Loop and Create Row",
      })

      const results = await builder
        .rowSaved(
          { tableId: table._id! },
          {
            row: {
              name: "Trigger Row",
              description: "This row triggers the automation",
            },
            id: "1234",
            revision: "1",
          }
        )
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .createRow({
          row: {
            name: "Item {{ loop.currentItem }}",
            description: "Created from loop",
            tableId: table._id,
          },
        })
        .run()

      expect(results.trigger).toBeDefined()
      expect(results.steps).toHaveLength(1)

      expect(results.steps[0].outputs.iterations).toBe(3)
      expect(results.steps[0].outputs.items).toHaveLength(3)

      results.steps[0].outputs.items.forEach((output: any, index: number) => {
        expect(output).toMatchObject({
          success: true,
          row: {
            name: `Item ${index + 1}`,
            description: "Created from loop",
          },
        })
      })
    })

    it("should run an automation where a loop is successfully run twice", async () => {
      const builder = createAutomationBuilder({
        name: "Test Trigger with Loop and Create Row",
      })

      const results = await builder
        .rowSaved(
          { tableId: table._id! },
          {
            row: {
              name: "Trigger Row",
              description: "This row triggers the automation",
            },
            id: "1234",
            revision: "1",
          }
        )
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .createRow({
          row: {
            name: "Item {{ loop.currentItem }}",
            description: "Created from loop",
            tableId: table._id,
          },
        })
        .loop({
          option: LoopStepType.STRING,
          binding: "Message 1,Message 2,Message 3",
        })
        .serverLog({ text: "{{loop.currentItem}}" })
        .run()

      expect(results.trigger).toBeDefined()
      expect(results.steps).toHaveLength(2)

      expect(results.steps[0].outputs.iterations).toBe(3)
      expect(results.steps[0].outputs.items).toHaveLength(3)

      results.steps[0].outputs.items.forEach(
        (output: CreateRowStepOutputs, index: number) => {
          expect(output).toMatchObject({
            success: true,
            row: {
              name: `Item ${index + 1}`,
              description: "Created from loop",
            },
          })
        }
      )

      expect(results.steps[1].outputs.iterations).toBe(3)
      expect(results.steps[1].outputs.items).toHaveLength(3)

      results.steps[1].outputs.items.forEach(
        (output: ServerLogStepOutputs, index: number) => {
          expect(output).toMatchObject({
            success: true,
          })
          expect(output.message).toContain(`Message ${index + 1}`)
        }
      )
    })
  })

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

  it("should query an external database for some data then insert than into an internal table", async () => {
    let newTable = await config.createTable({
      name: "table",
      type: "table",
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: {
            type: FieldType.STRING,
            presence: true,
          },
        },
        age: {
          name: "age",
          type: FieldType.NUMBER,
          constraints: {
            type: FieldType.NUMBER,
            presence: true,
          },
        },
      },
    })

    let client: Knex

    let db = await getDatasource(DatabaseName.MYSQL)
    let datasource = await config.api.datasource.create(db)
    client = await knexClient(db)
    let tableName = generator.guid()
    await client.schema.createTable(tableName, table => {
      table.string("name")
      table.integer("age")
    })
    // insert multiple rows
    await client(tableName).insert([
      { name: "Joe", age: 20 },
      { name: "Bob", age: 25 },
      { name: "Paul", age: 30 },
    ])

    let query = await config.api.query.save({
      name: "test query",
      datasourceId: datasource._id!,
      parameters: [],
      fields: {
        sql: client(tableName).select("*").toSQL().toNative().sql,
      },
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })

    const builder = createAutomationBuilder({
      name: "Test external query and save",
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

    results.steps[1].outputs.items.forEach(
      (output: CreateRowStepOutputs, index: number) => {
        expect(output).toMatchObject({
          success: true,
          row: {
            name: ["Joe", "Bob", "Paul"][index],
            age: [20, 25, 30][index],
          },
        })
      }
    )

    // Assertions for the final query step
    expect(results.steps[2].outputs.rows).toHaveLength(3)
    results.steps[2].outputs.rows.forEach((row: Row, index: number) => {
      expect(row).toMatchObject({
        name: ["Joe", "Bob", "Paul"][index],
        age: [20, 25, 30][index],
      })
    })
  })
})
