import * as automation from "../../index"
import * as setup from "../utilities"
import {
  Table,
  LoopStepType,
  CreateRowStepOutputs,
  ServerLogStepOutputs,
} from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Loop automations", () => {
  let config = setup.getConfig(),
    table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(setup.afterAll)

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

  it("should use automation names to loop with", async () => {
    const builder = createAutomationBuilder({
      name: "Test Trigger with Loop and Create Row",
    })

    const results = await builder
      .appAction({ fields: {} })
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
      .run()

    expect(results.steps[1].outputs.message).toContain("- 3")
  })
})
