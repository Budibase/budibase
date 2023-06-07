import { InitType, AnalyticsEvent } from "../constants"
import { confirmation } from "../questions"
import { captureEvent } from "../events"
import * as makeFiles from "./makeFiles"
import { parseEnv } from "../utils"
import { checkDockerConfigured, downloadDockerCompose } from "./utils"
import { watchPlugins } from "./watch"
import { generateUser } from "./genUser"
import fetch from "node-fetch"

const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data"

async function getInitConfig(type: string, isQuick: boolean, port: number) {
  const config: any = isQuick ? makeFiles.QUICK_CONFIG : {}
  if (type === InitType.DIGITAL_OCEAN) {
    try {
      const output = await fetch(DO_USER_DATA_URL)
      const data = await output.text()
      const response = parseEnv(data)
      for (let [key, value] of Object.entries(makeFiles.ConfigMap)) {
        if (response[key]) {
          config[value as string] = response[key]
        }
      }
    } catch (err) {
      // don't need to handle error, just don't do anything
    }
  }
  // override port
  if (port) {
    config[makeFiles.ConfigMap.MAIN_PORT] = port
  }
  return config
}

export async function init(opts: any) {
  let type, isSingle, watchDir, genUser, port, silent
  if (typeof opts === "string") {
    type = opts
  } else {
    type = opts["init"]
    isSingle = opts["single"]
    watchDir = opts["watchPluginDir"]
    genUser = opts["genUser"]
    port = opts["port"]
    silent = opts["silent"]
  }
  const isQuick = type === InitType.QUICK || type === InitType.DIGITAL_OCEAN
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
  captureEvent(AnalyticsEvent.SelfHostInit, {
    type,
  })
  const config = await getInitConfig(type, isQuick, port)
  if (!isSingle) {
    await downloadDockerCompose()
    await makeFiles.makeEnv(config, silent)
  } else {
    await makeFiles.makeSingleCompose(config, silent)
  }
  if (watchDir) {
    await watchPlugins(watchDir, silent)
  }
  if (genUser) {
    const inputPassword = typeof genUser === "string" ? genUser : null
    await generateUser(inputPassword, silent)
  }
}
