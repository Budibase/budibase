import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex, { Knex } from "knex"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  // password needs to conform to Oracle standards
  const password = "password"
  if (!ports) {
    // couldn't build 19.3.0 for X64
    let image = "budibase/oracle-database:23.2-slim-faststart"
    if (process.arch.startsWith("arm")) {
      // there isn't an ARM compatible 23.2 build
      image = "budibase/oracle-database:19.3.0-ee-slim-faststart"
    }

    ports = startContainer(
      new GenericContainer(image)
        .withExposedPorts(1521)
        .withEnvironment({
          ORACLE_PASSWORD: password,
        })
        .withWaitStrategy(
          Wait.forLogMessage("DATABASE IS READY TO USE!").withStartupTimeout(
            60000
          )
        )
    )
  }

  const port = (await ports).find(x => x.container === 1521)?.host
  if (!port) {
    throw new Error("Oracle port not found")
  }

  const host = "127.0.0.1"
  const user = "SYSTEM"

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

export async function knexClient(ds: Datasource, opts?: Knex.Config) {
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
    ...opts,
  })

  return c
}
