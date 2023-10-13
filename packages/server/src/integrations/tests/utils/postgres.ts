import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function getDsConfig(): Promise<Datasource> {
  if (!container) {
    container = await new GenericContainer("postgres")
      .withExposedPorts(5432)
      .withEnv("POSTGRES_PASSWORD", "password")
      .withWaitStrategy(
        Wait.forLogMessage(
          "PostgreSQL init process complete; ready for start up."
        )
      )
      .start()
  }

  const host = container.getContainerIpAddress()
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

export async function stopContainer() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
