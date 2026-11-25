import { blacklist, setEnv as setCoreEnv } from "@budibase/backend-core"
import { GenericContainer, Wait } from "testcontainers"
import redis from "../redis"
import { startContainer } from "./utils"

jest.setTimeout(60_000)

describe("Redis integration with a real server", () => {
  let config: { host: string; port: number; username: string }
  let resetBlacklistEnv: () => void

  beforeAll(async () => {
    const ports = await startContainer(
      new GenericContainer("redis")
        .withExposedPorts(6379)
        .withWaitStrategy(Wait.forListeningPorts())
    )
    const port = ports.find(x => x.container === 6379)?.host
    if (!port) {
      throw new Error("Redis port not found")
    }
    config = { host: "localhost", port, username: "" }
    // The test server runs on loopback, which the default blacklist blocks.
    resetBlacklistEnv = setCoreEnv({ BLACKLIST_IPS: "" })
    await blacklist.refreshBlacklist()
  })

  afterAll(async () => {
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
  })

  it("connects to an allowed host", async () => {
    const integration = new redis.integration(config)

    const response = await integration.testConnection()

    expect(response).toEqual({ connected: true })
  })

  it("writes and reads a key", async () => {
    await new redis.integration(config).create({
      key: "key",
      value: "value",
      ttl: 0,
    })

    const value = await new redis.integration(config).read({ key: "key" })

    expect(value).toEqual("value")
  })

  it("does not connect to the host with the default blacklist", async () => {
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
    const integration = new redis.integration(config)

    const response = await integration.testConnection()

    expect(response.connected).toBe(false)
    expect(response.error).toContain(
      "Host is blocked or could not be resolved safely."
    )
  })
})
