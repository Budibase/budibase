import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"

export async function mongodb(): Promise<Datasource> {
  const container = await new GenericContainer("mongo:7.0-jammy")
    .withName("budibase-test-mongodb")
    .withReuse()
    .withExposedPorts(27017)
    .withEnvironment({
      MONGO_INITDB_ROOT_USERNAME: "mongo",
      MONGO_INITDB_ROOT_PASSWORD: "password",
    })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        `mongosh --eval "db.version()"`
      ).withStartupTimeout(10000)
    )
    .start()

  const host = container.getHost()
  const port = container.getMappedPort(27017)

  return {
    type: "datasource",
    source: SourceName.MONGODB,
    plus: false,
    config: {
      connectionString: `mongodb://mongo:password@${host}:${port}`,
      db: "mongo",
    },
  }
}
