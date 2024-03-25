import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function start(): Promise<StartedTestContainer> {
  return await new GenericContainer(
    "mcr.microsoft.com/mssql/server:2022-latest"
  )
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
}

export async function datasource(): Promise<Datasource> {
  if (!container) {
    container = await start()
  }
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

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
