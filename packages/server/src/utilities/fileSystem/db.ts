const { budibaseTempDir } = require("../budibaseDir")
const fs = require("fs")
const { join } = require("path")
const {
  doWithDB,
  dangerousGetDB,
  closeDB,
} = require("@budibase/backend-core/db")
import { ObjectStoreBuckets } from "../../constants"
const env = require("../../environment")
const MemoryStream = require("memorystream")
import { objectStore } from "@budibase/backend-core"

/**
 * Exports a DB to either file or a variable (memory).
 * @param {string} dbName the DB which is to be exported.
 * @param {string} exportName optional - provide a filename to write the backup to a file
 * @param {boolean} stream optional - whether to perform a full backup
 * @param {function} filter optional - a filter function to clear out any un-wanted docs.
 * @return {*} either a readable stream or a string
 */
export const exportDB = async (
  dbName: string,
  opts: { stream?: boolean; filter?: any; exportName?: string } = {}
) => {
  // streaming a DB dump is a bit more complicated, can't close DB
  const stream = opts.stream
  const filter = opts.filter
  const exportName = opts.exportName

  if (stream) {
    const db = dangerousGetDB(dbName)
    const memStream = new MemoryStream()
    memStream.on("end", async () => {
      await closeDB(db)
    })
    db.dump(memStream, { filter })
    return memStream
  }

  return doWithDB(dbName, async (db: any) => {
    // Write the dump to file if required
    if (exportName) {
      const path = join(budibaseTempDir(), exportName)
      const writeStream = fs.createWriteStream(path)
      await db.dump(writeStream, { filter })

      // Upload the dump to the object store if self hosted
      if (env.SELF_HOSTED) {
        await objectStore.streamUpload(
          ObjectStoreBuckets.BACKUPS,
          join(dbName, exportName),
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
    await db.dump(memStream, { filter })
    return appString
  })
}
