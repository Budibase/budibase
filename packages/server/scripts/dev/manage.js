#!/usr/bin/env node
const compose = require("docker-compose")
const path = require("path")

// This script wraps docker-compose allowing you to manage your dev infrastructure with simple commands.
const CONFIG = {
  cwd: path.resolve(process.cwd(), "../../hosting"),
  config: "docker-compose.dev.yaml",
  log: true,
}

const CORE_SERVICES = [
  "minio-service",
  "proxy-service",
  "couchdb-service",
  "redis-service",
]
const NON_CORE_SERVICES = ["litellm-service", "litellm-db"]

const Commands = {
  Up: "up",
  Down: "down",
  Nuke: "nuke",
}

async function up() {
  console.log("Spinning up your budibase dev environment... 🔧✨")

  if (process.env.BUDIBASE_DEV_STACK === "core") {
    await compose.stopMany(CONFIG, ...NON_CORE_SERVICES)
    await compose.upMany(CORE_SERVICES, CONFIG)
  } else {
    await compose.upAll(CONFIG)
  }

  // We always ensure to restart the proxy service in case of nginx conf changes
  await compose.restartOne("proxy-service", CONFIG)
}

async function down() {
  console.log("Spinning down your budibase dev environment... 🌇")
  await compose.stop(CONFIG)
}

async function nuke() {
  console.log(
    "Clearing down your budibase dev environment, including all containers and volumes... 💥"
  )
  await compose.down({
    ...CONFIG,
    // stop containers, delete volumes
    commandOptions: ["-v", "--remove-orphans"],
  })
}

const managementCommand = process.argv.slice(2)[0]

if (
  !managementCommand ||
  !Object.values(Commands).some(command => managementCommand === command)
) {
  throw new Error(
    "You must supply either an 'up', 'down' or 'nuke' commmand to manage the budibase development environment."
  )
}

let command
switch (managementCommand) {
  case Commands.Up:
    command = up
    break
  case Commands.Down:
    command = down
    break
  case Commands.Nuke:
    command = nuke
    break
  default:
    command = up
}

command()
  .then(() => {
    console.log("Done! 🎉")
  })
  .catch(err => {
    console.error(
      "Something went wrong while managing budibase dev environment:",
      err.message
    )
  })
