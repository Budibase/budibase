import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex from "knex"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    let image = "oracle/database:19.3.0.0-ee-slim-faststart"
    if (process.arch.startsWith("arm")) {
      image = "samhuang78/oracle-database:19.3.0-ee-slim-faststart"
    }

    ports = startContainer(
      new GenericContainer(image)
        .withExposedPorts(1521)
        .withEnvironment({ ORACLE_PASSWORD: "password" })
        .withWaitStrategy(Wait.forHealthCheck().withStartupTimeout(60000))
    )
  }

  const port = (await ports).find(x => x.container === 1521)?.host
  if (!port) {
    throw new Error("Oracle port not found")
  }

  const host = "127.0.0.1"
  const user = "SYSTEM"
  const password = "password"

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.ORACLE,
    plus: true,
    config: { host, port, user, password, database: "FREEPDB1" },
  }

  const newUser = "a" + generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE USER ${newUser} IDENTIFIED BY password`)
  await client.raw(
    `GRANT CONNECT, RESOURCE, CREATE VIEW, CREATE SESSION TO ${newUser}`
  )
  await client.raw(`GRANT UNLIMITED TABLESPACE TO ${newUser}`)
  datasource.config!.user = newUser

  return datasource
}

export async function knexClient(ds: Datasource) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.ORACLE) {
    throw new Error("Datasource source is not Oracle")
  }

  const db = ds.config.database || "FREEPDB1"
  const connectString = `${ds.config.host}:${ds.config.port}/${db}`

  const c = knex({
    client: "oracledb",
    connection: {
      connectString,
      user: ds.config.user,
      password: ds.config.password,
    },
  })

  return c
}
