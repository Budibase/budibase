import { generator, testContainerUtils } from "@budibase/backend-core/tests"
import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { startContainer } from "."
import { ARANGODB_IMAGE } from "./images"

import { Database } from "arangojs"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(ARANGODB_IMAGE)
        .withExposedPorts(8529)
        .withEnvironment({
          ARANGO_ROOT_PASSWORD: "arango",
        })
        .withWaitStrategy(
          Wait.forSuccessfulCommand(
            `arangosh --server.password arango --javascript.execute-string "db._version()"`
          ).withStartupTimeout(20000)
        )
    )
  }

  const port = (await ports).find(x => x.container === 8529)
  if (!port) {
    throw new Error("ArangoDB port not found")
  }

  const databaseName = `a${generator.guid().replaceAll("-", "")}`
  const client = new Database({
    url: `http://127.0.0.1:${port.host}`,
    auth: {
      username: "root",
      password: "arango",
    },
  })

  await client.createDatabase(databaseName)
  await client.database(databaseName).createCollection("test")

  return {
    type: "datasource",
    source: SourceName.ARANGODB,
    plus: false,
    config: {
      url: `http://127.0.0.1:${port.host}`,
      username: "root",
      password: "arango",
      databaseName,
      collection: "test",
    },
  }
}
