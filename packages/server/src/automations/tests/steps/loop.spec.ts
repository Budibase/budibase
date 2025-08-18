import * as automation from "../../index"
import { basicTable } from "../../../tests/utilities/structures"
import {
  Table,
  LoopStepType,
  ServerLogStepOutputs,
  CreateRowStepOutputs,
  FieldType,
  FilterCondition,
  AutomationStepStatus,
  AutomationStepResult,
  AutomationActionStepId,
} from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

// Helper to get items from new loop output structure
const getLoopItems = (
  loopOutput: any
): Record<string, AutomationStepResult[]> => {
  // New structure uses items for full results or defaults to empty
  return loopOutput.items || {}
}

describe("Loop Automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()

    table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {})
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("attempt to run a basic loop", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows({
        tableId: table._id!,
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.rows }}",
      })
      .serverLog({ text: "log statement" })
      .test({ fields: {} })

    expect(result.steps[1].outputs.iterations).toBe(1)
  })

  it("test a loop with a string", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.STRING,
        binding: "a,b,c",
      })
      .serverLog({ text: "log statement" })
      .test({ fields: {} })

    expect(result.steps[0].outputs.iterations).toBe(3)
  })

  it("test a loop with a binding that returns an integer", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ 1 }}",
      })
      .serverLog({ text: "log statement" })
      .test({ fields: {} })

    expect(result.steps[0].outputs.iterations).toBe(1)
  })

  it("ensure that we maintain step identity", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        {
          text: "hello",
        },
        {
          stepName: "someStepName",
        }
      )
      .loop({
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3],
      })
      .serverLog({ text: "log statement {{loop.currentItem}}" })
      .test({ fields: {} })

    // Legacy loop should present child step identity and correct iterations
    expect(result.steps[1].stepId).toBe(AutomationActionStepId.SERVER_LOG)
    expect(result.steps[1].outputs.iterations).toBe(3)
  })

  it("should run an automation with a trigger, loop, and create row step", async () => {
    const results = await createAutomationBuilder(config)
      .onRowSaved({ tableId: table._id! })
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
      .test({
        row: {
          name: "Trigger Row",
          description: "This row triggers the automation",
        },
        id: "1234",
        revision: "1",
      })

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
    const results = await createAutomationBuilder(config)
      .onRowSaved({ tableId: table._id! })
      .queryRows({
        tableId: table._id!,
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3],
      })
      .serverLog({ text: "Message {{loop.currentItem}}" })
      .serverLog({ text: "{{steps.1.rows.0._id}}" })
      .test({
        row: {
          name: "Trigger Row",
          description: "This row triggers the automation",
        },
        id: "1234",
        revision: "1",
      })

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

  it("ensure the loop stops if the failure condition is reached", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: ["test", "test2", "test3"],
        failure: "test2",
      })
      .serverLog({ text: "Message {{loop.currentItem}}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual(
      expect.objectContaining({
        status: "FAILURE_CONDITION_MET",
        success: false,
      })
    )
  })

  it("ensure the loop stops if the max iterations are reached", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: ["test", "test2", "test3"],
        iterations: 2,
      })
      .serverLog({ text: "{{loop.currentItem}}" })
      .serverLog({ text: "{{steps.1.iterations}}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.status).toBe(
      AutomationStepStatus.MAX_ITERATIONS
    )
    expect(results.steps[0].outputs.iterations).toBe(2)
    expect(results.steps[0].outputs.items).toHaveLength(2)
    expect(results.steps[0].outputs.items[0].message).toEndWith("test")
    expect(results.steps[0].outputs.items[1].message).toEndWith("test2")
  })

  it("should stop when a failure condition is hit", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: ["test", "test2", "test3"],
        failure: "test3",
      })
      .serverLog({ text: "{{loop.currentItem}}" })
      .serverLog({ text: "{{steps.1.iterations}}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.status).toBe(
      AutomationStepStatus.FAILURE_CONDITION
    )
    expect(results.steps[0].outputs.iterations).toBe(2)
    expect(results.steps[0].outputs.items).toHaveLength(2)
    expect(results.steps[0].outputs.items[0].message).toEndWith("test")
    expect(results.steps[0].outputs.items[1].message).toEndWith("test2")
  })

  it("should run an automation with loop and max iterations to ensure context correctness further down the tree", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: ["test", "test2", "test3"],
        iterations: 2,
      })
      .serverLog({ text: "{{loop.currentItem}}" })
      .serverLog({ text: "{{steps.1.iterations}}" })
      .test({ fields: {} })

    expect(results.steps[1].outputs.message).toContain("- 2")
  })

  it("should run an automation where a loop is successfully run twice", async () => {
    const results = await createAutomationBuilder(config)
      .onRowSaved({ tableId: table._id! })
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
      .test({
        row: {
          name: "Trigger Row",
          description: "This row triggers the automation",
        },
        id: "1234",
        revision: "1",
      })

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
    const results = await createAutomationBuilder(config)
      .onAppAction()
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
      .test({ fields: {} })

    // We want to ensure that bindings are corr
    expect(results.steps[1].outputs.message).toContain("- 3")
    expect(results.steps[3].outputs.message).toContain("- 3")
  })

  it("should use automation names to loop with", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop(
        {
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        },
        { stepName: "FirstLoopStep" }
      )
      .serverLog(
        { text: "Message {{loop.currentItem}}" },
        { stepName: "FirstLoopLog" }
      )
      .serverLog(
        { text: "{{steps.FirstLoopLog.iterations}}" },
        { stepName: "FirstLoopIterationLog" }
      )
      .test({ fields: {} })

    expect(results.steps[1].outputs.message).toContain("- 3")
  })

  it("should run an automation with a loop and update row step", async () => {
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

    const rows = [
      { name: "Row 1", value: 1, tableId: table._id },
      { name: "Row 2", value: 2, tableId: table._id },
      { name: "Row 3", value: 3, tableId: table._id },
    ]

    await config.api.row.bulkImport(table._id!, { rows })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows({
        tableId: table._id!,
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.rows }}",
      })
      .updateRow({
        rowId: "{{ loop.currentItem._id }}",
        row: {
          name: "Updated {{ loop.currentItem.name }}",
          value: "{{ loop.currentItem.value }}",
          tableId: table._id,
        },
        meta: {},
      })
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    const expectedRows = [
      { name: "Updated Row 1", value: 1 },
      { name: "Updated Row 2", value: 2 },
      { name: "Updated Row 3", value: 3 },
    ]

    expect(results.steps[1].outputs.items).toEqual(
      expect.arrayContaining(
        expectedRows.map(row =>
          expect.objectContaining({
            success: true,
            row: expect.objectContaining(row),
          })
        )
      )
    )

    expect(results.steps[2].outputs.rows).toEqual(
      expect.arrayContaining(
        expectedRows.map(row => expect.objectContaining(row))
      )
    )

    expect(results.steps[1].outputs.items).toHaveLength(expectedRows.length)
    expect(results.steps[2].outputs.rows).toHaveLength(expectedRows.length)
  })

  it("should run an automation with a loop and update row step using stepIds", async () => {
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

    const rows = [
      { name: "Row 1", value: 1, tableId: table._id },
      { name: "Row 2", value: 2, tableId: table._id },
      { name: "Row 3", value: 3, tableId: table._id },
    ]

    await config.api.row.bulkImport(table._id!, { rows })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows(
        {
          tableId: table._id!,
        },
        { stepId: "abc123" }
      )
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.abc123.rows }}",
      })
      .updateRow({
        rowId: "{{ loop.currentItem._id }}",
        row: {
          name: "Updated {{ loop.currentItem.name }}",
          value: "{{ loop.currentItem.value }}",
          tableId: table._id,
        },
        meta: {},
      })
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    const expectedRows = [
      { name: "Updated Row 1", value: 1 },
      { name: "Updated Row 2", value: 2 },
      { name: "Updated Row 3", value: 3 },
    ]

    expect(results.steps[1].outputs.items).toEqual(
      expect.arrayContaining(
        expectedRows.map(row =>
          expect.objectContaining({
            success: true,
            row: expect.objectContaining(row),
          })
        )
      )
    )

    expect(results.steps[2].outputs.rows).toEqual(
      expect.arrayContaining(
        expectedRows.map(row => expect.objectContaining(row))
      )
    )

    expect(results.steps[1].outputs.items).toHaveLength(expectedRows.length)
    expect(results.steps[2].outputs.rows).toHaveLength(expectedRows.length)
  })

  it("should run an automation with a loop and delete row step", async () => {
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

    const rows = [
      { name: "Row 1", value: 1, tableId: table._id },
      { name: "Row 2", value: 2, tableId: table._id },
      { name: "Row 3", value: 3, tableId: table._id },
    ]

    await config.api.row.bulkImport(table._id!, { rows })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .queryRows({
        tableId: table._id!,
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.rows }}",
      })
      .deleteRow({
        tableId: table._id!,
        id: "{{ loop.currentItem._id }}",
      })
      .queryRows({
        tableId: table._id!,
      })
      .test({ fields: {} })

    expect(results.steps).toHaveLength(3)

    expect(results.steps[2].outputs.rows).toHaveLength(0)
  })

  it("should successfully loop over an array returned by a JavaScript step with Array input type", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({
        code: "return [1, 2, 3, 4, 5]",
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.value }}",
      })
      .serverLog({ text: "Processing item: {{loop.currentItem}}" })
      .test({ fields: {} })

    expect(results.steps[1].outputs.success).toBe(true)
    expect(results.steps[1].outputs.iterations).toBe(5)
    expect(results.steps[1].outputs.items).toHaveLength(5)

    results.steps[1].outputs.items.forEach((output: any, index: number) => {
      expect(output).toMatchObject({
        success: true,
      })
      expect(output.message).toContain(`Processing item: ${index + 1}`)
    })
  })

  it("should test array binding directly", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3],
      })
      .serverLog({ text: "Processing item: {{loop.currentItem}}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toBe(true)
    expect(results.steps[0].outputs.iterations).toBe(3)
    expect(results.steps[0].outputs.items).toHaveLength(3)
  })

  it("should successfully loop over an array of objects returned by a JavaScript step", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({
        code: `
          return [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
          ]
        `,
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.value }}",
      })
      .serverLog({
        text: "User: {{loop.currentItem.name}} (ID: {{loop.currentItem.id}})",
      })
      .test({ fields: {} })

    expect(results.steps[1].outputs.success).toBe(true)
    expect(results.steps[1].outputs.iterations).toBe(3)
    expect(results.steps[1].outputs.items).toHaveLength(3)

    const expectedNames = ["Alice", "Bob", "Charlie"]
    const expectedIds = [1, 2, 3]

    results.steps[1].outputs.items.forEach((output: any, index: number) => {
      expect(output).toMatchObject({
        success: true,
      })
      expect(output.message).toContain(
        `User: ${expectedNames[index]} (ID: ${expectedIds[index]})`
      )
    })
  })

  it("should successfully loop over an empty array returned by a JavaScript step", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executeScript({
        code: "return []",
      })
      .loop({
        option: LoopStepType.ARRAY,
        binding: "{{ steps.1.value }}",
      })
      .serverLog({ text: "This should not execute" })
      .test({ fields: {} })

    expect(results.steps[1].outputs.success).toBe(true)
    expect(results.steps[1].outputs.status).toBe(
      AutomationStepStatus.NO_ITERATIONS
    )
    expect(results.steps[1].outputs.iterations).toBe(0)
    expect(results.steps[1].outputs.items).toHaveLength(0)
  })

  describe("loop output", () => {
    it("should not output anything if a filter stops the automation", async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .filter({
          condition: FilterCondition.EQUAL,
          field: "1",
          value: "2",
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .test({ fields: {} })

      expect(results.steps.length).toBe(1)
      expect(results.steps[0].outputs).toEqual({
        comparisonValue: 2,
        refValue: 1,
        result: false,
        success: true,
        status: "stopped",
      })
    })

    it("should not fail if queryRows returns nothing", async () => {
      const table = await config.api.table.save(basicTable())
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .queryRows({
          tableId: table._id!,
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: "{{ steps.1.rows }}",
        })
        .serverLog({ text: "Message {{loop.currentItem}}" })
        .test({ fields: {} })

      expect(results.steps[1].outputs.success).toBe(true)
      expect(results.steps[1].outputs.status).toBe(
        AutomationStepStatus.NO_ITERATIONS
      )
    })
  })

  describe("Multiple children within a loop", () => {
    it("should create a basic loop v2 step with multiple children", async () => {
      const binding = [1, 2, 3]
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({
                text: "Log Step 1 processing item: {{loop.currentItem}}",
              }),
              builder.serverLog({
                text: "Log Step 2 processing item: {{loop.currentItem}}",
              }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding,
        })
        .serverLog({ text: "Hello" })
        .test({ fields: {} })

      // Check new output structure
      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.iterations).toBe(3)
      expect(steps[0].outputs.summary).toBeDefined()
      expect(steps[0].outputs.summary.totalProcessed).toBe(6) // 2 children x 3 iterations
      expect(steps[0].outputs.summary.successCount).toBe(6)
      expect(steps[0].outputs.summary.failureCount).toBe(0)

      let results = getLoopItems(steps[0].outputs)

      Object.values(results).forEach((results, stepIndex) => {
        results.forEach((result, i) => {
          expect(result.outputs.message).toContain(
            `Log Step ${stepIndex + 1} processing item: ${i + 1}`
          )
        })
      })
    })

    it("should handle empty children array", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: () => [],
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.iterations).toBe(3)
      expect(steps[0].outputs.summary.totalProcessed).toBe(0)
      expect(getLoopItems(steps[0].outputs)).toEqual({})
    })

    it("should handle no iterations with multiple children", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "Should not run" }),
              builder.serverLog({ text: "Also should not run" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [],
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.status).toBe(AutomationStepStatus.NO_ITERATIONS)
      expect(steps[0].outputs.iterations).toBe(0)
      expect(steps[0].outputs.summary.totalProcessed).toBe(0)

      const items = getLoopItems(steps[0].outputs)
      expect(Object.values(items).every((item: any) => item.length === 0)).toBe(
        true
      )
    })

    it("should fail the loop if any child step fails", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "Starting {{loop.currentItem}}" }),
              builder.executeScript({
                code: `
                  if (loop.currentItem === 2) {
                    throw new Error("Intentional error on item 2")
                  }
                  return loop.currentItem
                `,
              }),
              builder.serverLog({ text: "Completed {{loop.currentItem}}" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3],
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(false)
      expect(steps[0].outputs.summary).toBeDefined()
      expect(steps[0].outputs.summary.failureCount).toBeGreaterThan(0)
    })

    it("should respect max iterations with multiple children", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "Step 1: {{loop.currentItem}}" }),
              builder.serverLog({ text: "Step 2: {{loop.currentItem}}" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [1, 2, 3, 4, 5],
          iterations: 3,
        })
        .test({ fields: {} })

      expect(steps[0].outputs.iterations).toBe(3)
      expect(steps[0].outputs.status).toBe(AutomationStepStatus.MAX_ITERATIONS)
      expect(steps[0].outputs.success).toBe(false)
      expect(steps[0].outputs.summary.totalProcessed).toBe(6) // 2 children x 3 iterations

      const loopResults = getLoopItems(steps[0].outputs)

      Object.values(loopResults).forEach(childResults => {
        expect(childResults).toHaveLength(3)
      })
    })

    it("should stop on failure condition with multiple children", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "Processing: {{loop.currentItem}}" }),
              builder.executeScript({
                code: "return loop.currentItem",
              }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: ["continue", "continue", "stop", "should-not-process"],
          failure: "stop",
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(false)
      expect(steps[0].outputs.status).toBe(
        AutomationStepStatus.FAILURE_CONDITION
      )
      expect(steps[0].outputs.summary.totalProcessed).toBe(4) // 2 children x 2 iterations before stop
      expect(steps[0].outputs.summary.failureCount).toBe(0) // No actual failures, just stop condition

      const loopResults = getLoopItems(steps[0].outputs)

      Object.values(loopResults).forEach(childResults => {
        expect(childResults).toHaveLength(2)
      })
    })

    it("should handle loops with database operations on multiple children", async () => {
      const testTable = await config.createTable({
        name: "LoopTestTable",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: { presence: true },
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

      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.createRow({
                row: {
                  name: "Item {{loop.currentItem.name}}",
                  category: "{{loop.currentItem.category}}",
                  value: "{{loop.currentItem.value}}",
                  tableId: testTable._id,
                },
              }),
              builder.executeScript({
                code: "return steps[1].row._id",
              }),
              builder.serverLog({
                text: "Created row with ID: {{steps.2.value}}",
              }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [
            { name: "Product A", category: "Electronics", value: 100 },
            { name: "Product B", category: "Books", value: 20 },
            { name: "Product C", category: "Electronics", value: 150 },
          ],
        })
        .queryRows({
          tableId: testTable._id!,
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.summary.totalProcessed).toBe(9) // 3 children x 3 iterations
      expect(steps[0].outputs.summary.successCount).toBe(9)

      const loopResults = getLoopItems(steps[0].outputs)
      const [createResults, , logResults] = Object.values(loopResults)

      expect(createResults).toHaveLength(3)
      createResults.forEach(result => {
        expect(result.outputs.success).toBe(true)
        expect(result.outputs.row.name).toContain("Product")
      })

      logResults.forEach(result => {
        expect(result.outputs.message).toMatch(/Created row with ID: ro_/)
      })

      expect(steps[1].outputs.rows).toHaveLength(3)
    })

    it("should preserve correct step indexing with loopV2", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({ text: "Before loop" })
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "Inside loop: {{loop.currentItem}}" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [1, 2],
        })
        .serverLog({
          text: "After loop - previous step count: {{steps.2.iterations}}",
        })
        .test({ fields: {} })

      expect(steps[0].outputs.message).toContain("Before loop")
      expect(steps[1].outputs.success).toBe(true)
      expect(steps[1].outputs.iterations).toBe(2)
      expect(steps[1].outputs.summary.totalProcessed).toBe(2)
      expect(steps[2].outputs.message).toContain(
        "After loop - previous step count: 2"
      )
    })

    it("should handle mixing legacy and new loops", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loop({
          option: LoopStepType.ARRAY,
          binding: [1, 2],
        })
        .serverLog({ text: "Legacy loop: {{loop.currentItem}}" })
        .loopV2({
          steps: builder => {
            return [
              builder.serverLog({ text: "New loop: {{loop.currentItem}}" }),
              builder.serverLog({ text: "Second child: {{loop.currentItem}}" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: ["A", "B"],
        })
        .test({ fields: {} })

      // Legacy loop still returns flat array
      expect(steps[0].outputs.iterations).toBe(2)
      expect(steps[0].outputs.items).toHaveLength(2)
      expect(steps[0].outputs.items[0].message).toContain("Legacy loop: 1")
      expect(steps[0].outputs.items[1].message).toContain("Legacy loop: 2")

      // New loop returns structured results
      expect(steps[1].outputs.iterations).toBe(2)
      expect(steps[1].outputs.summary.totalProcessed).toBe(4) // 2 children x 2 iterations
      const newLoopResults = getLoopItems(steps[1].outputs)

      expect(Object.keys(newLoopResults)).toHaveLength(2)
      const [firstChild, secondChild] = Object.values(newLoopResults)

      expect(firstChild[0].outputs.message).toContain("New loop: A")
      expect(secondChild[0].outputs.message).toContain("Second child: A")
    })

    it("should maintain separate context for each iteration", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.executeScript({
                // eslint-disable-next-line no-template-curly-in-string
                code: "return `Prefix-${loop.currentItem}`",
              }),
              builder.serverLog({
                text: "{{steps.1.value}}",
              }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: ["A", "B", "C"],
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.summary.totalProcessed).toBe(6) // 2 children x 3 iterations

      const loopResults = getLoopItems(steps[0].outputs)
      const [, logResults] = Object.values(loopResults)

      expect(logResults[0].outputs.message).toContain("Prefix-A")
      expect(logResults[1].outputs.message).toContain("Prefix-B")
      expect(logResults[2].outputs.message).toContain("Prefix-C")
    })

    it("should support nested loops", async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: outerBuilder => {
            return [
              outerBuilder.serverLog({
                text: "Outer loop: {{loop.currentItem.name}}",
              }),
              outerBuilder.loopV2({
                steps: innerBuilder => {
                  return [
                    innerBuilder.serverLog({
                      text: "Inner loop: {{loop.currentItem}}",
                    }),
                  ]
                },
                option: LoopStepType.ARRAY,
                binding: "{{loop.currentItem.values}}",
              }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: [
            { name: "Group A", values: ["A1", "A2", "A3"] },
            { name: "Group B", values: ["B1", "B2"] },
          ],
        })
        .test({ fields: {} })

      // Basic checks
      expect(results.steps[0].outputs.success).toBe(true)
      expect(results.steps[0].outputs.iterations).toBe(2)
      expect(results.steps[0].outputs.summary.totalProcessed).toBe(4) // 2 children x 2 iterations

      // Check nested summaries
      expect(results.steps[0].outputs.nestedSummaries).toBeDefined()

      const outerLoopResults = getLoopItems(results.steps[0].outputs)

      const outerStepIds = Object.keys(outerLoopResults)

      // Check outer loop logs
      const outerLogResults = outerLoopResults[outerStepIds[0]]
      expect(outerLogResults[0].outputs.message).toContain(
        "Outer loop: Group A"
      )
      expect(outerLogResults[1].outputs.message).toContain(
        "Outer loop: Group B"
      )

      // Check inner loop results
      const innerLoopResults = outerLoopResults[outerStepIds[1]]

      // The inner loops should execute properly with context preservation
      expect(innerLoopResults[0].outputs.success).toBe(true)
      expect(innerLoopResults[1].outputs.success).toBe(true)

      // Check inner loop summaries
      expect(innerLoopResults[0].outputs.summary.totalProcessed).toBe(3)
      expect(innerLoopResults[1].outputs.summary.totalProcessed).toBe(3)
    })

    it("should handle filter steps that stop execution within a loop iteration", async () => {
      const { steps } = await createAutomationBuilder(config)
        .onAppAction()
        .loopV2({
          steps: builder => {
            return [
              builder.filter({
                condition: FilterCondition.NOT_EQUAL,
                field: "{{loop.currentItem}}",
                value: "skip",
              }),
              builder.serverLog({ text: "Processed: {{loop.currentItem}}" }),
            ]
          },
          option: LoopStepType.ARRAY,
          binding: ["process", "skip", "process"],
        })
        .test({ fields: {} })

      expect(steps[0].outputs.success).toBe(true)
      expect(steps[0].outputs.summary.totalProcessed).toBe(3)
      expect(steps[0].outputs.summary.successCount).toBe(3)

      const loopResults = getLoopItems(steps[0].outputs)
      const [filterResults, logResults] = Object.values(loopResults)

      expect(filterResults[0].outputs.result).toBe(true)
      expect(logResults[0].outputs.message).toContain("Processed: process")

      expect(filterResults[1].outputs.result).toBe(false)
      expect(filterResults[1].outputs.status).toBe("stopped")

      expect(logResults).toHaveLength(1)
      expect(logResults[0].outputs.message).toContain("Processed: process")
    })
  })
})
