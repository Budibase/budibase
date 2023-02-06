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

function getCouchConfig() {
  const port = getTestContainerSettings("COUCHDB-SERVICE", "PORT_5984")
  return {
    port,
    url: `http://${getTestContainerSettings("COUCHDB-SERVICE", "IP")}:${port}`,
  }
}

function getMinioConfig() {
  const port = getTestContainerSettings("MINIO-SERVICE", "PORT_9000")
  return {
    port,
    url: `http://${getTestContainerSettings("MINIO-SERVICE", "IP")}:${port}`,
  }
}

export function setupEnv(...envs: any[]) {
  const configs = [
    { key: "COUCH_DB_PORT", value: getCouchConfig().port },
    { key: "COUCH_DB_URL", value: getCouchConfig().url },
    { key: "MINIO_PORT", value: getMinioConfig().port },
    { key: "MINIO_URL", value: getMinioConfig().url },
  ]

  for (const config of configs.filter(x => x.value !== null)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}
