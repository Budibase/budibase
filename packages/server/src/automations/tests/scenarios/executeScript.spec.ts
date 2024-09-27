import * as automation from "../../index"
import * as setup from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Execute Script Automations", () => {
  let config = setup.getConfig()

  beforeEach(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(setup.afterAll)

  it("should execute a script and return the expected result", async () => {
    const builder = createAutomationBuilder({
      name: "Test Execute Script",
    })

    const results = await builder
      .appAction({ fields: {} })
      .executeScript({
        code: `
          const result = 1 + 1;
          return result;
        `,
      })
      .run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs).containin({
      success: true,
      result: 2,
    })
  })

  it("should execute a script with inputs and return the expected result", async () => {
    const builder = createAutomationBuilder({
      name: "Test Execute Script with Inputs",
    })

    const results = await builder
      .appAction({ fields: { a: 2, b: 3 } })
      .executeScript({
        code: `
          const { a, b } = trigger.fields;
          const result = a + b;
          return result;
        `,
      })
      .run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      result: 5,
    })
  })

  it("should handle script errors gracefully", async () => {
    const builder = createAutomationBuilder({
      name: "Test Execute Script with Error",
    })

    const results = await builder
      .appAction({ fields: {} })
      .executeScript({
        // @ts-ignore
        code: null,
      })
      .run()

    expect(results.steps).toHaveLength(1)
    expect(results.steps[0].outputs.success).toEqual(false)
    expect(results.steps[0].outputs.response.message).toEqual("Invalid inputs")
  })
})
