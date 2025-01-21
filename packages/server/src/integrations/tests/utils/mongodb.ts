import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { startContainer } from "."
import { MONGODB_IMAGE } from "./images"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(MONGODB_IMAGE)
        .withExposedPorts(27017)
        .withEnvironment({
          MONGO_INITDB_ROOT_USERNAME: "mongo",
          MONGO_INITDB_ROOT_PASSWORD: "password",
        })
        .withWaitStrategy(
          Wait.forSuccessfulCommand(
            `mongosh --eval "db.version()"`
          ).withStartupTimeout(20000)
        )
    )
  }

  const port = (await ports).find(x => x.container === 27017)
  if (!port) {
    throw new Error("MongoDB port not found")
  }

  return {
    type: "datasource",
    source: SourceName.MONGODB,
    plus: false,
    config: {
      connectionString: `mongodb://mongo:password@127.0.0.1:${port.host}`,
      db: generator.guid(),
    },
  }
}
