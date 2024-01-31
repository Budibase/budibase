import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function getDsConfig(): Promise<Datasource> {
  try {
    if (!container) {
      container = await new GenericContainer("postgres:16.1-bullseye")
        .withExposedPorts(5432)
        .withEnvironment({ POSTGRES_PASSWORD: "password" })
        .withWaitStrategy(
          Wait.forLogMessage(
            "database system is ready to accept connections",
            2
          )
        )
        .start()
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
  } catch (err) {
    throw new Error("**UNABLE TO CREATE TO POSTGRES CONTAINER**")
  }
}

export async function stopContainer() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
