import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { AbstractWaitStrategy } from "testcontainers/build/wait-strategies/wait-strategy"
import { rawQuery } from "./mysql"
import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."

let ports: Promise<testContainerUtils.Port[]>

class MariaDBWaitStrategy extends AbstractWaitStrategy {
  async waitUntilReady(container: any, boundPorts: any, startTime?: Date) {
    // Because MariaDB first starts itself up, runs an init script, then restarts,
    // it's possible for the mysqladmin ping to succeed early and then tests to
    // run against a MariaDB that's mid-restart and fail. To get around this, we
    // wait for logs and then do a ping check.

    const logs = Wait.forLogMessage("mariadbd: ready for connections", 2)
    await logs.waitUntilReady(container, boundPorts, startTime)

    const command = Wait.forSuccessfulCommand(
      `/usr/local/bin/healthcheck.sh --innodb_initialized`
    )
    await command.waitUntilReady(container)
  }
}

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer("mariadb:lts")
        .withExposedPorts(3306)
        .withEnvironment({ MARIADB_ROOT_PASSWORD: "password" })
        .withWaitStrategy(new MariaDBWaitStrategy())
    )
  }

  const port = (await ports).find(x => x.container === 3306)?.host
  if (!port) {
    throw new Error("MariaDB port not found")
  }

  const config = {
    host: "127.0.0.1",
    port,
    user: "root",
    password: "password",
    database: "mysql",
  }

  const datasource = {
    type: "datasource_plus",
    source: SourceName.MYSQL,
    plus: true,
    config,
  }

  const database = generator.guid().replaceAll("-", "")
  await rawQuery(datasource, `CREATE DATABASE \`${database}\``)
  datasource.config.database = database
  return datasource
}
