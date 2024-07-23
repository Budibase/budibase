import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex from "knex"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    let image = "oracle/database:19.3.0.0-ee"
    if (process.arch.startsWith("arm")) {
      image = "samhuang78/oracle-database:19.3.0-ee-slim-faststart"
    }

    ports = startContainer(
      new GenericContainer(image)
        .withExposedPorts(1521)
        .withEnvironment({ ORACLE_PASSWORD: "password" })
        .withWaitStrategy(Wait.forHealthCheck().withStartupTimeout(10000))
    )
  }

  const port = (await ports).find(x => x.container === 1521)?.host
  if (!port) {
    throw new Error("Oracle port not found")
  }

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.ORACLE,
    plus: true,
    config: {
      host: "127.0.0.1",
      port,
      database: "postgres",
      user: "SYS",
      password: "password",
    },
  }

  const database = generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE DATABASE "${database}"`)
  datasource.config!.database = database

  return datasource
}

export async function knexClient(ds: Datasource) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.ORACLE) {
    throw new Error("Datasource source is not Oracle")
  }

  return knex({
    client: "oracledb",
    connection: ds.config,
  })
}
