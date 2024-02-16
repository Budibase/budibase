import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import {
  AbstractWaitStrategy,
  WaitStrategy,
} from "testcontainers/build/wait-strategies/wait-strategy"

let container: StartedTestContainer | undefined

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

export async function start(): Promise<StartedTestContainer> {
  return await new GenericContainer("mysql:8.3")
    .withExposedPorts(3306)
    .withEnvironment({ MYSQL_ROOT_PASSWORD: "password" })
    .withWaitStrategy(new MySQLWaitStrategy().withStartupTimeout(10000))
    .start()
}

export async function datasource(): Promise<Datasource> {
  if (!container) {
    container = await start()
  }
  const host = container.getHost()
  const port = container.getMappedPort(3306)

  return {
    type: "datasource_plus",
    source: SourceName.MYSQL,
    plus: true,
    config: {
      host,
      port,
      user: "root",
      password: "password",
      database: "mysql",
    },
  }
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
