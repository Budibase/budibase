import { SourceName } from "@budibase/types"
import integrations from "../../../integrations"
import { GenericContainer } from "testcontainers"

jest.unmock("pg")

describe("datasource validators", () => {
  describe("postgres", () => {
    const validator = integrations.getValidators(SourceName.POSTGRES)!

    let host: string
    let port: number

    beforeAll(async () => {
      const container = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withEnv("POSTGRES_PASSWORD", "password")
        .start()

      host = container.getContainerIpAddress()
      port = container.getMappedPort(5432)
    })

    it("test valid connection string", async () => {
      const result = await validator({
        host,
        port,
        database: "postgres",
        user: "postgres",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
        ca: false,
      })
      expect(result).toBeTruthy()
    })

    it("test invalid connection string", async () => {
      const result = await validator({
        host,
        port,
        database: "postgres",
        user: "wrong",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
        ca: false,
      })
      expect(result).toEqual({
        error: 'password authentication failed for user "wrong"',
      })
    })
  })
})
