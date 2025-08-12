import { execSync } from "child_process"
import { cloneDeep } from "lodash"
import { GenericContainer, StartedTestContainer } from "testcontainers"

const IPV4_PORT_REGEX = new RegExp(`0\\.0\\.0\\.0:(\\d+)->(\\d+)/tcp`, "g")

interface ContainerInfo {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  LocalVolumes: string
  Mounts: string
  Names: string
  Networks: string
  Ports: string
  RunningFor: string
  Size: string
  State: string
  Status: string
}

function getTestcontainers(): ContainerInfo[] {
  // We use --format json to make sure the output is nice and machine-readable,
  // and we use --no-trunc so that the command returns full container IDs so we
  // can filter on them correctly.
  return execSync("docker ps --all --format json --no-trunc")
    .toString()
    .split("\n")
    .filter(x => x.length > 0)
    .map(x => JSON.parse(x) as ContainerInfo)
    .filter(
      x =>
        x.Labels.includes("org.testcontainers=true") &&
        x.Labels.includes("com.budibase=true")
    )
}

export function getContainerByImage(image: string) {
  const containers = getTestcontainers().filter(x => x.Image.startsWith(image))
  if (containers.length > 1) {
    let errorMessage = `Multiple containers found starting with image: "${image}"\n\n`
    for (const container of containers) {
      errorMessage += JSON.stringify(container, null, 2)
    }
    throw new Error(errorMessage)
  }
  return containers[0]
}

export function getContainerById(id: string) {
  return getTestcontainers().find(x => x.ID === id)
}

export interface Port {
  host: number
  container: number
}

export function getExposedV4Ports(container: ContainerInfo): Port[] {
  let ports: Port[] = []
  for (const match of container.Ports.matchAll(IPV4_PORT_REGEX)) {
    ports.push({ host: parseInt(match[1]), container: parseInt(match[2]) })
  }
  return ports
}

export function getExposedV4Port(container: ContainerInfo, port: number) {
  return getExposedV4Ports(container).find(x => x.container === port)?.host
}

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

export function setupEnv(...envs: any[]) {
  process.env.TESTCONTAINERS_RYUK_DISABLED = "true"

  // For whatever reason, testcontainers doesn't always use the correct current
  // docker context. This bit of code forces the issue by finding the current
  // context and setting it as the DOCKER_HOST environment
  if (!process.env.DOCKER_HOST) {
    const dockerContext = getCurrentDockerContext()
    process.env.DOCKER_HOST = dockerContext.DockerEndpoint
  }

  // We start couchdb in globalSetup.ts, in the root of the monorepo, so it
  // should be relatively safe to look for it by its image name.
  const couch = getContainerByImage("budibase/couchdb")
  if (!couch) {
    throw new Error("CouchDB container not found")
  }

  const couchPort = getExposedV4Port(couch, 5984)
  if (!couchPort) {
    throw new Error("CouchDB port not found")
  }

  const couchSqlPort = getExposedV4Port(couch, 4984)
  if (!couchSqlPort) {
    throw new Error("CouchDB SQL port not found")
  }

  const minio = getContainerByImage("minio/minio")

  const minioPort = getExposedV4Port(minio, 9000)
  if (!minioPort) {
    throw new Error("Minio port not found")
  }

  const configs = [
    { key: "COUCH_DB_PORT", value: `${couchPort}` },
    { key: "COUCH_DB_URL", value: `http://127.0.0.1:${couchPort}` },
    { key: "COUCH_DB_SQL_URL", value: `http://127.0.0.1:${couchSqlPort}` },
    { key: "MINIO_URL", value: `http://127.0.0.1:${minioPort}` },
  ]

  for (const config of configs.filter(x => !!x.value)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}

export async function startContainer(container: GenericContainer) {
  const imageName = (container as any).imageName.string as string
  let key: string = imageName
  if (imageName.includes("@sha256")) {
    key = imageName.split("@")[0]
  }
  key = key.replace(/\//g, "-").replace(/:/g, "-")
  const name = `${key}_testcontainer`

  container = container
    .withReuse()
    .withLabels({ "com.budibase": "true" })
    .withName(name)

  let startedContainer: StartedTestContainer | undefined = undefined
  let lastError = undefined
  for (let i = 0; i < 10; i++) {
    try {
      // container.start() is not an idempotent operation, calling `start`
      // modifies the internal state of a GenericContainer instance such that
      // the hash it uses to determine reuse changes. We need to clone the
      // container before calling start to ensure that we're using the same
      // reuse hash every time.
      const containerCopy = cloneDeep(container)
      startedContainer = await containerCopy.start()
      lastError = undefined
      break
    } catch (e: any) {
      lastError = e
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  if (!startedContainer) {
    if (lastError) {
      throw lastError
    }
    throw new Error(`failed to start container: ${imageName}`)
  }

  const info = getContainerById(startedContainer.getId())
  if (!info) {
    throw new Error("Container not found")
  }

  // Some Docker runtimes, when you expose a port, will bind it to both
  // 127.0.0.1 and ::1, so ipv4 and ipv6. The port spaces of ipv4 and ipv6
  // addresses are not shared, and testcontainers will sometimes give you back
  // the ipv6 port. There's no way to know that this has happened, and if you
  // try to then connect to `localhost:port` you may attempt to bind to the v4
  // address which could be unbound or even an entirely different container. For
  // that reason, we don't use testcontainers' `getExposedPort` function,
  // preferring instead our own method that guaranteed v4 ports.
  return getExposedV4Ports(info)
}
