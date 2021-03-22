#!/usr/bin/env node
const compose = require("docker-compose")
const path = require("path")

// This script wraps docker-compose allowing you to manage your dev infrastructure with simple commands.
const CONFIG = {
  cwd: path.resolve(process.cwd(), "../../hosting"),
  config: "docker-compose.dev.yaml",
  log: true,
}

const Commands = {
  Up: "up",
  Down: "down",
  Nuke: "nuke",
}

async function up() {
  console.log("Spinning up your budibase dev environment... 🔧✨")
  try {
    await compose.upAll(CONFIG)
  } catch (err) {
    console.log("Something went wrong:", err.message)
  }
}

async function down() {
  console.log("Spinning down your budibase dev environment... 🌇")
  try {
    await compose.stop(CONFIG)
  } catch (err) {
    console.log("Something went wrong:", err.message)
  }
}

async function nuke() {
  console.log(
    "Clearing down your budibase dev environment, including all containers and volumes... 💥"
  )
  try {
    await compose.down(CONFIG)
  } catch (err) {
    console.log("Something went wrong:", err.message)
  }
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
  .catch(() => {
    console.log("Error while managing budibase dev environment.")
  })
