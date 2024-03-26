import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"

export async function postgres(): Promise<Datasource> {
  const container = await new GenericContainer("postgres:16.1-bullseye")
    .withName("budibase-test-postgres")
    .withReuse()
    .withExposedPorts(5432)
    .withEnvironment({ POSTGRES_PASSWORD: "password" })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        "pg_isready -h localhost -p 5432"
      ).withStartupTimeout(10000)
    )
    .start()
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
