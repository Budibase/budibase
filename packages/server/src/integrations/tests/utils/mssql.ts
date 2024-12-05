import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex, { Knex } from "knex"
import { MSSQL_IMAGE } from "./images"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(MSSQL_IMAGE)
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
          ).withStartupTimeout(20000)
        )
    )
  }

  const port = (await ports).find(x => x.container === 1433)?.host
  if (!port) {
    throw new Error("SQL Server port not found")
  }

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.SQL_SERVER,
    plus: true,
    config: {
      server: "127.0.0.1",
      port,
      user: "sa",
      password: "Password_123",
      options: {
        encrypt: false,
      },
    },
  }

  const database = generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE DATABASE "${database}"`)
  datasource.config!.database = database

  return datasource
}

export async function knexClient(ds: Datasource, opts?: Knex.Config) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.SQL_SERVER) {
    throw new Error("Datasource source is not MSSQL")
  }

  return knex({
    client: "mssql",
    connection: ds.config,
    ...opts,
  })
}
