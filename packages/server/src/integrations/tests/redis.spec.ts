const Redis = require("ioredis-mock")

import { default as RedisIntegration } from "../redis"

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new RedisIntegration.integration(config)
    this.integration.client = new Redis({
      data: {
        test: "test",
        result: "1",
      },
    })
  }
}

describe("Redis Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterAll(() => {
    config.integration.disconnect()
  })

  it("calls the create method with the correct params", async () => {
    const body = {
      key: "key",
      value: "value",
    }
    await config.integration.create(body)
    expect(await config.integration.client.get("key")).toEqual("value")
  })

  it("calls the read method with the correct params", async () => {
    const body = {
      key: "test",
    }
    const response = await config.integration.read(body)
    expect(response).toEqual("test")
  })

  it("calls the delete method with the correct params", async () => {
    const body = {
      key: "test",
    }
    await config.integration.delete(body)
    expect(await config.integration.client.get(body.key)).toEqual(null)
  })

  it("calls the pipeline method with the correct params", async () => {
    const body = {
      json: "KEYS *",
    }

    // ioredis-mock doesn't support pipelines
    config.integration.client.pipeline = jest.fn(() => ({
      exec: jest.fn(() => [[]]),
    }))

    await config.integration.command(body)
    expect(config.integration.client.pipeline).toHaveBeenCalledWith([
      ["keys", "*"],
    ])
  })

  it("calls the pipeline method with several separated commands when there are newlines", async () => {
    const body = {
      json: 'SET foo "bar"\nGET foo',
    }

    // ioredis-mock doesn't support pipelines
    config.integration.client.pipeline = jest.fn(() => ({
      exec: jest.fn(() => [[]]),
    }))

    await config.integration.command(body)
    expect(config.integration.client.pipeline).toHaveBeenCalledWith([
      ["set", "foo", '"bar"'],
      ["get", "foo"],
    ])
  })

  it("calls the pipeline method with double quoted phrase values", async () => {
    const body = {
      json: 'SET foo "What a wonderful world!"\nGET foo',
    }

    // ioredis-mock doesn't support pipelines
    config.integration.client.pipeline = jest.fn(() => ({
      exec: jest.fn(() => [[]]),
    }))

    await config.integration.command(body)
    expect(config.integration.client.pipeline).toHaveBeenCalledWith([
      ["set", "foo", '"What a wonderful world!"'],
      ["get", "foo"],
    ])
  })
})

describe("Redis Integration with the default blacklist", () => {
  it.each(["169.254.169.254", "127.0.0.1", "localhost"])(
    "does not connect to %s",
    async host => {
      const integration = new RedisIntegration.integration({
        host,
        port: 6379,
        username: "",
      })

      const response = await integration.testConnection!()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(
        "Host is blocked or could not be resolved safely."
      )
    }
  )

  it("does not run queries against a blocked host", async () => {
    const integration = new RedisIntegration.integration({
      host: "127.0.0.1",
      port: 6379,
      username: "",
    })

    await expect(integration.read!({ key: "test" })).rejects.toThrow(
      "Host is blocked or could not be resolved safely."
    )
  })
})
