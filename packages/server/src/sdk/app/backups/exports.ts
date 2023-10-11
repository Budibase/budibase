import { db as dbCore, encryption, objectStore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { streamFile, createTempFolder } from "../../../utilities/fileSystem"
import { ObjectStoreBuckets } from "../../../constants"
import {
  AUTOMATION_LOG_PREFIX,
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
  USER_METDATA_PREFIX,
} from "../../../db/utils"
import { DB_EXPORT_FILE, STATIC_APP_FILES } from "./constants"
import fs from "fs"
import { join } from "path"
import env from "../../../environment"

const uuid = require("uuid/v4")
import tar from "tar"

const MemoryStream = require("memorystream")

export interface DBDumpOpts {
  filter?: any
  exportPath?: string
}

export interface ExportOpts extends DBDumpOpts {
  tar?: boolean
  excludeRows?: boolean
  excludeLogs?: boolean
  encryptPassword?: string
}

function tarFilesToTmp(tmpDir: string, files: string[]) {
  const fileName = `${uuid()}.tar.gz`
  const exportFile = join(budibaseTempDir(), fileName)
  tar.create(
    {
      sync: true,
      gzip: true,
      file: exportFile,
      noDirRecurse: false,
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
export async function exportDB(
  dbName: string,
  opts: DBDumpOpts = {}
): Promise<string> {
  const exportOpts = {
    filter: opts?.filter,
    batch_size: 1000,
    batch_limit: 5,
    style: "main_only",
  }
  return dbCore.doWithDB(dbName, async (db: any) => {
    // Write the dump to file if required
    if (opts?.exportPath) {
      const path = opts?.exportPath
      const writeStream = fs.createWriteStream(path)
      await db.dump(writeStream, exportOpts)
      return path
    } else {
      // Stringify the dump in memory if required
      const memStream = new MemoryStream()
      let appString = ""
      memStream.on("data", (chunk: any) => {
        appString += chunk.toString()
      })
      await db.dump(memStream, exportOpts)
      return appString
    }
  })
}

function defineFilter(excludeRows?: boolean, excludeLogs?: boolean) {
  const ids = [USER_METDATA_PREFIX, LINK_USER_METADATA_PREFIX]
  if (excludeRows) {
    ids.push(TABLE_ROW_PREFIX)
  }
  if (excludeLogs) {
    ids.push(AUTOMATION_LOG_PREFIX)
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
  const appPath = `${prodAppId}/`
  // export bucket contents
  let tmpPath = createTempFolder(uuid())
  if (!env.isTest()) {
    // write just the static files
    if (config?.excludeRows) {
      for (let path of STATIC_APP_FILES) {
        const contents = await objectStore.retrieve(
          ObjectStoreBuckets.APPS,
          join(appPath, path)
        )
        fs.writeFileSync(join(tmpPath, path), contents)
      }
    }
    // get all of the files
    else {
      tmpPath = await objectStore.retrieveDirectory(
        ObjectStoreBuckets.APPS,
        appPath
      )
    }
  }

  const downloadedPath = join(tmpPath, appPath)
  if (fs.existsSync(downloadedPath)) {
    const allFiles = fs.readdirSync(downloadedPath)
    for (let file of allFiles) {
      const path = join(downloadedPath, file)
      // move out of app directory, simplify structure
      fs.renameSync(path, join(downloadedPath, "..", file))
    }
    // remove the old app directory created by object export
    fs.rmdirSync(downloadedPath)
  }
  // enforce an export of app DB to the tmp path
  const dbPath = join(tmpPath, DB_EXPORT_FILE)
  await exportDB(appId, {
    filter: defineFilter(config?.excludeRows, config?.excludeLogs),
    exportPath: dbPath,
  })

  if (config?.encryptPassword) {
    for (let file of fs.readdirSync(tmpPath)) {
      const path = join(tmpPath, file)

      await encryption.encryptFile(
        { dir: tmpPath, filename: file },
        config.encryptPassword
      )

      fs.rmSync(path)
    }
  }

  // if tar requested, return where the tarball is
  if (config?.tar) {
    // now the tmpPath contains both the DB export and attachments, tar this
    const tarPath = tarFilesToTmp(tmpPath, fs.readdirSync(tmpPath))
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
 * Streams a backup of the database state for an app
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @param {string} encryptPassword password for encrypting the export.
 * @returns {*} a readable stream of the backup which is written in real time
 */
export async function streamExportApp({
  appId,
  excludeRows,
  encryptPassword,
}: {
  appId: string
  excludeRows: boolean
  encryptPassword?: string
}) {
  const tmpPath = await exportApp(appId, {
    excludeRows,
    excludeLogs: true,
    tar: true,
    encryptPassword,
  })
  return streamFile(tmpPath)
}
