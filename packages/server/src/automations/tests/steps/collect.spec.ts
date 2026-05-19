import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("collect step", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("fails when no collection is supplied", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .collect({ collection: "" })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toEqual({
      success: false,
    })
  })

  it("returns the supplied collection", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .collect({ collection: "saved value" })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toEqual({
      success: true,
      value: "saved value",
    })
  })
})
