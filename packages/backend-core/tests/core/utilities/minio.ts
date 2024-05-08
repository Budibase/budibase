import { GenericContainer, Wait, StartedTestContainer } from "testcontainers"
import env from "../../../src/environment"
import { testContainerUtils } from "."

let container: StartedTestContainer | undefined

export async function start(): Promise<void> {
  container = await new GenericContainer("minio/minio")
    .withExposedPorts(9000)
    .withCommand(["server", "/data"])
    .withEnvironment({
      MINIO_ACCESS_KEY: "budibase",
      MINIO_SECRET_KEY: "budibase",
    })
    .withLabels({ "com.budibase": "true" })
    .withWaitStrategy(
      Wait.forHttp("/minio/health/ready", 9000).withStartupTimeout(10000)
    )
    .start()

  const info = testContainerUtils.getContainerById(container.getId())
  if (!info) {
    throw new Error("Container not found")
  }

  const ports = testContainerUtils.getExposedV4Ports(info)
  const port = ports.find(x => x.container === 9000)?.host
  if (!port) {
    throw new Error("Couldn't find a mapping for minio port 9000")
  }

  env._set("MINIO_URL", `http://127.0.0.1:${port}`)
}

export async function stop() {
  if (container) {
    await container.stop()
    container = undefined
  }
}
