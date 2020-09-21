const sendEmail = require("./steps/sendEmail")
const saveRecord = require("./steps/saveRecord")
const deleteRecord = require("./steps/deleteRecord")
const createUser = require("./steps/createUser")
const environment = require("../environment")
const download = require("download")
const fetch = require("node-fetch")
const path = require("path")
const Sentry = require("@sentry/node")

const AUTOMATION_MANIFEST = "manifest.json"
const AUTOMATION_BUNDLE = "bundle.js"
const BUILTIN_ACTIONS = {
  SEND_EMAIL: sendEmail.run,
  SAVE_RECORD: saveRecord.run,
  DELETE_RECORD: deleteRecord.run,
  CREATE_USER: createUser.run,
}
const BUILTIN_DEFINITIONS = {
  SEND_EMAIL: sendEmail.definition,
  SAVE_RECORD: saveRecord.definition,
  DELETE_RECORD: deleteRecord.definition,
  CREATE_USER: createUser.definition,
}

let MANIFEST = null

async function downloadPackage(name, version, pathToInstall) {
  await download(
    `${environment.AUTOMATION_BUCKET}/${name}/${version}/${AUTOMATION_BUNDLE}`,
    pathToInstall
  )
  return require(path.join(pathToInstall, AUTOMATION_BUNDLE))
}

module.exports.getAction = async function(actionName) {
  if (BUILTIN_ACTIONS[actionName] != null) {
    return BUILTIN_ACTIONS[actionName]
  }
  // env setup to get async packages
  if (!MANIFEST || !MANIFEST.packages || !MANIFEST.packages[actionName]) {
    return null
  }
  let pkg = MANIFEST.packages[actionName]
  let toInstall = path.join(
    environment.AUTOMATION_DIRECTORY,
    pkg.stepId,
    pkg.version
  )
  try {
    return require(path.join(toInstall, AUTOMATION_BUNDLE))
  } catch (err) {
    return downloadPackage(pkg.stepId, pkg.version, toInstall)
  }
}

module.exports.init = async function() {
  // env setup to get async packages
  try {
    if (environment.AUTOMATION_DIRECTORY && environment.AUTOMATION_BUCKET) {
      let response = await fetch(
        `${environment.AUTOMATION_BUCKET}/${AUTOMATION_MANIFEST}`
      )
      MANIFEST = await response.json()
    }
  } catch (err) {
    Sentry.captureException(err)
  }
  module.exports.DEFINITIONS =
    MANIFEST && MANIFEST.packages
      ? Object.assign(MANIFEST.packages, BUILTIN_DEFINITIONS)
      : BUILTIN_DEFINITIONS
}

module.exports.DEFINITIONS = BUILTIN_DEFINITIONS
module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
