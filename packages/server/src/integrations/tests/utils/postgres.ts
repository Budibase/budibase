import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function start(): Promise<StartedTestContainer> {
  return await new GenericContainer("postgres:16.1-bullseye")
    .withExposedPorts(5432)
    .withEnvironment({ POSTGRES_PASSWORD: "password" })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        "pg_isready -h localhost -p 5432"
      ).withStartupTimeout(10000)
    )
    .start()
}

export async function datasource(): Promise<Datasource> {
  if (!container) {
    container = await start()
  }
  const host = container.getHost()
  const port = container.getMappedPort(5432)

  return {
    type: "datasource_plus",
    source: SourceName.POSTGRES,
    plus: true,
    config: {
      host,
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
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
