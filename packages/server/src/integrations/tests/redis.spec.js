const Redis = require("ioredis-mock")
const RedisIntegration = require("../redis")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new RedisIntegration.integration(config) 
    this.redis = new Redis({
      data: {
        test: 'test',
        result: "1"
      },
    })
    this.integration.client = this.redis
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
    expect(await config.redis.get("key")).toEqual("value")
  })

  it("calls the read method with the correct params", async () => {
    const body = {
      key: "test"
    }
    const response = await config.integration.read(body)
    expect(response).toEqual("test")
  })

  it("calls the delete method with the correct params", async () => {
    const body = {
      key: "test"
    }
    await config.integration.delete(body)
    expect(await config.redis.get(body.key)).toEqual(null)
  })

  it("calls the pipeline method with the correct params", async () => {
    const body = {
      json: "KEYS *"
    }

    // ioredis-mock doesn't support pipelines
    config.integration.client.pipeline = jest.fn(() => ({ exec: jest.fn(() => [[]]) }))

    await config.integration.command(body)
    expect(config.integration.client.pipeline).toHaveBeenCalledWith([["keys", "*"]])
  })

  it("calls the pipeline method with several separated commands when there are newlines", async () => {
    const body = {
      json: 'SET foo "bar"\nGET foo'
    }

    // ioredis-mock doesn't support pipelines
    config.integration.client.pipeline = jest.fn(() => ({ exec: jest.fn(() => [[]]) }))

    await config.integration.command(body)
    expect(config.integration.client.pipeline).toHaveBeenCalledWith([
      ["set", 'foo', '"bar"'],
      ["get", 'foo']
    ])
  })
})