import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  getCappedTestDelayMs,
  getDelayMs,
  TEST_DELAY_CAP_MS,
} from "../../steps/delay"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { DurationType } from "@budibase/types"

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

  it("should convert the delay unit to milliseconds", () => {
    expect(getDelayMs({ time: 3000 })).toBe(3000)
    expect(getDelayMs({ time: 100, unit: DurationType.MILLISECONDS })).toBe(100)
    expect(getDelayMs({ time: 10, unit: DurationType.SECONDS })).toBe(10000)
    expect(getDelayMs({ time: 10, unit: DurationType.MINUTES })).toBe(600000)
    expect(getDelayMs({ time: 2, unit: DurationType.HOURS })).toBe(7200000)
    expect(getDelayMs({ time: 3, unit: DurationType.DAYS })).toBe(259200000)
  })

  it("should cap test delays to three seconds", () => {
    expect(getCappedTestDelayMs({ time: 1, unit: DurationType.DAYS })).toBe(
      TEST_DELAY_CAP_MS
    )
    expect(getCappedTestDelayMs({ time: 2, unit: DurationType.SECONDS })).toBe(
      2000
    )
  })
})
