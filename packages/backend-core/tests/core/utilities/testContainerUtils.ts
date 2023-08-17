import { execSync } from "child_process"

let dockerPsResult: string | undefined

function formatDockerPsResult(serverName: string, port: number) {
  const lines = dockerPsResult?.split("\n")
  let first = true
  if (!lines) {
    return null
  }
  for (let line of lines) {
    if (first) {
      first = false
      continue
    }
    let toLookFor = serverName.split("-service")[0]
    if (!line.includes(toLookFor)) {
      continue
    }
    const regex = new RegExp(`0.0.0.0:([0-9]*)->${port}`, "g")
    const found = line.match(regex)
    if (found) {
      return found[0].split(":")[1].split("->")[0]
    }
  }
  return null
}

function getTestContainerSettings(
  serverName: string,
  key: string
): string | null {
  const entry = Object.entries(global).find(
    ([k]) =>
      k.includes(`_${serverName.toUpperCase()}`) &&
      k.includes(`_${key.toUpperCase()}__`)
  )
  if (!entry) {
    return null
  }
  return entry[1]
}

function getContainerInfo(containerName: string, port: number) {
  let assignedPort = getTestContainerSettings(
    containerName.toUpperCase(),
    `PORT_${port}`
  )
  if (!dockerPsResult) {
    try {
      const outputBuffer = execSync("docker ps")
      dockerPsResult = outputBuffer.toString("utf8")
    } catch (err) {
      //no-op
    }
  }
  const possiblePort = formatDockerPsResult(containerName, port)
  if (possiblePort) {
    assignedPort = possiblePort
  }
  const host = getTestContainerSettings(containerName.toUpperCase(), "IP")
  return {
    port: assignedPort,
    host,
    url: host && assignedPort && `http://${host}:${assignedPort}`,
  }
}

function getCouchConfig() {
  return getContainerInfo("couchdb-service", 5984)
}

function getMinioConfig() {
  return getContainerInfo("minio-service", 9000)
}

function getRedisConfig() {
  return getContainerInfo("redis-service", 6379)
}

export function setupEnv(...envs: any[]) {
  const couch = getCouchConfig(),
    minio = getCouchConfig(),
    redis = getRedisConfig()
  const configs = [
    { key: "COUCH_DB_PORT", value: couch.port },
    { key: "COUCH_DB_URL", value: couch.url },
    { key: "MINIO_PORT", value: minio.port },
    { key: "MINIO_URL", value: minio.url },
    { key: "REDIS_URL", value: redis.url },
  ]

  for (const config of configs.filter(x => !!x.value)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}
