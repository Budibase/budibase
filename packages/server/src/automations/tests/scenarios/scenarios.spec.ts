import * as automation from "../../index"
import * as setup from "../utilities"
import { Table, LoopStepType } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationBuilder"

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
})
