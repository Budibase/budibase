import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"

export async function getDatasource(): Promise<Datasource> {
  let container = new GenericContainer("mongo:7.0-jammy")
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

  if (process.env.REUSE_CONTAINERS) {
    container = container.withReuse()
  }

  const startedContainer = await container.start()

  const host = startedContainer.getHost()
  const port = startedContainer.getMappedPort(27017)

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
