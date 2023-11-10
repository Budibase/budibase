import { GenericContainer, Wait } from "testcontainers"
import { Duration, TemporalUnit } from "node-duration"

import mssql from "../../../../packages/server/src/integrations/microsoftSqlServer"

jest.unmock("mssql")

describe("datasource validators", () => {
  describe("mssql", () => {
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
      const integration = new mssql.integration({
        user: "sa",
        password,
        server: host,
        port: port,
        database: "master",
        schema: "dbo",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })

    it("test invalid password", async () => {
      const integration = new mssql.integration({
        user: "sa",
        password: "wrong_pwd",
        server: host,
        port: port,
        database: "master",
        schema: "dbo",
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error: "Login failed for user 'sa'.",
      })
    })
  })
})
