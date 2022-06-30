const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
//const pouchdb = require("pouchdb")
const dotenv = require("dotenv")
const fs = require("fs")
const { string } = require("../questions")

const REQUIRED = [
  { value: "MAIN_PORT", key: "Budibase Port", default: "10000" },
  {
    value: "COUCH_DB_URL",
    key: "CouchDB URL",
    default: "http://budibase:budibase@localhost:10000/db/",
  },
  { value: "MINIO_URL", key: "MinIO URL", default: "http://localhost:10000/" },
  { value: "MINIO_ACCESS_KEY", key: "MinIO Access Key" },
  { value: "MINIO_SECRET_KEY", key: "MinIO Secret Key" },
]

function checkCouchURL(config) {
  if (config["COUCH_DB_URL"]) {
    return config
  }
  const mainPort = config["MAIN_PORT"],
    username = config["COUCH_DB_USERNAME"],
    password = config["COUCH_DB_PASSWORD"]
  if (mainPort && username && password) {
    config[
      "COUCH_DB_URL"
    ] = `http://${username}:${password}@localhost:${mainPort}/db/`
  }
  return config
}

async function askQuestions() {
  let config = {}
  for (let property of REQUIRED) {
    config[property.value] = await string(property.key, property.default)
  }
  return config
}

function loadEnvironment(path) {
  if (!fs.existsSync(path)) {
    throw "Unable to file specified .env file"
  }
  const env = fs.readFileSync(path, "utf8")
  const config = checkCouchURL(dotenv.parse(env))
  for (let required of REQUIRED) {
    if (!config[required.value]) {
      throw `Cannot find "${required.value}" property in .env file`
    }
  }
  return config
}

// true is the default value passed by commander
async function getConfig(envFile = true) {
  if (envFile !== true) {
    return loadEnvironment(envFile)
  } else {
    return askQuestions()
  }
}

async function exportBackup(envFile) {
  const config = await getConfig(envFile)
  console.log(config)
}

async function importBackup(envFile) {
  const config = await getConfig(envFile)
  console.log(config)
}

const command = new Command(`${CommandWords.BACKUPS}`)
  .addHelp(
    "Allows building backups of Budibase, as well as importing a backup to a new instance."
  )
  .addSubOption(
    "--export [envFile]",
    "Export a backup from an existing Budibase installation.",
    exportBackup
  )
  .addSubOption(
    "--import [envFile]",
    "Import a backup to a new Budibase installation.",
    importBackup
  )

exports.command = command
