import { createAutomationBuilder } from "../utilities/AutomationBuilder"
import { TRIGGER_DEFINITIONS, BUILTIN_ACTION_DEFINITIONS } from "../.."
import * as setup from "../utilities"
import { LoopStepType } from "../../../definitions/automations"
describe("Create Row", () => {
  let config: any

  beforeAll(async () => {
    config = setup.getConfig()
    await config.init()
  })

  it("should run a ROW_SAVE and CREATE_ROW automation", async () => {
    const table = await config.createTable()

    const builder = createAutomationBuilder(config, {
      name: "Test Row Save and Create",
    })

    const results = await builder
      .trigger(TRIGGER_DEFINITIONS.ROW_SAVED, { tableId: table._id })
      .step(BUILTIN_ACTION_DEFINITIONS.CREATE_ROW, {
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id,
        },
      })
      .run({
        row: {
          name: "Test",
          description: "TEST",
        },
      })

    // Using the updated expectStepOutput helper
    builder
      .expectStepOutput(0, {
        success: true,
        row: {
          name: "Test",
          description: "TEST",
        },
      })
      .toMatchObject(results)
  })

  it("should run an automation with a trigger, loop, and create row step", async () => {
    const table = await config.createTable()

    const builder = createAutomationBuilder(config, {
      name: "Test Trigger with Loop and Create Row",
    })

    const results = await builder
      .trigger(TRIGGER_DEFINITIONS.ROW_SAVED, { tableId: table._id })
      .step(BUILTIN_ACTION_DEFINITIONS.LOOP, {
        option: LoopStepType.ARRAY,
        binding: [1, 2, 3],
      })
      .step(BUILTIN_ACTION_DEFINITIONS.CREATE_ROW, {
        row: {
          name: "Item {{ loop.currentItem }}",
          description: "Created from loop",
          tableId: table._id,
        },
      })
      .run({
        row: {
          name: "Trigger Row",
          description: "This row triggers the automation",
        },
      })

    expect(results.trigger).toBeDefined()
    expect(results.steps).toHaveLength(1)

    expect(results.steps[0].outputs.iterations).toBe(3)
    expect(results.steps[0].outputs.items).toHaveLength(3)

    results.steps[0].outputs.items.forEach((output: any, index: number) => {
      builder
        .expectStepOutput(0, {
          success: true,
          row: {
            name: `Item ${index + 1}`,
            description: "Created from loop",
          },
        })
        .toMatchObject({ steps: [{ outputs: output }] })
    })
  })
})
