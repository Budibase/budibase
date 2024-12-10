#!/usr/bin/env node

const os = require("os")
const exec = require("child_process").exec
const platform = os.platform()

const windows = platform === "win32"
const mac = platform === "darwin"
const linux = platform === "linux"

function execute(command) {
  return new Promise(resolve => {
    exec(command, (err, stdout) => resolve(linux ? !!stdout : true))
  })
}

async function commandExistsUnix(command) {
  const unixCmd = `command -v ${command} 2>/dev/null && { echo >&1 ${command}; exit 0; }`
  return execute(unixCmd)
}

async function commandExistsWindows(command) {
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f<>:"|?*]/.test(command)) {
    return false
  }
  return execute(`where ${command}`)
}

function commandExists(command) {
  return windows ? commandExistsWindows(command) : commandExistsUnix(command)
}

async function init() {
  const docker = commandExists("docker")
  const dockerCompose = commandExists("docker-compose")
  if (docker && dockerCompose) {
    console.log("Docker installed - continuing.")
    return
  }
  if (mac) {
    console.log(
      "Please install docker by visiting: https://docs.docker.com/docker-for-mac/install/"
    )
  } else if (windows) {
    console.log(
      "Please install docker by visiting: https://docs.docker.com/docker-for-windows/install/"
    )
  } else if (linux) {
    console.log("Beginning automated linux installation.")
    await execute(`./hosting/scripts/linux/get-docker.sh`)
    await execute(`./hosting/scripts/linux/get-docker-compose.sh`)
  } else {
    console.error(
      "Platform unknown - please look online for information about installing docker for our OS."
    )
  }
  console.log("Once installation complete please re-run the setup script.")
  process.exit(-1)
}
init()
