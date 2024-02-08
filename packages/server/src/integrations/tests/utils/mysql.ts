import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function start(): Promise<StartedTestContainer> {
  return await new GenericContainer("mysql:8.3")
    .withExposedPorts(3306)
    .withEnvironment({ MYSQL_ROOT_PASSWORD: "password" })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        // Because MySQL first starts itself up, runs an init script, then restarts,
        // it's possible for the mysqladmin ping to succeed early and then tests to
        // run against a MySQL that's mid-restart and fail. To avoid this, we run
        // the ping command three times with a small delay between each.
        `
          mysqladmin ping -h localhost -P 3306 -u root -ppassword && sleep 0.5 &&
          mysqladmin ping -h localhost -P 3306 -u root -ppassword && sleep 0.5 &&
          mysqladmin ping -h localhost -P 3306 -u root -ppassword
        `
      )
    )
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
