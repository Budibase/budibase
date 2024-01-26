import { Datasource, SourceName } from "@budibase/types"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"

let container: StartedPostgreSqlContainer | undefined

export async function getDsConfig(): Promise<Datasource> {
  try {
    if (!container) {
      const pgContainer = new PostgreSqlContainer()
      container = await pgContainer
        .withUsername("postgres")
        .withPassword("password")
        .withExposedPorts(5432)
        .start()
    }
    const host = container!.getHost()
    const port = container!.getMappedPort(5432)

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
