const { lookpath } = require("lookpath")
const fs = require("fs")
const makeFiles = require("./makeFiles")
const { logErrorToFile, downloadFile, error } = require("../utils")
const yaml = require("yaml")

const ERROR_FILE = "docker-error.log"
const FILE_URLS = [
  "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/docker-compose.yaml",
]

exports.downloadFiles = async () => {
  const promises = []
  for (let url of FILE_URLS) {
    const fileName = url.split("/").slice(-1)[0]
    promises.push(downloadFile(url, `./${fileName}`))
  }
  await Promise.all(promises)
}

exports.checkDockerConfigured = async () => {
  const error =
    "docker/docker-compose has not been installed, please follow instructions at: https://docs.budibase.com/docs/docker-compose"
  const docker = await lookpath("docker")
  const compose = await lookpath("docker-compose")
  if (!docker || !compose) {
    throw error
  }
}

exports.checkInitComplete = () => {
  if (
    !fs.existsSync(makeFiles.ENV_PATH) &&
    !fs.existsSync(makeFiles.COMPOSE_PATH)
  ) {
    throw "Please run the hosting --init command before any other hosting command."
  }
}

exports.handleError = async func => {
  try {
    await func()
  } catch (err) {
    if (err && err.err) {
      logErrorToFile(ERROR_FILE, err.err)
    }
    throw `Failed to start - logs written to file: ${ERROR_FILE}`
  }
}

exports.getServices = path => {
  const dockerYaml = fs.readFileSync(path, "utf8")
  const parsedYaml = yaml.parse(dockerYaml)
  return { yaml: parsedYaml, services: parsedYaml.services }
}

exports.getAppService = path => {
  const { yaml, services } = exports.getServices(path),
    serviceList = Object.keys(services)
  let service
  if (services["app-service"]) {
    service = services["app-service"]
  } else if (serviceList.length === 1) {
    service = services[serviceList[0]]
  }
  return { yaml, service }
}

exports.updateDockerComposeService = updateFn => {
  const opts = ["docker-compose.yaml", "docker-compose.yml"]
  const dockerFilePath = opts.find(name => fs.existsSync(name))
  if (!dockerFilePath) {
    console.log(error("Unable to locate docker-compose YAML."))
    return
  }
  const { yaml: parsedYaml, service } = exports.getAppService(dockerFilePath)
  if (!service) {
    console.log(
      error(
        "Unable to locate service within compose file, is it a valid Budibase configuration?"
      )
    )
    return
  }
  updateFn(service)
  fs.writeFileSync(dockerFilePath, yaml.stringify(parsedYaml))
}
