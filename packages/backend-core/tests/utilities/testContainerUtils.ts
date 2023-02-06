function getTestContainerSettings(serverName: string, key: string) {
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
    url: `http://${host}:${assignedPort}`,
  }
}

function getCouchConfig() {
  return getContainerInfo("couchdb-service", 5984)
}

function getMinioConfig() {
  return getContainerInfo("minio-service", 9000)
}

function getPostgresConfig() {
  return getContainerInfo("postgres", 5432)
}

export function setupEnv(...envs: any[]) {
  const configs = [
    { key: "COUCH_DB_PORT", value: getCouchConfig().port },
    { key: "COUCH_DB_URL", value: getCouchConfig().url },
    { key: "MINIO_PORT", value: getMinioConfig().port },
    { key: "MINIO_URL", value: getMinioConfig().url },
    { key: "POSTGRES_HOST", value: getPostgresConfig().host },
    { key: "POSTGRES_PORT", value: getPostgresConfig().port },
  ]

  for (const config of configs.filter(x => x.value !== null)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}
