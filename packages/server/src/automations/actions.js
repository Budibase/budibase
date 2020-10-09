const sendEmail = require("./steps/sendEmail")
const createRow = require("./steps/createRow")
const updateRow = require("./steps/updateRow")
const deleteRow = require("./steps/deleteRow")
const createUser = require("./steps/createUser")
const environment = require("../environment")
const download = require("download")
const fetch = require("node-fetch")
const { join } = require("../utilities/centralPath")
const os = require("os")
const fs = require("fs")
const Sentry = require("@sentry/node")

const DEFAULT_BUCKET =
  "https://prod-budi-automations.s3-eu-west-1.amazonaws.com"
const DEFAULT_DIRECTORY = ".budibase-automations"
const AUTOMATION_MANIFEST = "manifest.json"
const BUILTIN_ACTIONS = {
  SEND_EMAIL: sendEmail.run,
  CREATE_ROW: createRow.run,
  UPDATE_ROW: updateRow.run,
  DELETE_ROW: deleteRow.run,
  CREATE_USER: createUser.run,
}
const BUILTIN_DEFINITIONS = {
  SEND_EMAIL: sendEmail.definition,
  CREATE_ROW: createRow.definition,
  UPDATE_ROW: updateRow.definition,
  DELETE_ROW: deleteRow.definition,
  CREATE_USER: createUser.definition,
}

let AUTOMATION_BUCKET = environment.AUTOMATION_BUCKET
let AUTOMATION_DIRECTORY = environment.AUTOMATION_DIRECTORY
let MANIFEST = null

function buildBundleName(pkgName, version) {
  return `${pkgName}@${version}.min.js`
}

async function downloadPackage(name, version, bundleName) {
  await download(
    `${AUTOMATION_BUCKET}/${name}/${version}/${bundleName}`,
    AUTOMATION_DIRECTORY
  )
  return require(join(AUTOMATION_DIRECTORY, bundleName))
}

module.exports.getAction = async function(actionName) {
  if (BUILTIN_ACTIONS[actionName] != null) {
    return BUILTIN_ACTIONS[actionName]
  }
  // env setup to get async packages
  if (!MANIFEST || !MANIFEST.packages || !MANIFEST.packages[actionName]) {
    return null
  }
  const pkg = MANIFEST.packages[actionName]
  const bundleName = buildBundleName(pkg.stepId, pkg.version)
  try {
    return require(join(AUTOMATION_DIRECTORY, bundleName))
  } catch (err) {
    return downloadPackage(pkg.stepId, pkg.version, bundleName)
  }
}

module.exports.init = async function() {
  // set defaults
  if (!AUTOMATION_DIRECTORY) {
    AUTOMATION_DIRECTORY = join(os.homedir(), DEFAULT_DIRECTORY)
  }
  if (!AUTOMATION_BUCKET) {
    AUTOMATION_BUCKET = DEFAULT_BUCKET
  }
  if (!fs.existsSync(AUTOMATION_DIRECTORY)) {
    fs.mkdirSync(AUTOMATION_DIRECTORY, { recursive: true })
  }
  // env setup to get async packages
  try {
    let response = await fetch(`${AUTOMATION_BUCKET}/${AUTOMATION_MANIFEST}`)
    MANIFEST = await response.json()
    module.exports.DEFINITIONS =
      MANIFEST && MANIFEST.packages
        ? Object.assign(MANIFEST.packages, BUILTIN_DEFINITIONS)
        : BUILTIN_DEFINITIONS
  } catch (err) {
    Sentry.captureException(err)
  }
}

module.exports.DEFINITIONS = BUILTIN_DEFINITIONS
module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
