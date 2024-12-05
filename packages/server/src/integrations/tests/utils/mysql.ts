import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { AbstractWaitStrategy } from "testcontainers/build/wait-strategies/wait-strategy"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import knex, { Knex } from "knex"
import { MYSQL_IMAGE } from "./images"

let ports: Promise<testContainerUtils.Port[]>

class MySQLWaitStrategy extends AbstractWaitStrategy {
  async waitUntilReady(container: any, boundPorts: any, startTime?: Date) {
    // Because MySQL first starts itself up, runs an init script, then restarts,
    // it's possible for the mysqladmin ping to succeed early and then tests to
    // run against a MySQL that's mid-restart and fail. To get around this, we
    // wait for logs and then do a ping check.

    const logs = Wait.forLogMessage(
      "/usr/sbin/mysqld: ready for connections",
      2
    )
    await logs.waitUntilReady(container, boundPorts, startTime)

    const command = Wait.forSuccessfulCommand(
      `mysqladmin ping -h localhost -P 3306 -u root -ppassword`
    )
    await command.waitUntilReady(container)
  }
}

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(MYSQL_IMAGE)
        .withExposedPorts(3306)
        .withEnvironment({ MYSQL_ROOT_PASSWORD: "password" })
        .withWaitStrategy(new MySQLWaitStrategy().withStartupTimeout(20000))
    )
  }

  const port = (await ports).find(x => x.container === 3306)?.host
  if (!port) {
    throw new Error("MySQL port not found")
  }

  const datasource: Datasource = {
    type: "datasource_plus",
    source: SourceName.MYSQL,
    plus: true,
    config: {
      host: "127.0.0.1",
      port,
      user: "root",
      password: "password",
      database: "mysql",
    },
  }

  const database = generator.guid().replaceAll("-", "")
  const client = await knexClient(datasource)
  await client.raw(`CREATE DATABASE \`${database}\``)
  datasource.config!.database = database
  return datasource
}

export async function knexClient(ds: Datasource, opts?: Knex.Config) {
  if (!ds.config) {
    throw new Error("Datasource config is missing")
  }
  if (ds.source !== SourceName.MYSQL) {
    throw new Error("Datasource source is not MySQL")
  }

  return knex({
    client: "mysql2",
    connection: ds.config,
    ...opts,
  })
}
