import { Command } from "../structures/Command"
import { CommandWord } from "../constants"
import fs from "fs"
import { join } from "path"
import { getAllDbs } from "../core/db"
import { progressBar, httpCall } from "../utils"
import {
  TEMP_DIR,
  COUCH_DIR,
  MINIO_DIR,
  getConfig,
  replication,
  getPouches,
} from "./utils"
import { exportObjects, importObjects } from "./objectStore"

import tarStream from "tar-stream"
import zlib from "zlib"
import { pipeline } from "stream/promises"

type BackupOpts = { env?: string; import?: string; export?: string }

async function addDirectoryToTar(
  pack: tarStream.Pack,
  dirPath: string,
  relativePath: string
) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const entryRelativePath = join(relativePath, entry.name)

    if (entry.isDirectory()) {
      await addDirectoryToTar(pack, fullPath, entryRelativePath)
    } else {
      const stat = fs.statSync(fullPath)
      const stream = fs.createReadStream(fullPath)
      const entry = pack.entry({ name: entryRelativePath, size: stat.size })
      stream.pipe(entry)
    }
  }
}

async function exportBackup(opts: BackupOpts) {
  const envFile = opts.env || undefined
  let filename = opts["export"] || (opts as string)
  if (typeof filename !== "string") {
    filename = `backup-${new Date().toISOString()}.tar.gz`
  }
  const config = await getConfig(envFile)
  const dbList = (await getAllDbs(config["COUCH_DB_URL"])) as string[]
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
    await remote.close()
    await local.close()
  }
  bar.stop()
  console.log("S3 Export")
  await exportObjects()
  // Create tar archive with streaming
  const pack = tarStream.pack()
  const gzip = zlib.createGzip()
  const outputStream = fs.createWriteStream(filename)

  // Start the pipeline
  const pipelinePromise = pipeline(pack, gzip, outputStream)

  // Add directories to tar
  const directories = [COUCH_DIR, MINIO_DIR]
  for (const dir of directories) {
    const dirPath = join(TEMP_DIR, dir)
    if (fs.existsSync(dirPath)) {
      await addDirectoryToTar(pack, dirPath, dir)
    }
  }

  // Finalize and wait for completion
  pack.finalize()
  await pipelinePromise
  fs.rmSync(TEMP_DIR, { recursive: true })
  console.log(`Generated export file - ${filename}`)
}

async function importBackup(opts: BackupOpts) {
  const envFile = opts.env || undefined
  const filename = opts["import"] || (opts as string)
  const config = await getConfig(envFile)
  if (!filename || !fs.existsSync(filename)) {
    console.error("Cannot import without specifying a valid file to import")
    process.exit(-1)
  }
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  fs.mkdirSync(TEMP_DIR)
  // Extract tar archive with streaming
  const extract = tarStream.extract()

  extract.on("entry", (header, stream, next) => {
    const targetPath = join(TEMP_DIR, header.name)

    if (header.type === "directory") {
      fs.mkdirSync(targetPath, { recursive: true })
      stream.resume()
      next()
    } else if (header.type === "file") {
      // Ensure directory exists
      const dir = join(targetPath, "..")
      fs.mkdirSync(dir, { recursive: true })

      const writeStream = fs.createWriteStream(targetPath)
      stream.pipe(writeStream)
      stream.on("end", next)
    } else {
      stream.resume()
      next()
    }
  })

  const readStream = fs.createReadStream(filename)
  const isGzipped = filename.endsWith(".gz") || filename.endsWith(".tgz")

  if (isGzipped) {
    await pipeline(readStream, zlib.createGunzip(), extract)
  } else {
    await pipeline(readStream, extract)
  }
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
    await remote.close()
    await local.close()
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

async function pickOne(opts: BackupOpts) {
  if (opts["import"]) {
    return importBackup(opts)
  } else if (opts["export"]) {
    return exportBackup(opts)
  }
}

export default new Command(`${CommandWord.BACKUPS}`)
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
