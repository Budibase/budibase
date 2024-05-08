import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import env from "../../../src/environment"

let container: StartedTestContainer | undefined

export async function start(): Promise<void> {
  container = await new GenericContainer("minio/minio")
    .withExposedPorts(9000)
    .withCommand(["server", "/data"])
    .withEnvironment({
      MINIO_ACCESS_KEY: "budibase",
      MINIO_SECRET_KEY: "budibase",
    })
    .withWaitStrategy(
      Wait.forHttp("/minio/health/ready", 9000).withStartupTimeout(10000)
    )
    .start()

  const port = container.getMappedPort(9000)
  env._set("MINIO_URL", `http://127.0.0.1:${port}`)
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
