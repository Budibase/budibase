import { GenericContainer } from "testcontainers"
import { Duration, TemporalUnit } from "node-duration"

import postgres from "../../../../packages/server/src/integrations/postgres"
import { SourceName } from "@budibase/types"

jest.unmock("pg")
jest.unmock("mssql")

describe("datasource validators", () => {
  describe("postgres", () => {
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
      const integration = new postgres.integration({
        host,
        port,
        database: "postgres",
        user: "postgres",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
      })
      const result = await integration.testConnection()
      expect(result).toBe(true)
    })

    it("test invalid connection string", async () => {
      const integration = new postgres.integration({
        host,
        port,
        database: "postgres",
        user: "wrong",
        password: "password",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        error: 'password authentication failed for user "wrong"',
      })
    })
  })

  describe("mssql", () => {
    const validator = integrations.getValidator[SourceName.SQL_SERVER]!

    let host: string, port: number

    const password = "Str0Ng_p@ssW0rd!"

    beforeAll(async () => {
      const container = await new GenericContainer(
        "mcr.microsoft.com/mssql/server"
      )
        .withExposedPorts(1433)
        .withEnv("ACCEPT_EULA", "Y")
        .withEnv("MSSQL_SA_PASSWORD", password)
        .withEnv("MSSQL_PID", "Developer")
        .withWaitStrategy(Wait.forHealthCheck())
        .withHealthCheck({
          test: `/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${password}" -Q "SELECT 1" -b -o /dev/null`,
          interval: new Duration(1000, TemporalUnit.MILLISECONDS),
          timeout: new Duration(3, TemporalUnit.SECONDS),
          retries: 20,
          startPeriod: new Duration(100, TemporalUnit.MILLISECONDS),
        })
        .start()

      host = container.getContainerIpAddress()
      port = container.getMappedPort(1433)
    })

    it("test valid connection string", async () => {
      const result = await validator({
        user: "sa",
        password,
        server: host,
        port: port,
        database: "master",
        schema: "dbo",
      })
      expect(result).toBe(true)
    })

    it("test invalid password", async () => {
      const result = await validator({
        user: "sa",
        password: "wrong_pwd",
        server: host,
        port: port,
        database: "master",
        schema: "dbo",
      })
      expect(result).toEqual({
        error: "ConnectionError: Login failed for user 'sa'.",
      })
    })
  })
})
