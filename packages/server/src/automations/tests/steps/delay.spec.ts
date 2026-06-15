import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getDelayMs } from "../../steps/delay"
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
      .delay({ time, unit: "milliseconds" })
      .test({ fields: {} })

    const now = performance.now()

    // divide by two just so that test will always pass as long as there was some sort of delay
    expect(now - before).toBeGreaterThanOrEqual(time / 2)
  })

  it("should convert the delay unit to milliseconds", () => {
    expect(getDelayMs({ time: 100, unit: "milliseconds" })).toBe(100)
    expect(getDelayMs({ time: 10, unit: "seconds" })).toBe(10000)
    expect(getDelayMs({ time: 10, unit: "minutes" })).toBe(600000)
    expect(getDelayMs({ time: 2, unit: "hours" })).toBe(7200000)
    expect(getDelayMs({ time: 3, unit: "days" })).toBe(259200000)
  })
})
