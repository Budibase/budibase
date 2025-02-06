import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("test the server log action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to log the text", async () => {
    const result = await createAutomationBuilder(config)
      .serverLog({ text: "Hello World" })
      .run()
    expect(result.steps[0].outputs.message).toEqual(
      `App ${config.getAppId()} - Hello World`
    )
    expect(result.steps[0].outputs.success).toEqual(true)
  })
})
