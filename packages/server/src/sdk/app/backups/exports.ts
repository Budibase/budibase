import { db as dbCore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { retrieveDirectory } from "../../../utilities/fileSystem/utilities"
import { streamFile } from "../../../utilities/fileSystem"
import { ObjectStoreBuckets } from "../../../constants"
import {
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
  USER_METDATA_PREFIX,
} from "../../../db/utils"
import {
  DB_EXPORT_FILE,
  GLOBAL_DB_EXPORT_FILE,
  ATTACHMENT_DIR,
} from "./constants"
import fs from "fs"
import { join } from "path"
const uuid = require("uuid/v4")
const tar = require("tar")
const MemoryStream = require("memorystream")

type ExportOpts = {
  filter?: any
  exportPath?: string
  tar?: boolean
  excludeRows?: boolean
}

function tarFilesToTmp(tmpDir: string, files: string[]) {
  const exportFile = join(budibaseTempDir(), `${uuid()}.tar.gz`)
  tar.create(
    {
      sync: true,
      gzip: true,
      file: exportFile,
      recursive: true,
      cwd: tmpDir,
    },
    files
  )
  return exportFile
}

/**
 * Exports a DB to either file or a variable (memory).
 * @param {string} dbName the DB which is to be exported.
 * @param {object} opts various options for the export, e.g. whether to stream,
 * a filter function or the name of the export.
 * @return {*} either a readable stream or a string
 */
export async function exportDB(dbName: string, opts: ExportOpts = {}) {
  return dbCore.doWithDB(dbName, async (db: any) => {
    // Write the dump to file if required
    if (opts?.exportPath) {
      const path = opts?.exportPath
      const writeStream = fs.createWriteStream(path)
      await db.dump(writeStream, { filter: opts?.filter })
      return path
    } else {
      // Stringify the dump in memory if required
      const memStream = new MemoryStream()
      let appString = ""
      memStream.on("data", (chunk: any) => {
        appString += chunk.toString()
      })
      await db.dump(memStream, { filter: opts?.filter })
      return appString
    }
  })
}

function defineFilter(excludeRows?: boolean) {
  const ids = [USER_METDATA_PREFIX, LINK_USER_METADATA_PREFIX]
  if (excludeRows) {
    ids.push(TABLE_ROW_PREFIX)
  }
  return (doc: any) =>
    !ids.map(key => doc._id.includes(key)).reduce((prev, curr) => prev || curr)
}

/**
 * Local utility to back up the database state for an app, excluding global user
 * data or user relationships.
 * @param {string} appId The app to back up
 * @param {object} config Config to send to export DB/attachment export
 * @returns {*} either a string or a stream of the backup
 */
export async function exportApp(appId: string, config?: ExportOpts) {
  const prodAppId = dbCore.getProdAppID(appId)
  const attachmentsPath = `${prodAppId}/${ATTACHMENT_DIR}`
  // export attachments to tmp
  const tmpPath = await retrieveDirectory(
    ObjectStoreBuckets.APPS,
    attachmentsPath
  )
  const downloadedPath = join(tmpPath, attachmentsPath),
    tmpAttachmentPath = join(tmpPath, ATTACHMENT_DIR)
  if (fs.existsSync(downloadedPath)) {
    // move out of app directory, simplify structure
    fs.renameSync(downloadedPath, tmpAttachmentPath)
    // remove the old app directory created by object export
    fs.rmdirSync(join(tmpPath, prodAppId))
  } else {
    fs.mkdirSync(tmpAttachmentPath)
  }
  // enforce an export of app DB to the tmp path
  const dbPath = join(tmpPath, DB_EXPORT_FILE)
  await exportDB(appId, {
    ...config,
    filter: defineFilter(config?.excludeRows),
    exportPath: dbPath,
  })
  // if tar requested, return where the tarball is
  if (config?.tar) {
    // now the tmpPath contains both the DB export and attachments, tar this
    const tarPath = tarFilesToTmp(tmpPath, [ATTACHMENT_DIR, DB_EXPORT_FILE])
    // cleanup the tmp export files as tarball returned
    fs.rmSync(tmpPath, { recursive: true, force: true })
    return tarPath
  }
  // tar not requested, turn the directory where export is
  else {
    return tmpPath
  }
}

/**
 * Export all apps + global DB (if supplied) to a single tarball, this includes
 * the attachments for each app as well.
 * @param {object[]} appMetadata The IDs and names of apps to export.
 * @param {string} globalDbContents The contents of the global DB to export as well.
 * @return {string} The path to the tarball.
 */
export async function exportMultipleApps(
  appMetadata: { appId: string; name: string }[],
  globalDbContents?: string
) {
  const tmpPath = join(budibaseTempDir(), uuid())
  fs.mkdirSync(tmpPath)
  let exportPromises: Promise<void>[] = []
  // export each app to a directory, then move it into the complete export
  const exportAndMove = async (appId: string, appName: string) => {
    const path = await exportApp(appId)
    await fs.promises.rename(path, join(tmpPath, appId))
  }
  for (let metadata of appMetadata) {
    exportPromises.push(exportAndMove(metadata.appId, metadata.name))
  }
  // wait for all exports to finish
  await Promise.all(exportPromises)
  // add the global DB contents
  if (globalDbContents) {
    fs.writeFileSync(join(tmpPath, GLOBAL_DB_EXPORT_FILE), globalDbContents)
  }
  const appNames = appMetadata.map(metadata => metadata.name)
  const tarPath = tarFilesToTmp(tmpPath, [...appNames, GLOBAL_DB_EXPORT_FILE])
  // clear up the tmp path now tarball generated
  fs.rmSync(tmpPath, { recursive: true, force: true })
  return tarPath
}

/**
 * Streams a backup of the database state for an app
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} a readable stream of the backup which is written in real time
 */
export async function streamExportApp(appId: string, excludeRows: boolean) {
  const tmpPath = await exportApp(appId, { excludeRows, tar: true })
  return streamFile(tmpPath)
}
