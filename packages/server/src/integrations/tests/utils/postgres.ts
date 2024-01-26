import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import env from "../../../environment"

let container: StartedTestContainer | undefined

const isMac = process.platform === "darwin"

export async function getDsConfig(): Promise<Datasource> {
  try {
    if (!container) {
      container = await new GenericContainer("postgres", "latest")
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
