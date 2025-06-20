import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import { setEnv as setCoreEnv } from "@budibase/backend-core"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

function encodePy(py: string): string {
  // For parity with JS tests we simply trim – no special encoding required for python.
  return py.trim()
}

describe("Execute Python Automations", () => {
  let config = new TestConfiguration()
  let resetEnv: () => void | undefined

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  beforeEach(async () => {
    // Ensure python step is included in self-hosted mode.
    resetEnv = setCoreEnv({ SELF_HOSTED: true })
    table = await config.createTable()
    await config.createRow()
  })

  afterEach(() => {
    resetEnv && resetEnv()
  })

  afterAll(() => {
    config.end()
  })

  it("should execute a basic python script and return the result", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executePython({ code: encodePy("return 2 + 2") })
      .test({ fields: {} })

    expect(results.steps[0].outputs.value).toEqual(4)
  })

  it("should access trigger bindings from context", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executePython({
        code: encodePy("return trigger['fields']['value'] * 2"),
      })
      .test({ fields: { value: 21 } })

    expect(results.steps[0].outputs.value).toEqual(42)
  })

  it("should handle python execution errors gracefully", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .executePython({ code: encodePy("return nonexistent_variable * 2") })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toEqual(false)
    expect(results.steps[0].outputs.response).toBeDefined()
  })
})
