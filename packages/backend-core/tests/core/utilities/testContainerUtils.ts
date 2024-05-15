import { execSync } from "child_process"

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
  return execSync("docker ps --format json --no-trunc")
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

export function setupEnv(...envs: any[]) {
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
