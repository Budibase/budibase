import { resolve } from "path"
import fs from "fs"
import { error, success } from "../utils"
import { updateDockerComposeService } from "./utils"
import { DockerCompose } from "./types"

export async function watchPlugins(pluginPath: string, silent: boolean) {
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
  updateDockerComposeService((service: DockerCompose) => {
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
  })
  if (!silent) {
    console.log(
      success(`Docker compose configured to watch directory: ${pluginPath}`)
    )
  }
}
