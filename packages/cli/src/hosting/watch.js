const { resolve } = require("path")
const fs = require("fs")
const yaml = require("yaml")
const { error, success } = require("../utils")
const { getAppService } = require("./utils")

exports.watchPlugins = async pluginPath => {
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
  const { yaml: parsedYaml, service } = getAppService(dockerFilePath)
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
