import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("test the delay logic", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the delay", async () => {
    const time = 100
    const before = performance.now()

    await createAutomationBuilder(config)
      .onAppAction()
      .delay({ time })
      .test({ fields: {} })

    const now = performance.now()

    // divide by two just so that test will always pass as long as there was some sort of delay
    expect(now - before).toBeGreaterThanOrEqual(time / 2)
  })
})
