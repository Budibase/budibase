import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import pg from "pg"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer("postgres:16.1-bullseye")
        .withExposedPorts(5432)
        .withEnvironment({ POSTGRES_PASSWORD: "password" })
        .withWaitStrategy(
          Wait.forSuccessfulCommand(
            "pg_isready -h localhost -p 5432"
          ).withStartupTimeout(10000)
        )
    )
  }

  const port = (await ports).find(x => x.container === 5432)?.host

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.POSTGRES,
    plus: true,
    config: {
      host: "127.0.0.1",
      port,
      database: "postgres",
      user: "postgres",
      password: "password",
      schema: "public",
      ssl: false,
      rejectUnauthorized: false,
      ca: false,
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
  if (ds.source !== SourceName.POSTGRES) {
    throw new Error("Datasource source is not Postgres")
  }

  const client = new pg.Client(ds.config)
  await client.connect()
  try {
    const { rows } = await client.query(sql)
    return rows
  } finally {
    await client.end()
  }
}
