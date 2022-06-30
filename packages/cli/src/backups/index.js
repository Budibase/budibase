const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
const dotenv = require("dotenv")
const fs = require("fs")
const { join } = require("path")
const { string } = require("../questions")
const { env } = require("@budibase/backend-core")
const { getPouch, getAllDbs } = require("@budibase/backend-core/db")
const tar = require("tar")
const { progressBar } = require("../utils")

const DEFAULT_COUCH = "http://budibase:budibase@localhost:10000/db/"
const DEFAULT_MINIO = "http://localhost:10000/"
const TEMP_DIR = ".temp"

const REQUIRED = [
  { value: "MAIN_PORT", default: "10000" },
  { value: "COUCH_DB_URL", default: DEFAULT_COUCH },
  { value: "MINIO_URL", default: DEFAULT_MINIO },
  { value: "MINIO_ACCESS_KEY" },
  { value: "MINIO_SECRET_KEY" },
]

function checkURLs(config) {
  const mainPort = config["MAIN_PORT"],
    username = config["COUCH_DB_USER"],
    password = config["COUCH_DB_PASSWORD"]
  if (!config["COUCH_DB_URL"] && mainPort && username && password) {
    config[
      "COUCH_DB_URL"
    ] = `http://${username}:${password}@localhost:${mainPort}/db/`
  }
  if (!config["MINIO_URL"]) {
    config["MINIO_URL"] = DEFAULT_MINIO
  }
  return config
}

async function askQuestions() {
  console.log(
    "*** NOTE: use a .env file to load these parameters repeatedly ***"
  )
  let config = {}
  for (let property of REQUIRED) {
    config[property.value] = await string(property.value, property.default)
  }
  return config
}

function loadEnvironment(path) {
  if (!fs.existsSync(path)) {
    throw "Unable to file specified .env file"
  }
  const env = fs.readFileSync(path, "utf8")
  const config = checkURLs(dotenv.parse(env))
  for (let required of REQUIRED) {
    if (!config[required.value]) {
      throw `Cannot find "${required.value}" property in .env file`
    }
  }
  return config
}

// true is the default value passed by commander
async function getConfig(envFile = true) {
  let config
  if (envFile !== true) {
    config = loadEnvironment(envFile)
  } else {
    config = askQuestions()
  }
  for (let required of REQUIRED) {
    env._set(required.value, config[required.value])
  }
  return config
}

function replication(from, to) {
  return new Promise((resolve, reject) => {
    from.replicate
      .to(to)
      .on("complete", () => {
        resolve()
      })
      .on("error", err => {
        reject(err)
      })
  })
}

function getPouches() {
  const Remote = getPouch({ replication: true })
  const Local = getPouch({ onDisk: true, directory: TEMP_DIR })
  return { Remote, Local }
}

async function exportBackup(opts) {
  const envFile = opts.env || undefined
  await getConfig(envFile)
  let filename = opts["export"] || opts
  if (typeof filename !== "string") {
    filename = `backup-${new Date().toISOString()}.tar.gz`
  }
  await getConfig(envFile)
  const dbList = await getAllDbs()
  const { Remote, Local } = getPouches()
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  const couchDir = join(TEMP_DIR, "couchdb")
  fs.mkdirSync(TEMP_DIR)
  fs.mkdirSync(couchDir)
  const bar = progressBar(dbList.length)
  let count = 0
  for (let db of dbList) {
    bar.update(++count)
    const remote = new Remote(db)
    const local = new Local(join(TEMP_DIR, "couchdb", db))
    await replication(remote, local)
  }
  bar.stop()
  tar.create(
    {
      sync: true,
      gzip: true,
      file: filename,
      cwd: join(TEMP_DIR),
    },
    ["couchdb"]
  )
  fs.rmSync(TEMP_DIR, { recursive: true })
  console.log(`Generated export file - ${filename}`)
}

async function importBackup(opts) {
  const envFile = opts.env || undefined
  const filename = opts["import"] || opts
  await getConfig(envFile)
  if (!filename || !fs.existsSync(filename)) {
    console.error("Cannot import without specifying a valid file to import")
    process.exit(-1)
  }
  fs.mkdirSync(TEMP_DIR)
  tar.extract({
    sync: true,
    cwd: join(TEMP_DIR),
    file: filename,
  })
  const { Remote, Local } = getPouches()
  const dbList = fs.readdirSync(join(TEMP_DIR, "couchdb"))
  const bar = progressBar(dbList.length)
  let count = 0
  for (let db of dbList) {
    bar.update(++count)
    const remote = new Remote(db)
    const local = new Local(join(TEMP_DIR, "couchdb", db))
    await replication(local, remote)
  }
  bar.stop()
  console.log("Import complete")
  fs.rmSync(TEMP_DIR, { recursive: true })
}

async function pickOne(opts) {
  if (opts["import"]) {
    return importBackup(opts)
  } else if (opts["export"]) {
    return exportBackup(opts)
  }
}

const command = new Command(`${CommandWords.BACKUPS}`)
  .addHelp(
    "Allows building backups of Budibase, as well as importing a backup to a new instance."
  )
  .addSubOption(
    "--export [filename]",
    "Export a backup from an existing Budibase installation.",
    exportBackup
  )
  .addSubOption(
    "--import [filename]",
    "Import a backup to a new Budibase installation.",
    importBackup
  )
  .addSubOption(
    "--env [envFile]",
    "Provide an environment variable file to configure the CLI.",
    pickOne
  )

exports.command = command
