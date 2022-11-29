const { InitTypes, AnalyticsEvents } = require("../constants")
const { confirmation } = require("../questions")
const { captureEvent } = require("../events")
const makeFiles = require("./makeFiles")
const axios = require("axios")
const { parseEnv } = require("../utils")
const { checkDockerConfigured, downloadFiles } = require("./utils")
const { watchPlugins } = require("./watch")
const { generateUser } = require("./genUser")

const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data"

async function getInitConfig(type, isQuick, port) {
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
  // override port
  if (port) {
    config[makeFiles.ConfigMap.MAIN_PORT] = port
  }
  return config
}

exports.init = async opts => {
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
  const config = await getInitConfig(type, isQuick, port)
  if (!isSingle) {
    await downloadFiles()
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
