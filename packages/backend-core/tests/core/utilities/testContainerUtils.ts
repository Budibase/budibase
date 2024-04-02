import { DatabaseImpl } from "../../../src/db"
import { execSync } from "child_process"

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
  return execSync("docker ps --format json")
    .toString()
    .split("\n")
    .filter(x => x.length > 0)
    .map(x => JSON.parse(x) as ContainerInfo)
    .filter(x => x.Labels.includes("org.testcontainers=true"))
}

function getContainerByImage(image: string) {
  return getTestcontainers().find(x => x.Image.startsWith(image))
}

function getExposedPort(container: ContainerInfo, port: number) {
  const match = container.Ports.match(new RegExp(`0.0.0.0:(\\d+)->${port}/tcp`))
  if (!match) {
    return undefined
  }
  return parseInt(match[1])
}

export function setupEnv(...envs: any[]) {
  const couch = getContainerByImage("budibase/couchdb")
  if (!couch) {
    throw new Error("CouchDB container not found")
  }

  const couchPort = getExposedPort(couch, 5984)
  if (!couchPort) {
    throw new Error("CouchDB port not found")
  }

  const configs = [
    { key: "COUCH_DB_PORT", value: `${couchPort}` },
    { key: "COUCH_DB_URL", value: `http://localhost:${couchPort}` },
  ]

  for (const config of configs.filter(x => !!x.value)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }

  // @ts-expect-error
  DatabaseImpl.nano = undefined
}
