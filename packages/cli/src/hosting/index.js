const Command = require("../structures/Command")
const { CommandWords, InitTypes, AnalyticsEvents } = require("../constants")
const { lookpath } = require("lookpath")
const {
  downloadFile,
  logErrorToFile,
  success,
  info,
  parseEnv,
} = require("../utils")
const { confirmation } = require("../questions")
const fs = require("fs")
const compose = require("docker-compose")
const makeEnv = require("./makeEnv")
const axios = require("axios")
const AnalyticsClient = require("../analytics/Client")

const BUDIBASE_SERVICES = ["app-service", "worker-service"]
const ERROR_FILE = "docker-error.log"
const FILE_URLS = [
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/docker-compose.yaml",
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/envoy.yaml",
]
const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data"

const client = new AnalyticsClient()

async function downloadFiles() {
  const promises = []
  for (let url of FILE_URLS) {
    const fileName = url.split("/").slice(-1)[0]
    promises.push(downloadFile(url, `./${fileName}`))
  }
  await Promise.all(promises)
}

async function checkDockerConfigured() {
  const error =
    "docker/docker-compose has not been installed, please follow instructions at: https://docs.budibase.com/self-hosting/hosting-methods/docker-compose#installing-docker"
  const docker = await lookpath("docker")
  const compose = await lookpath("docker-compose")
  if (!docker || !compose) {
    throw error
  }
}

function checkInitComplete() {
  if (!fs.existsSync(makeEnv.filePath)) {
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

async function init(type) {
  const isQuick = type === InitTypes.QUICK || type === InitTypes.DIGITAL_OCEAN
  await checkDockerConfigured()
  if (!isQuick) {
    const shouldContinue = await confirmation(
      "This will create multiple files in current directory, should continue?"
    )
    if (!shouldContinue) {
      console.log("Stopping.")
      return
    }
  }
  client.capture({
    event: AnalyticsEvents.SelfHostInit,
    properties: {
      type
    }
  })
  await downloadFiles()
  const config = isQuick ? makeEnv.QUICK_CONFIG : {}
  if (type === InitTypes.DIGITAL_OCEAN) {
    try {
      const output = await axios.get(DO_USER_DATA_URL)
      const response = parseEnv(output.data)
      for (let [key, value] of Object.entries(makeEnv.ConfigMap)) {
        if (response[key]) {
          config[value] = response[key]
        }
      }
    } catch (err) {
      // don't need to handle error, just don't do anything
    }
  }
  await makeEnv.make(config)
}

async function start() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Starting services, this may take a moment."))
  const port = makeEnv.get("MAIN_PORT")
  await handleError(async () => {
    await compose.upAll({ cwd: "./", log: false })
  })
  console.log(
    success(
      `Services started, please go to http://localhost:${port} for next steps.`
    )
  )
}

async function status() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Budibase status"))
  await handleError(async () => {
    const response = await compose.ps()
    console.log(response.out)
  })
}

async function stop() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Stopping services, this may take a moment."))
  await handleError(async () => {
    await compose.stop()
  })
  console.log(success("Services have been stopped successfully."))
}

async function update() {
  await checkDockerConfigured()
  checkInitComplete()
  if (
    await confirmation(
      "Do you wish to update you docker-compose.yaml and envoy.yaml?"
    )
  ) {
    await downloadFiles()
  }
  await handleError(async () => {
    const status = await compose.ps()
    const parts = status.out.split("\n")
    const isUp = parts[2] && parts[2].indexOf("Up") !== -1
    if (isUp) {
      console.log(info("Stopping services, this may take a moment."))
      await compose.stop()
    }
    console.log(info("Beginning update, this may take a few minutes."))
    await compose.pullMany(BUDIBASE_SERVICES, { log: true })
    if (isUp) {
      console.log(success("Update complete, restarting services..."))
      await start()
    }
  })
}

const command = new Command(`${CommandWords.HOSTING}`)
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption(
    "--init [type]",
    "Configure a self hosted platform in current directory, type can be unspecified or 'quick'.",
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
    "Update the Budibase images to the latest version.",
    update
  )

exports.command = command
