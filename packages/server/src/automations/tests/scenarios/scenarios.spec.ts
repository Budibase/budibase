import * as automation from "../../index"
import * as setup from "../utilities"
import {
  Table,
  LoopStepType,
  CreateRowStepOutputs,
  ServerLogStepOutputs,
  FieldType,
} from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { DatabaseName } from "../../../integrations/tests/utils"

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

  describe("Branching automations", () => {
    it("should run a multiple nested branching automation", async () => {
      const builder = createAutomationBuilder({
        name: "Test Trigger with Loop and Create Row",
      })

      const results = await builder
        .appAction({ fields: {} })
        .serverLog({ text: "Starting automation" })
        .branch({
          topLevelBranch1: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Branch 1" }).branch({
                branch1: {
                  steps: stepBuilder =>
                    stepBuilder.serverLog({ text: "Branch 1.1" }),
                  condition: {
                    equal: { "steps.1.success": true },
                  },
                },
                branch2: {
                  steps: stepBuilder =>
                    stepBuilder.serverLog({ text: "Branch 1.2" }),
                  condition: {
                    equal: { "steps.1.success": false },
                  },
                },
              }),
            condition: {
              equal: { "steps.1.success": true },
            },
          },
          topLevelBranch2: {
            steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 2" }),
            condition: {
              equal: { "steps.1.success": false },
            },
          },
        })
        .run()
      expect(results.steps[3].outputs.status).toContain("branch1 branch taken")
      expect(results.steps[4].outputs.message).toContain("Branch 1.1")
    })

    it("should execute correct branch based on string equality", async () => {
      const builder = createAutomationBuilder({
        name: "String Equality Branching",
      })

      const results = await builder
        .appAction({ fields: { status: "active" } })
        .branch({
          activeBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Active user" }),
            condition: {
              equal: { "trigger.fields.status": "active" },
            },
          },
          inactiveBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Inactive user" }),
            condition: {
              equal: { "trigger.fields.status": "inactive" },
            },
          },
        })
        .run()
      expect(results.steps[0].outputs.status).toContain(
        "activeBranch branch taken"
      )
      expect(results.steps[1].outputs.message).toContain("Active user")
    })

    it("should handle multiple conditions with AND operator", async () => {
      const builder = createAutomationBuilder({
        name: "Multiple AND Conditions Branching",
      })

      const results = await builder
        .appAction({ fields: { status: "active", role: "admin" } })
        .branch({
          activeAdminBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Active admin user" }),
            condition: {
              $and: {
                conditions: [
                  { equal: { "trigger.fields.status": "active" } },
                  { equal: { "trigger.fields.role": "admin" } },
                ],
              },
            },
          },
          otherBranch: {
            steps: stepBuilder => stepBuilder.serverLog({ text: "Other user" }),
            condition: {
              notEqual: { "trigger.fields.status": "active" },
            },
          },
        })
        .run()

      expect(results.steps[1].outputs.message).toContain("Active admin user")
    })

    it("should handle multiple conditions with OR operator", async () => {
      const builder = createAutomationBuilder({
        name: "Multiple OR Conditions Branching",
      })

      const results = await builder
        .appAction({ fields: { status: "test", role: "user" } })
        .branch({
          specialBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Special user" }),
            condition: {
              $or: {
                conditions: [
                  { equal: { "trigger.fields.status": "test" } },
                  { equal: { "trigger.fields.role": "admin" } },
                ],
              },
            },
          },
          regularBranch: {
            steps: stepBuilder =>
              stepBuilder.serverLog({ text: "Regular user" }),
            condition: {
              $and: {
                conditions: [
                  { notEqual: { "trigger.fields.status": "active" } },
                  { notEqual: { "trigger.fields.role": "admin" } },
                ],
              },
            },
          },
        })
        .run()

      expect(results.steps[1].outputs.message).toContain("Special user")
    })
  })

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

    it("should run an automation where a loop step is between two normal steps to ensure context correctness", async () => {
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
        .queryRows({
          tableId: table._id!,
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .serverLog({ text: "{{steps.1.rows.0._id}}" })
        .run()

      results.steps[1].outputs.items.forEach(
        (output: ServerLogStepOutputs, index: number) => {
          expect(output).toMatchObject({
            success: true,
          })
          expect(output.message).toContain(`Message ${index + 1}`)
        }
      )

      expect(results.steps[2].outputs.message).toContain("ro_ta")
    })

    it("if an incorrect type is passed to the loop it should return an error", async () => {
      const builder = createAutomationBuilder({
        name: "Test Loop error",
      })

      const results = await builder
        .appAction({ fields: {} })
        .loop({
          option: LoopStepType.ARRAY,
          binding: "1, 2, 3",
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .run()

      expect(results.steps[0].outputs).toEqual({
        success: false,
        status: "INCORRECT_TYPE",
      })
    })

    it("ensure the loop stops if the failure condition is reached", async () => {
      const builder = createAutomationBuilder({
        name: "Test Loop error",
      })

      const results = await builder
        .appAction({ fields: {} })
        .loop({
          option: LoopStepType.ARRAY,
          binding: ["test", "test2", "test3"],
          failure: "test2",
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .run()

      expect(results.steps[0].outputs).toEqual(
        expect.objectContaining({
          status: "FAILURE_CONDITION_MET",
          success: false,
        })
      )
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

    it("should run an automation where a loop is used twice to ensure context correctness further down the tree", async () => {
      const builder = createAutomationBuilder({
        name: "Test Trigger with Loop and Create Row",
      })

      const results = await builder
        .appAction({ fields: {} })
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .serverLog({ text: "{{steps.1.iterations}}" })
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .serverLog({ text: "{{loop.currentItem}}" })
        .serverLog({ text: "{{steps.3.iterations}}" })
        .run()

      // We want to ensure that bindings are corr
      expect(results.steps[1].outputs.message).toContain("- 3")
      expect(results.steps[3].outputs.message).toContain("- 3")
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
    const { datasource, client } = await setup.setupTestDatasource(
      config,
      DatabaseName.MYSQL
    )

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

    const tableName = await setup.createTestTable(client, {
      name: { type: "string" },
      age: { type: "number" },
    })

    const rows = [
      { name: "Joe", age: 20 },
      { name: "Bob", age: 25 },
      { name: "Paul", age: 30 },
    ]

    await setup.insertTestData(client, tableName, rows)

    const query = await setup.saveTestQuery(
      config,
      client,
      tableName,
      datasource
    )

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

    expect(results.steps[2].outputs.rows).toHaveLength(3)

    rows.forEach(expectedRow => {
      expect(results.steps[2].outputs.rows).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedRow)])
      )
    })
  })
})
