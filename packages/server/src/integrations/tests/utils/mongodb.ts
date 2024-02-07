import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"

let container: StartedTestContainer | undefined

export async function start(): Promise<StartedTestContainer> {
  return await new GenericContainer("mongo:7.0-jammy")
    .withExposedPorts(27017)
    .withEnvironment({
      MONGO_INITDB_ROOT_USERNAME: "mongo",
      MONGO_INITDB_ROOT_PASSWORD: "password",
    })
    .withWaitStrategy(
      Wait.forSuccessfulCommand(`mongosh --eval "db.version()"`)
    )
    .start()
}

export async function datasource(): Promise<Datasource> {
  if (!container) {
    container = await start()
  }
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

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
