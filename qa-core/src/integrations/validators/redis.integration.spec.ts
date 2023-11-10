import redis from "../../../../packages/server/src/integrations/redis"
import { GenericContainer } from "testcontainers"
import { generator } from "../../shared"

describe("datasource validators", () => {
  describe("redis", () => {
    describe("unsecured", () => {
      let host: string
      let port: number

      beforeAll(async () => {
        const container = await new GenericContainer("redis")
          .withExposedPorts(6379)
          .start()

        host = container.getContainerIpAddress()
        port = container.getMappedPort(6379)
      })

      it("test valid connection", async () => {
        const integration = new redis.integration({
          host,
          port,
          username: "",
        })
        const result = await integration.testConnection()
        expect(result).toEqual({ connected: true })
      })

      it("test invalid connection even with wrong user/password", async () => {
        const integration = new redis.integration({
          host,
          port,
          username: generator.name(),
          password: generator.hash(),
        })
        const result = await integration.testConnection()
        expect(result).toEqual({
          connected: false,
          error:
            "WRONGPASS invalid username-password pair or user is disabled.",
        })
      })
    })

    describe("secured", () => {
      let host: string
      let port: number

      beforeAll(async () => {
        const container = await new GenericContainer("redis")
          .withExposedPorts(6379)
          .withCmd(["redis-server", "--requirepass", "P@ssW0rd!"])
          .start()

        host = container.getContainerIpAddress()
        port = container.getMappedPort(6379)
      })

      it("test valid connection", async () => {
        const integration = new redis.integration({
          host,
          port,
          username: "",
          password: "P@ssW0rd!",
        })
        const result = await integration.testConnection()
        expect(result).toEqual({ connected: true })
      })
    })
  })
})
