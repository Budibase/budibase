const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
const fs = require("fs")
const { join } = require("path")
const { getAllDbs } = require("../core/db")
const tar = require("tar")
const { progressBar, httpCall } = require("../utils")
const {
  TEMP_DIR,
  COUCH_DIR,
  MINIO_DIR,
  getConfig,
  replication,
  getPouches,
} = require("./utils")
const { exportObjects, importObjects } = require("./objectStore")

async function exportBackup(opts) {
  const envFile = opts.env || undefined
  let filename = opts["export"] || opts
  if (typeof filename !== "string") {
    filename = `backup-${new Date().toISOString()}.tar.gz`
  }
  const config = await getConfig(envFile)
  const dbList = await getAllDbs(config["COUCH_DB_URL"])
  const { Remote, Local } = getPouches(config)
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  const couchDir = join(TEMP_DIR, COUCH_DIR)
  fs.mkdirSync(TEMP_DIR)
  fs.mkdirSync(couchDir)
  console.log("CouchDB Export")
  const bar = progressBar(dbList.length)
  let count = 0
  for (let db of dbList) {
    bar.update(++count)
    const remote = new Remote(db)
    const local = new Local(join(TEMP_DIR, COUCH_DIR, db))
    await replication(remote, local)
  }
  bar.stop()
  console.log("S3 Export")
  await exportObjects()
  tar.create(
    {
      sync: true,
      gzip: true,
      file: filename,
      cwd: join(TEMP_DIR),
    },
    [COUCH_DIR, MINIO_DIR]
  )
  fs.rmSync(TEMP_DIR, { recursive: true })
  console.log(`Generated export file - ${filename}`)
}

async function importBackup(opts) {
  const envFile = opts.env || undefined
  const filename = opts["import"] || opts
  const config = await getConfig(envFile)
  if (!filename || !fs.existsSync(filename)) {
    console.error("Cannot import without specifying a valid file to import")
    process.exit(-1)
  }
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  fs.mkdirSync(TEMP_DIR)
  tar.extract({
    sync: true,
    cwd: join(TEMP_DIR),
    file: filename,
  })
  const { Remote, Local } = getPouches(config)
  const dbList = fs.readdirSync(join(TEMP_DIR, COUCH_DIR))
  console.log("CouchDB Import")
  const bar = progressBar(dbList.length)
  let count = 0
  for (let db of dbList) {
    bar.update(++count)
    const remote = new Remote(db)
    const local = new Local(join(TEMP_DIR, COUCH_DIR, db))
    await replication(local, remote)
  }
  bar.stop()
  console.log("MinIO Import")
  await importObjects()
  // finish by letting the system know that a restore has occurred
  try {
    await httpCall(
      `http://localhost:${config.MAIN_PORT}/api/system/restored`,
      "POST"
    )
  } catch (err) {
    // ignore error - it will be an older system
  }
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
