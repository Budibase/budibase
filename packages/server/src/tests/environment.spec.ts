import environment from "../environment"

describe("environment", () => {
  it("limits aggregate JavaScript execution time by default", () => {
    expect(environment.getDefaults().JS_PER_REQUEST_TIME_LIMIT_MS).toBe(10000)
    expect(environment.JS_PER_REQUEST_TIMEOUT_MS).toBe(10000)
  })
})
