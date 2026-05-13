import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { AutomationStatus } from "@budibase/types"

function encodeJS(js: string): string {
  return `{{ js "${Buffer.from(js, "utf-8").toString("base64")}" }}`
}

describe("test the server log action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to log the text", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Hello World" })
      .test({ fields: {} })
    expect(result.steps[0].outputs.message).toEqual(
      `App ${config.getDevWorkspaceId()} - Hello World`
    )
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should fail when log text JavaScript errors", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: encodeJS("return kill") })
      .test({ fields: {} })

    expect(result.status).toEqual(AutomationStatus.ERROR)
    expect(result.steps[0].outputs.success).toEqual(false)
    expect(result.steps[0].outputs.message).toContain(
      "ReferenceError: kill is not defined"
    )
  })

  it("should stop after a log text JavaScript error", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: encodeJS("return kill") })
      .serverLog({ text: "This should not run" })
      .test({ fields: {} })

    expect(result.status).toEqual(AutomationStatus.ERROR)
    expect(result.steps).toHaveLength(1)
    expect(result.steps[0].outputs.success).toEqual(false)
  })
})
