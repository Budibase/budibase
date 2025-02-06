import * as automation from "../../index"
import * as triggers from "../../triggers"
import { basicTable, loopAutomation } from "../../../tests/utilities/structures"
import { context } from "@budibase/backend-core"
import {
  Table,
  LoopStepType,
  AutomationResults,
  ServerLogStepOutputs,
  CreateRowStepOutputs,
  FieldType,
} from "@budibase/types"
import * as loopUtils from "../../loopUtils"
import { LoopInput } from "../../../definitions/automations"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("Attempt to run a basic loop automation", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    table = await config.api.table.save(basicTable())
    await config.api.row.save(table._id!, {})
  })

  afterAll(() => {
    automation.shutdown()
    config.end()
  })

  async function runLoop(loopOpts?: LoopInput): Promise<AutomationResults> {
    const appId = config.getAppId()
    return await context.doInAppContext(appId, async () => {
      const params = { fields: { appId } }
      const result = await triggers.externalTrigger(
        loopAutomation(table._id!, loopOpts),
        params,
        { getResponses: true }
      )
      if ("outputs" in result && !result.outputs.success) {
        throw new Error("Unable to proceed - failed to return anything.")
      }
      return result as AutomationResults
    })
  }

  it("attempt to run a basic loop", async () => {
    const resp = await runLoop()
    expect(resp.steps[2].outputs.iterations).toBe(1)
  })

  it("test a loop with a string", async () => {
    const resp = await runLoop({
      option: LoopStepType.STRING,
      binding: "a,b,c",
    })
    expect(resp.steps[2].outputs.iterations).toBe(3)
  })

  it("test a loop with a binding that returns an integer", async () => {
    const resp = await runLoop({
      option: LoopStepType.ARRAY,
      binding: "{{ 1 }}",
    })
    expect(resp.steps[2].outputs.iterations).toBe(1)
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

  it("if an incorrect type is passed to the loop it should return an error", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .loop({
        option: LoopStepType.ARRAY,
        binding: "1, 2, 3",
      })
      .serverLog({ text: "Message {{loop.currentItem}}" })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: false,
      status: "INCORRECT_TYPE",
    })
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

    expect(results.steps[0].outputs.iterations).toBe(2)
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

  describe("replaceFakeBindings", () => {
    it("should replace loop bindings in nested objects", () => {
      const originalStepInput = {
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
              length: { maximum: null },
              presence: false,
            },
            name: "name",
            display: { type: "Text" },
          },
        },
        row: {
          tableId: "ta_aaad4296e9f74b12b1b90ef7a84afcad",
          name: "{{ loop.currentItem.pokemon }}",
        },
      }

      const loopStepNumber = 3

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual({
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
              length: { maximum: null },
              presence: false,
            },
            name: "name",
            display: { type: "Text" },
          },
        },
        row: {
          tableId: "ta_aaad4296e9f74b12b1b90ef7a84afcad",
          name: "{{ steps.3.currentItem.pokemon }}",
        },
      })
    })

    it("should handle null values in nested objects", () => {
      const originalStepInput = {
        nullValue: null,
        nestedNull: {
          someKey: null,
        },
        validValue: "{{ loop.someValue }}",
      }

      const loopStepNumber = 2

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual({
        nullValue: null,
        nestedNull: {
          someKey: null,
        },
        validValue: "{{ steps.2.someValue }}",
      })
    })

    it("should handle empty objects and arrays", () => {
      const originalStepInput = {
        emptyObject: {},
        emptyArray: [],
        nestedEmpty: {
          emptyObj: {},
          emptyArr: [],
        },
      }

      const loopStepNumber = 1

      const result = loopUtils.replaceFakeBindings(
        originalStepInput,
        loopStepNumber
      )

      expect(result).toEqual(originalStepInput)
    })
  })
})
