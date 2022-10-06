import { closeDB, dangerousGetDB, doWithDB } from "@budibase/backend-core/db"
import { budibaseTempDir } from "../../utilities/budibaseDir"
import { streamUpload } from "../../utilities/fileSystem/utilities"
import { ObjectStoreBuckets } from "../../constants"
import {
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
  USER_METDATA_PREFIX,
} from "../../db/utils"
import fs from "fs"
import env from "../../environment"
import { join } from "path"
const MemoryStream = require("memorystream")

/**
 * Exports a DB to either file or a variable (memory).
 * @param {string} dbName the DB which is to be exported.
 * @param {object} opts various options for the export, e.g. whether to stream,
 * a filter function or the name of the export.
 * @return {*} either a readable stream or a string
 */
export async function exportDB(
  dbName: string,
  opts: { stream?: boolean; filter?: any; exportName?: string } = {}
) {
  // streaming a DB dump is a bit more complicated, can't close DB
  if (opts?.stream) {
    const db = dangerousGetDB(dbName)
    const memStream = new MemoryStream()
    memStream.on("end", async () => {
      await closeDB(db)
    })
    db.dump(memStream, { filter: opts?.filter })
    return memStream
  }

  return doWithDB(dbName, async (db: any) => {
    // Write the dump to file if required
    if (opts?.exportName) {
      const path = join(budibaseTempDir(), opts?.exportName)
      const writeStream = fs.createWriteStream(path)
      await db.dump(writeStream, { filter: opts?.filter })

      // Upload the dump to the object store if self-hosted
      if (env.SELF_HOSTED) {
        await streamUpload(
          ObjectStoreBuckets.BACKUPS,
          join(dbName, opts?.exportName),
          fs.createReadStream(path)
        )
      }

      return fs.createReadStream(path)
    }

    // Stringify the dump in memory if required
    const memStream = new MemoryStream()
    let appString = ""
    memStream.on("data", (chunk: any) => {
      appString += chunk.toString()
    })
    await db.dump(memStream, { filter: opts?.filter })
    return appString
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
 * @param {object} config Config to send to export DB
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} either a string or a stream of the backup
 */
async function backupAppData(
  appId: string,
  config: any,
  excludeRows?: boolean
) {
  return await exportDB(appId, {
    ...config,
    filter: defineFilter(excludeRows),
  })
}

/**
 * Streams a backup of the database state for an app
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} a readable stream of the backup which is written in real time
 */
export async function streamBackup(appId: string, excludeRows: boolean) {
  return await backupAppData(appId, { stream: true }, excludeRows)
}

/**
 * Takes a copy of the database state for an app to the object store.
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {string} backupName The name of the backup located in the object store.
 * @return {*} a readable stream to the completed backup file
 */
export async function performBackup(appId: string, backupName: string) {
  return await backupAppData(appId, { exportName: backupName })
}
