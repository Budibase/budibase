const selfHostMiddleware = require("../selfhost");
const env = require("../../environment")
const hosting = require("../../utilities/builder/hosting");
jest.mock("../../environment") 
jest.mock("../../utilities/builder/hosting") 

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

  setCloudHosted() {
    env.CLOUD = 1 
    env.SELF_HOSTED = 0
  }

  setSelfHosted() {
    env.CLOUD = 0
    env.SELF_HOSTED = 1
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

  it("calls next() when CLOUD and SELF_HOSTED env vars are set", async () => {
    env.CLOUD = 1 
    env.SELF_HOSTED = 1 

    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })

  it("throws when hostingInfo type is cloud", async () => {
    config.setSelfHosted()

    hosting.getHostingInfo.mockImplementationOnce(() => ({ type: hosting.HostingTypes.CLOUD }))

    await config.executeMiddleware()
    expect(config.throw).toHaveBeenCalledWith(400, "Endpoint unavailable in cloud hosting.")
    expect(config.next).not.toHaveBeenCalled()
  })

  it("calls the self hosting middleware to pass through to next() when the hostingInfo type is self", async () => {
    config.setSelfHosted()

    hosting.getHostingInfo.mockImplementationOnce(() => ({ type: hosting.HostingTypes.SELF }))

    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })
})
