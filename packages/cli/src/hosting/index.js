const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
const { spawn } = require("child_process")
const { lookpath } = require("lookpath")
const { downloadFile } = require("../utils")
const { confirmation } = require("../questions")
const makeEnvFile = require("./makeEnv")

const FILE_URLS = [
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/docker-compose.yaml",
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/envoy.yaml"
]

async function checkDockerConfigured() {
  const error = "docker/docker-compose has not been installed, please follow instructions at: https://docs.budibase.com/self-hosting/hosting-methods/docker-compose#installing-docker"
  const docker = await lookpath("docker")
  const compose = await lookpath("docker-compose")
  if (!docker || !compose) {
    throw error
  }
}

async function init() {
  await checkDockerConfigured()
  const shouldContinue = await confirmation("This will create multiple files in current directory, should continue?")
  if (!shouldContinue) {
    console.log("Stopping.")
    return
  }
  const promises = []
  for (let url of FILE_URLS) {
    const fileName = url.split("/").slice(-1)[0]
    promises.push(downloadFile(url, `./${fileName}`))
  }
  await Promise.all(promises)
  await makeEnvFile()
}

async function start() {
  console.log("START")
}

async function stop() {
  console.log("STOP")
}

async function update() {
  console.log("UPDATE")
}

const command = new Command(`${CommandWords.HOSTING}`)
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption(
    "--init",
    "Configure a self hosted platform in current directory.",
    init
  )
  .addSubOption(
    "--start",
    "Start the configured platform in current directory.",
    start
  )
  .addSubOption(
    "--stop",
    "Stop the configured platform in the current directory.",
    stop
  )
  .addSubOption(
    "--update",
    "Updates the Budibase images to the latest version.",
    update
  )

exports.command = command
