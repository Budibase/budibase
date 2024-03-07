import { execSync } from "child_process"

function getMappedPort(serverName: string, port: number) {
  const outputBuffer = execSync("docker ps")
  const dockerPsResult = outputBuffer.toString("utf8")

  const lines = dockerPsResult?.split("\n")
  let first = true
  if (!lines) {
    return undefined
  }
  for (let line of lines) {
    if (first) {
      first = false
      continue
    }
    let toLookFor = serverName.split("-service")[0]
    if (toLookFor && !line.includes(toLookFor)) {
      continue
    }
    const regex = new RegExp(`0.0.0.0:([0-9]*)->${port}`, "g")
    const found = line.match(regex)
    if (found && found[0]) {
      const port = found[0].split(":")[1]
      if (port) {
        return port.split("->")[0]
      }
    }
  }
  return undefined
}

function getTestContainerSettings(
  serverName: string,
  key: string
): string | null {
  const entry = Object.entries(global).find(
    ([k]) =>
      k.includes(`${serverName.toUpperCase()}`) &&
      k.includes(`${key.toUpperCase()}`)
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
  const possiblePort = getMappedPort(containerName, port)
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
  return getContainerInfo("couchdb", 5984)
}

export function setupEnv(...envs: any[]) {
  const couch = getCouchConfig()
  const configs = [
    { key: "COUCH_DB_PORT", value: couch.port },
    { key: "COUCH_DB_URL", value: couch.url },
  ]

  for (const config of configs.filter(x => !!x.value)) {
    for (const env of envs) {
      env._set(config.key, config.value)
    }
  }
}
