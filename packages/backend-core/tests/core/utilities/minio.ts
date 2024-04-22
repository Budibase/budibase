import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import { AbstractWaitStrategy } from "testcontainers/build/wait-strategies/wait-strategy"
import env from "../../../src/environment"

let container: StartedTestContainer | undefined

class ObjectStoreWaitStrategy extends AbstractWaitStrategy {
  async waitUntilReady(container: any, boundPorts: any, startTime?: Date) {
    const logs = Wait.forListeningPorts()
    await logs.waitUntilReady(container, boundPorts, startTime)
  }
}

export async function start(): Promise<void> {
  container = await new GenericContainer("minio/minio")
    .withExposedPorts(9000)
    .withCommand(["server", "/data"])
    .withEnvironment({
      MINIO_ACCESS_KEY: "budibase",
      MINIO_SECRET_KEY: "budibase",
    })
    .withWaitStrategy(new ObjectStoreWaitStrategy().withStartupTimeout(30000))
    .start()

  const port = container.getMappedPort(9000)
  env._set("MINIO_URL", `http://0.0.0.0:${port}`)
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
