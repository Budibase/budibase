import { AutomationActionStepId } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { runStep } from "./utilities"

describe("test the delay logic", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the delay", async () => {
    const start = performance.now()
    await runStep(config, AutomationActionStepId.DELAY, { time: 100 })
    const end = performance.now()

    expect(end - start).toBeGreaterThanOrEqual(95)
  })
})
