const selfHostMiddleware = require("../selfhost").default
const env = require("../../environment")
jest.mock("../../environment")

class TestConfiguration {
  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()
    this.middleware = selfHostMiddleware

    this.ctx = {
      next: this.next,
      throw: this.throw
    }
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  afterEach() {
    jest.clearAllMocks()
  }
}

describe("Self host middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  it("calls next() when SELF_HOSTED env var is set", async () => {
    env.SELF_HOSTED = 1 

    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })
})
