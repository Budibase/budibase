import { redis } from "@budibase/backend-core"
import { RedisIntegration } from "../redis"
import { Redis, RedisOptions } from "ioredis"
import { randomUUID } from "crypto"

describe("Redis Integration", () => {
  let integration: RedisIntegration
  let client: Redis

  beforeEach(() => {
    const { host, password, port } = redis.utils.getRedisConnectionDetails()
    if (!host) {
      throw new Error("Redis host not found")
    }
    if (!port) {
      throw new Error("Redis port not found")
    }
    if (!password) {
      throw new Error("Redis password not found")
    }

    const config: RedisOptions = {
      host,
      port,
      password,
    }

    integration = new RedisIntegration(config)
    client = new Redis(config)
  })

  afterEach(async () => {
    await client.flushall()
    await client.quit()
  })

  it("can write", async () => {
    const key = randomUUID()
    await integration.create({ key, value: "value", ttl: 100 })
    expect(await client.get(key)).toEqual("value")
  })

  it("can read", async () => {
    const key = randomUUID()
    await client.set(key, "test")
    const response = await integration.read({ key })
    expect(response).toEqual("test")
  })

  it("can delete", async () => {
    const key = randomUUID()
    await client.set(key, "test")
    expect(await client.get(key)).toEqual("test")

    await integration.delete({ key })
    expect(await client.get(key)).toEqual(null)
  })

  it("can run pipelines commands", async () => {
    const key1 = randomUUID()
    const key2 = randomUUID()
    await integration.command({
      json: `SET ${key1} "bar"\n SET ${key2} "hello world"`,
    })
    expect(await client.get(key1)).toEqual("bar")
    expect(await client.get(key2)).toEqual("hello world")
  })
})
