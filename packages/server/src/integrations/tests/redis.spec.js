const redis = require("ioredis")
const RedisIntegration = require("../redis")
jest.mock("ioredis")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new RedisIntegration.integration(config) 
  }
}

describe("Redis Integration", () => {
  let config 

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      key: "key",
      value: "value"
    }
    const response = await config.integration.create(body)
    expect(config.integration.client.set).toHaveBeenCalledWith(body.key, body.value)
  })

  it("calls the read method with the correct params", async () => {
    const body = {
      key: "test"
    }
    const response = await config.integration.read(body)
    expect(config.integration.client.get).toHaveBeenCalledWith(body.key)
    expect(response).toEqual(expect.any(Object))
  })

  it("calls the delete method with the correct params", async () => {
    const body = {
      key: "test"
    }
    const response = await config.integration.delete(body)
    expect(config.integration.client.del).toHaveBeenCalledWith(body.key)
    expect(response).toEqual(expect.any(Object))
  })

  it("calls the command method with the correct params", async () => {
    const body = {
      json: "KEYS *"
    }

    const response = await config.integration.command(body)

    expect(config.integration.client.pipeline).toHaveBeenCalledWith([["KEYS", "*"]])
    expect(response).toEqual(expect.any(Array))
  })
})