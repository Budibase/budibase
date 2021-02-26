const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
const { lookpath } = require("lookpath")
const { downloadFile, logErrorToFile } = require("../utils")
const { confirmation } = require("../questions")
const fs = require("fs")
const compose = require("docker-compose")
const envFile = require("./makeEnv")
const chalk = require("chalk")

const BUDIBASE_SERVICES = ["app-service", "worker-service"]
const ERROR_FILE = "docker-error.log"
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

function checkInitComplete() {
  if (!fs.existsSync(envFile.filePath)) {
    throw "Please run the hosting --init command before any other hosting command."
  }
}

async function handleError(func) {
  try {
    await func()
  } catch (err) {
    if (err && err.err) {
      logErrorToFile(ERROR_FILE, err.err)
    }
    throw `Failed to start - logs written to file: ${ERROR_FILE}`
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
  await envFile.make()
}

async function start() {
  await checkDockerConfigured()
  checkInitComplete()
  const port = envFile.get("MAIN_PORT")
  await handleError(async () => {
    await compose.upAll({cwd: "./", log: false})
  })
  console.log(chalk.green(`Services started, please go to http://localhost:${port} for next steps.`))
}

async function status() {
  await checkDockerConfigured()
  checkInitComplete()
  await handleError(async () => {
    const response = await compose.ps()
    console.log(response.out)
  })
}

async function stop() {
  await checkDockerConfigured()
  checkInitComplete()
  await handleError(async () => {
    await compose.stop()
  })
}

async function update() {
  await checkDockerConfigured()
  checkInitComplete()
  await handleError(async () => {
    const status = await compose.ps()
    const parts = status.out.split("\n")
    const isUp = parts[2] && parts[2].indexOf("Up") !== -1
    await compose.stop()
    console.log(chalk.cyan("Beginning update, this may take a few minutes."))
    await compose.pullMany(BUDIBASE_SERVICES, {log: true})
    if (isUp) {
      console.log(chalk.green("Update complete, restarting services..."))
      await start()
    }
  })
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
    "--status",
    "Check the status of currently running services.",
    status
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
