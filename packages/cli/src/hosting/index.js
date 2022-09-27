const Command = require("../structures/Command")
const { CommandWords, InitTypes, AnalyticsEvents } = require("../constants")
const { lookpath } = require("lookpath")
const { resolve } = require("path")
const {
  downloadFile,
  logErrorToFile,
  success,
  info,
  error,
  parseEnv,
} = require("../utils")
const { confirmation } = require("../questions")
const fs = require("fs")
const compose = require("docker-compose")
const makeFiles = require("./makeFiles")
const axios = require("axios")
const { captureEvent } = require("../events")
const yaml = require("yaml")

const BUDIBASE_SERVICES = ["app-service", "worker-service", "proxy-service"]
const ERROR_FILE = "docker-error.log"
const FILE_URLS = [
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/docker-compose.yaml",
]
const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data"

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
    "docker/docker-compose has not been installed, please follow instructions at: https://docs.budibase.com/docs/docker-compose"
  const docker = await lookpath("docker")
  const compose = await lookpath("docker-compose")
  if (!docker || !compose) {
    throw error
  }
}

function checkInitComplete() {
  if (!fs.existsSync(makeFiles.filePath)) {
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
  captureEvent(AnalyticsEvents.SelfHostInit, {
    type,
  })
  await downloadFiles()
  const config = isQuick ? makeFiles.QUICK_CONFIG : {}
  if (type === InitTypes.DIGITAL_OCEAN) {
    try {
      const output = await axios.get(DO_USER_DATA_URL)
      const response = parseEnv(output.data)
      for (let [key, value] of Object.entries(makeFiles.ConfigMap)) {
        if (response[key]) {
          config[value] = response[key]
        }
      }
    } catch (err) {
      // don't need to handle error, just don't do anything
    }
  }
  await makeFiles.makeEnv(config)
}

async function start() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(
    info(
      "Starting services, this may take a moment - first time this may take a few minutes to download images."
    )
  )
  const port = makeFiles.getEnvProperty("MAIN_PORT")
  await handleError(async () => {
    // need to log as it makes it more clear
    await compose.upAll({ cwd: "./", log: true })
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
  if (await confirmation("Do you wish to update you docker-compose.yaml?")) {
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

async function watchPlugins(pluginPath) {
  const PLUGIN_PATH = "/plugins"
  // get absolute path
  pluginPath = resolve(pluginPath)
  if (!fs.existsSync(pluginPath)) {
    console.log(
      error(
        `The directory "${pluginPath}" does not exist, please create and then try again.`
      )
    )
    return
  }
  const opts = ["docker-compose.yaml", "docker-compose.yml"]
  let dockerFilePath = opts.find(name => fs.existsSync(name))
  if (!dockerFilePath) {
    console.log(error("Unable to locate docker-compose YAML."))
    return
  }
  const dockerYaml = fs.readFileSync(dockerFilePath, "utf8")
  const parsedYaml = yaml.parse(dockerYaml)
  let service,
    serviceList = Object.keys(parsedYaml.services)
  if (parsedYaml.services["app-service"]) {
    service = parsedYaml.services["app-service"]
  } else if (serviceList.length === 1) {
    service = parsedYaml.services[serviceList[0]]
  }
  if (!service) {
    console.log(
      error(
        "Unable to locate service within compose file, is it a valid Budibase configuration?"
      )
    )
    return
  }
  // set environment variable
  service.environment["PLUGINS_DIR"] = PLUGIN_PATH
  // add volumes to parsed yaml
  if (!service.volumes) {
    service.volumes = []
  }
  const found = service.volumes.find(vol => vol.includes(PLUGIN_PATH))
  if (found) {
    service.volumes.splice(service.volumes.indexOf(found), 1)
  }
  service.volumes.push(`${pluginPath}:${PLUGIN_PATH}`)
  fs.writeFileSync(dockerFilePath, yaml.stringify(parsedYaml))
  console.log(success("Docker compose configuration has been updated!"))
}

const command = new Command(`${CommandWords.HOSTING}`)
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption(
    "--init [type]",
    "Configure a self hosted platform in current directory, type can be unspecified, 'quick' or 'single'.",
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
  .addSubOption(
    "--watch-plugin-dir [directory]",
    "Add plugin directory watching to a Budibase install.",
    watchPlugins
  )
  .addSubOption("--dev", "")

exports.command = command
