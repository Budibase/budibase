import { Datasource } from "@budibase/types"
import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import { AbstractWaitStrategy } from "testcontainers/build/wait-strategies/wait-strategy"

let container: StartedTestContainer | undefined

class LocalstackS3WaitStrategy extends AbstractWaitStrategy {
  async waitUntilReady(container: any, boundPorts: any, startTime?: Date) {
    const logs = Wait.forLogMessage("Ready.", 1)
    await logs.waitUntilReady(container, boundPorts, startTime)

    const command = Wait.forSuccessfulCommand(
      `aws --endpoint-url=http://localhost:4566 s3 ls`
    )
    await command.waitUntilReady(container)
  }
}

export async function start(): Promise<StartedTestContainer> {
  container = await new GenericContainer("localstack/localstack")
    .withExposedPorts(9000)
    .withEnvironment({
      SERVICES: "s3",
      DEFAULT_REGION: "eu-west-1",
      AWS_ACCESS_KEY_ID: "testkey",
      AWS_SECRET_ACCESS_KEY: "testsecret",
    })
    .withWaitStrategy(new LocalstackS3WaitStrategy().withStartupTimeout(30000))
    .start()

  return container
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
