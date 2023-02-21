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
  const assignedPort = getTestContainerSettings(
    containerName.toUpperCase(),
    `PORT_${port}`
  )
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
  const configs = [
    { key: "COUCH_DB_PORT", value: getCouchConfig().port },
    { key: "COUCH_DB_URL", value: getCouchConfig().url },
    { key: "MINIO_PORT", value: getMinioConfig().port },
    { key: "MINIO_URL", value: getMinioConfig().url },
    { key: "REDIS_URL", value: getRedisConfig().url },
  ]

  for (const config of configs.filter(x => !!x.value)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}
