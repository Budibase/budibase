import { db as dbCore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../utilities/budibaseDir"
import {
  streamUpload,
  retrieveDirectory,
} from "../../utilities/fileSystem/utilities"
import { ObjectStoreBuckets, ATTACHMENT_PATH } from "../../constants"
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
    const db = dbCore.dangerousGetDB(dbName)
    const memStream = new MemoryStream()
    memStream.on("end", async () => {
      await dbCore.closeDB(db)
    })
    db.dump(memStream, { filter: opts?.filter })
    return memStream
  }

  return dbCore.doWithDB(dbName, async (db: any) => {
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
 * @param {object} config Config to send to export DB
 * @param {boolean} excludeRows Flag to state whether the export should include data.
 * @returns {*} either a string or a stream of the backup
 */
export async function exportApp(
  appId: string,
  config?: any,
  excludeRows?: boolean
) {
  const attachmentsPath = `${dbCore.getProdAppID(appId)}/${ATTACHMENT_PATH}`
  const tmpPath = await retrieveDirectory(
    ObjectStoreBuckets.APPS,
    attachmentsPath
  )
  await exportDB(appId, {
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
export async function streamExportApp(appId: string, excludeRows: boolean) {
  return await exportApp(appId, { stream: true }, excludeRows)
}
