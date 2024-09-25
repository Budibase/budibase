import {
  GenericContainer,
  Wait,
  getContainerRuntimeClient,
} from "testcontainers"
import { ContainerInfo } from "dockerode"
import path from "path"
import lockfile from "proper-lockfile"

async function getBudibaseContainers() {
  const client = await getContainerRuntimeClient()
  const conatiners = await client.container.list()
  return conatiners.filter(
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
      .withReuse()
      .withWaitStrategy(
        Wait.forSuccessfulCommand(
          "curl http://budibase:budibase@localhost:5984/_up"
        ).withStartupTimeout(20000)
      )

    const minio = new GenericContainer("minio/minio")
      .withExposedPorts(9000)
      .withCommand(["server", "/data"])
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
