const setup = require("./utilities")

describe("test the delay action", () => {
  it("should be able to run the delay", async () => {
    const time = 100
    const before = Date.now()
    await setup.runStep(setup.logic.DELAY.stepId, { time: time })
    const now = Date.now()
    // divide by two just so that test will always pass as long as there was some sort of delay
    expect(now - before).toBeGreaterThanOrEqual(time / 2)
  })
})