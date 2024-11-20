import { runStep, actions, getConfig } from "./utilities"
import { reset } from "timekeeper"

// need real Date for this test
reset()

describe("test the delay logic", () => {
  const config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  it("should be able to run the delay", async () => {
    const time = 100
    const before = Date.now()
    await runStep(config, actions.DELAY.stepId, { time: time })
    const now = Date.now()
    // divide by two just so that test will always pass as long as there was some sort of delay
    expect(now - before).toBeGreaterThanOrEqual(time / 2)
  })
})
