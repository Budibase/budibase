import { Datasource, SourceName } from "@budibase/types"
import { GenericContainer, Wait } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import { startContainer } from "."
import { DYNAMODB_IMAGE } from "./images"
import { DynamoDBConfig } from "../../dynamodb"

let ports: Promise<testContainerUtils.Port[]>

export async function getDatasource(): Promise<Datasource> {
  if (!ports) {
    ports = startContainer(
      new GenericContainer(DYNAMODB_IMAGE)
        .withExposedPorts(8000)
        .withWaitStrategy(
          Wait.forSuccessfulCommand(
            // https://stackoverflow.com/a/77373799
            `if [ "$(curl -s -o /dev/null -I -w ''%{http_code}'' http://localhost:8000)" == "400" ]; then exit 0; else exit 1; fi`
          ).withStartupTimeout(60000)
        )
    )
  }

  const port = (await ports).find(x => x.container === 8000)?.host
  if (!port) {
    throw new Error("DynamoDB port not found")
  }

  const config: DynamoDBConfig = {
    accessKeyId: "test",
    secretAccessKey: "test",
    region: "us-east-1",
    endpoint: `http://127.0.0.1:${port}`,
  }

  return {
    type: "datasource",
    source: SourceName.DYNAMODB,
    config,
  }
}
