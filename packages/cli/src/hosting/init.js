const { InitTypes, AnalyticsEvents } = require("../constants")
const { confirmation } = require("../questions")
const { captureEvent } = require("../events")
const makeFiles = require("./makeFiles")
const axios = require("axios")
const { parseEnv } = require("../utils")
const { checkDockerConfigured, downloadFiles } = require("./utils")
const { watchPlugins } = require("./watch")

const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data"

async function getInitConfig(type, isQuick) {
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
  return config
}

exports.init = async opts => {
  let type, isSingle, watchDir
  if (typeof opts === "string") {
    type = opts
  } else {
    type = opts.init
    isSingle = opts.single
    watchDir = opts.watchPluginDir
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
  const config = await getInitConfig(type, isQuick)
  if (!isSingle) {
    await downloadFiles()
    await makeFiles.makeEnv(config)
  } else {
    await makeFiles.makeSingleCompose(config)
    if (watchDir) {
      await watchPlugins(watchDir)
    }
  }
}
