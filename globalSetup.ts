import {
  GenericContainer,
  Wait,
  getContainerRuntimeClient,
} from "testcontainers"
import { ContainerInfo } from "dockerode"
import * as path from "path"
import * as lockfile from "proper-lockfile"
import { execSync } from "child_process"

interface DockerContext {
  Name: string
  Description: string
  DockerEndpoint: string
  ContextType: string
  Error: string
}

function getCurrentDockerContext(): DockerContext {
  const out = execSync("docker context ls --format json")
  for (const line of out.toString().split("\n")) {
    const parsed = JSON.parse(line)
    if (parsed.Current) {
      return parsed as DockerContext
    }
  }
  throw new Error("No current Docker context")
}

async function getBudibaseContainers() {
  const client = await getContainerRuntimeClient()
  const containers = await client.container.list()
  return containers.filter(
    container =>
      container.Labels["com.budibase"] === "true" &&
      container.Labels["org.testcontainers"] === "true"
  )
}

async function killContainers(containers: ContainerInfo[]) {
  const client = await getContainerRuntimeClient()
  for (const container of containers) {
    const c = client.container.getById(container.Id)
    await c.kill()
    await c.remove()
  }
}

export default async function setup() {
  process.env.TESTCONTAINERS_RYUK_DISABLED = "true"

  // For whatever reason, testcontainers doesn't always use the correct current
  // docker context. This bit of code forces the issue by finding the current
  // context and setting it as the DOCKER_HOST environment
  if (!process.env.DOCKER_HOST) {
    const dockerContext = getCurrentDockerContext()
    process.env.DOCKER_HOST = dockerContext.DockerEndpoint
  }

  const lockPath = path.resolve(__dirname, "globalSetup.ts")
  // If you run multiple tests at the same time, it's possible for the CouchDB
  // shared container to get started multiple times despite having an
  // identical reuse hash. To avoid that, we do a filesystem-based lock so
  // that only one globalSetup.ts is running at a time.
  lockfile.lockSync(lockPath)

  // Remove any containers that are older than 24 hours. This is to prevent
  // containers getting full volumes or accruing any other problems from being
  // left up for very long periods of time.
  const threshold = new Date(Date.now() - 1000 * 60 * 60 * 24)
  const containers = (await getBudibaseContainers()).filter(container => {
    const created = new Date(container.Created * 1000)
    return created < threshold
  })

  await killContainers(containers)

  try {
    const couchdb = new GenericContainer("budibase/couchdb:v3.3.3-sqs-v2.1.1")
      .withName("couchdb_testcontainer")
      .withExposedPorts(5984, 4984)
      .withEnvironment({
        COUCHDB_PASSWORD: "budibase",
        COUCHDB_USER: "budibase",
      })
      .withCopyContentToContainer([
        {
          content: `
          [log]
          level = warn
        `,
          target: "/opt/couchdb/etc/local.d/test-couchdb.ini",
        },
      ])
      .withLabels({ "com.budibase": "true" })
      .withTmpFs({ "/data": "rw" })
      .withReuse()
      .withWaitStrategy(
        Wait.forSuccessfulCommand(
          "curl http://budibase:budibase@localhost:5984/_up"
        ).withStartupTimeout(20000)
      )

    const minio = new GenericContainer("minio/minio")
      .withName("minio_testcontainer")
      .withExposedPorts(9000)
      .withCommand(["server", "/data"])
      .withTmpFs({ "/data": "rw" })
      .withEnvironment({
        MINIO_ACCESS_KEY: "budibase",
        MINIO_SECRET_KEY: "budibase",
      })
      .withLabels({ "com.budibase": "true" })
      .withReuse()
      .withWaitStrategy(
        Wait.forHttp("/minio/health/ready", 9000).withStartupTimeout(10000)
      )

    await Promise.all([couchdb.start(), minio.start()])
  } finally {
    lockfile.unlockSync(lockPath)
  }
}
