import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import mssql from "mssql"
import { generator } from "@budibase/backend-core/tests"

export async function getDatasource(): Promise<Datasource> {
  let container = new GenericContainer(
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

  if (process.env.REUSE_CONTAINERS) {
    container = container.withReuse()
  }

  const startedContainer = await container.start()

  const host = startedContainer.getHost()
  const port = startedContainer.getMappedPort(1433)

  const datasource: Datasource = {
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

  const database = generator.guid().replaceAll("-", "")
  await rawQuery(datasource, `CREATE DATABASE "${database}"`)
  datasource.config!.database = database

  return datasource
}

export async function rawQuery(ds: Datasource, sql: string) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.SQL_SERVER) {
    throw new Error("Datasource source is not SQL Server")
  }

  const pool = new mssql.ConnectionPool(ds.config! as mssql.config)
  const client = await pool.connect()
  try {
    const { recordset } = await client.query(sql)
    return recordset
  } finally {
    await pool.close()
  }
}
