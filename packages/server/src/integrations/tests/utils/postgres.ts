import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"

export async function getDatasourceConfig(): Promise<Datasource> {
  const containerPostgres = await new GenericContainer("postgres")
    .withExposedPorts(5432)
    .withEnv("POSTGRES_PASSWORD", "password")
    .withWaitStrategy(
      Wait.forLogMessage(
        "PostgreSQL init process complete; ready for start up."
      )
    )
    .start()

  const host = containerPostgres.getContainerIpAddress()
  const port = containerPostgres.getMappedPort(5432)

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
