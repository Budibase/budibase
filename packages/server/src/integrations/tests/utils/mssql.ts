import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"

export async function mssql(): Promise<Datasource> {
  const container = await new GenericContainer(
    "mcr.microsoft.com/mssql/server:2022-latest"
  )
    .withName("budibase-test-mssql")
    .withReuse()
    .withExposedPorts(1433)
    .withEnvironment({
      ACCEPT_EULA: "Y",
      MSSQL_SA_PASSWORD: "Password_123",
      // This is important, as Microsoft allow us to use the "Developer" edition
      // of SQL Server for development and testing purposes. We can't use other
      // versions without a valid license, and we cannot use the Developer
      // version in production.
      MSSQL_PID: "Developer",
    })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Password_123 -q 'SELECT 1'"
      )
    )
    .start()

  const host = container.getHost()
  const port = container.getMappedPort(1433)

  return {
    type: "datasource_plus",
    source: SourceName.SQL_SERVER,
    plus: true,
    config: {
      server: host,
      port,
      user: "sa",
      password: "Password_123",
      options: {
        encrypt: false,
      },
    },
  }
}
