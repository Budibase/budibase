#!/usr/bin/env node
const compose = require("docker-compose")
const path = require("path")
const { parsed: existingConfig } = require("dotenv").config()
const updateDotEnv = require("update-dotenv")

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

async function init() {
  let config = {
    PORT: "4001",
    MINIO_URL: "http://localhost:4004",
    COUCH_DB_URL: "http://budibase:budibase@localhost:4005",
    REDIS_URL: "localhost:6379",
    WORKER_URL: "http://localhost:4002",
    INTERNAL_API_KEY: "budibase",
    ACCOUNT_PORTAL_URL: "http://localhost:10001",
    ACCOUNT_PORTAL_API_KEY: "budibase",
    PLATFORM_URL: "http://localhost:10000",
    JWT_SECRET: "testsecret",
    ENCRYPTION_KEY: "testsecret",
    REDIS_PASSWORD: "budibase",
    MINIO_ACCESS_KEY: "budibase",
    MINIO_SECRET_KEY: "budibase",
    COUCH_DB_PASSWORD: "budibase",
    COUCH_DB_USER: "budibase",
    SELF_HOSTED: "1",
    DISABLE_ACCOUNT_PORTAL: "1",
    MULTI_TENANCY: "",
    SERVICE: "app-service",
    DEPLOYMENT_ENVIRONMENT: "development",
    BB_ADMIN_USER_EMAIL: "",
    BB_ADMIN_USER_PASSWORD: "",
    PLUGINS_DIR: "",
    HTTP_MIGRATIONS: "0",
    HTTP_LOGGING: "0",
    VERSION: "0.0.0+local",
    PASSWORD_MIN_LENGTH: "1",
  }

  config = { ...config, ...existingConfig }

  await updateDotEnv(config)
}

async function up() {
  console.log("Spinning up your budibase dev environment... 🔧✨")
  await init()
  await compose.upAll(CONFIG)

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
