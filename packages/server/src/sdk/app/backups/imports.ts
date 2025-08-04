import { db as dbCore, encryption, objectStore } from "@budibase/backend-core"
import {
  Database,
  Row,
  Automation,
  AutomationTriggerStepId,
  RowAttachment,
  FieldType,
  WebhookTriggerInputs,
} from "@budibase/types"
import { getAutomationParams } from "../../../db/utils"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { DB_EXPORT_FILE, GLOBAL_DB_EXPORT_FILE } from "./constants"
import { ObjectStoreBuckets } from "../../../constants"
import { join } from "path"
import fs from "fs"
import fsp from "fs/promises"
import sdk from "../../"
import { v4 as uuid } from "uuid"
import { extractTarball } from "../../../utilities/fileSystem"
import tar from "tar-stream"
import zlib from "zlib"
import { Readable } from "stream"

function rewriteAttachmentUrl(appId: string, attachment: RowAttachment) {
  // URL looks like: /prod-budi-app-assets/appId/attachments/file.csv
  const urlParts = attachment.key?.split("/") || []
  // remove the app ID
  urlParts.shift()
  // add new app ID
  urlParts.unshift(appId)
  const key = urlParts.join("/")
  return {
    ...attachment,
    key,
    url: "", // calculated on retrieval using key
  }
}

export async function updateAttachmentColumns(prodAppId: string, db: Database) {
  // iterate through attachment documents and update them
  const tables = await sdk.tables.getAllInternalTables(db)
  let updatedRows: Row[] = []
  for (let table of tables) {
    const { rows, columns } = await sdk.rows.getRowsWithAttachments(
      db.name,
      table
    )
    updatedRows = updatedRows.concat(
      rows.map(row => {
        for (let column of columns) {
          const columnType = table.schema[column].type
          if (
            columnType === FieldType.ATTACHMENTS &&
            Array.isArray(row[column])
          ) {
            row[column] = row[column].map((attachment: RowAttachment) =>
              rewriteAttachmentUrl(prodAppId, attachment)
            )
          } else if (
            (columnType === FieldType.ATTACHMENT_SINGLE ||
              columnType === FieldType.SIGNATURE_SINGLE) &&
            row[column]
          ) {
            row[column] = rewriteAttachmentUrl(prodAppId, row[column])
          }
        }
        return row
      })
    )
  }
  // write back the updated attachments
  await db.bulkDocs(updatedRows)
}

async function updateAutomations(prodAppId: string, db: Database) {
  const automations = (
    await db.allDocs(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc) as Automation[]
  const devAppId = dbCore.getDevAppID(prodAppId)
  let toSave: Automation[] = []
  for (let automation of automations) {
    const oldDevAppId = automation.appId,
      oldProdAppId = dbCore.getProdAppID(automation.appId)
    if (
      automation.definition.trigger?.stepId === AutomationTriggerStepId.WEBHOOK
    ) {
      const old = automation.definition.trigger.inputs as WebhookTriggerInputs
      automation.definition.trigger.inputs = {
        schemaUrl: old.schemaUrl.replace(oldDevAppId, devAppId),
        triggerUrl: old.triggerUrl.replace(oldProdAppId, prodAppId),
      }
    }
    automation.appId = devAppId
    toSave.push(automation)
  }
  await db.bulkDocs(toSave)
}

export async function untarFile(file: { path: string }) {
  const tmpPath = join(budibaseTempDir(), uuid())
  await fsp.mkdir(tmpPath)
  // extract the tarball
  await extractTarball(file.path, tmpPath)
  return tmpPath
}

export function getGlobalDBFile(tmpPath: string) {
  return fs.readFileSync(join(tmpPath, GLOBAL_DB_EXPORT_FILE), "utf8")
}

export function getListOfAppsInMulti(tmpPath: string) {
  return fs.readdirSync(tmpPath).filter(dir => dir !== GLOBAL_DB_EXPORT_FILE)
}

export interface ImportOpts {
  importObjStoreContents?: boolean
  updateAttachmentColumns?: boolean
  password?: string
}

async function peek(input: Readable, length: number): Promise<Buffer> {
  const buffer = input.read(length)
  if (buffer) {
    input.unshift(buffer)
    return buffer
  }

  return new Promise((resolve, reject) => {
    input.once("readable", () => {
      const buffer = input.read(length)
      if (!buffer) {
        reject(new Error("Unable to read from stream"))
      } else {
        input.unshift(buffer)
        resolve(buffer)
      }
    })
  })
}

async function isGzip(input: Readable) {
  return (await peek(input, 2)).toString("hex") === "1f8b" // Gzip magic number
}
async function isTar(input: Readable) {
  const chunk = await peek(input, 262)
  const magic = chunk.toString("utf8", 257, 262)
  return magic === "ustar"
}

export async function importApp(
  appId: string,
  db: Database,
  input: Readable | string,
  opts: ImportOpts = {
    importObjStoreContents: true,
    updateAttachmentColumns: true,
  }
): Promise<void> {
  const prodAppId = dbCore.getProdAppID(appId)
  let dbImported = false

  if (typeof input === "string") {
    // if input is a string, assume it's a file path
    input = fs.createReadStream(input)
  }

  async function importDB(input: Readable) {
    const { ok } = await db.load(input)
    if (!ok) {
      throw new Error("Error loading database dump from template.")
    }
    if (opts.updateAttachmentColumns) {
      await updateAttachmentColumns(prodAppId, db)
    }
    await updateAutomations(prodAppId, db)
    dbImported = true
  }

  if (await isGzip(input)) {
    const gunzip = zlib.createGunzip()
    input.pipe(gunzip)
    // Propagate errors from input stream to gunzip
    input.on("error", err => {
      if (!gunzip.destroyed) {
        gunzip.destroy(err)
      }
    })
    // Gunzip errors will be caught when we try to use the stream
    input = gunzip
  }

  if (!(await isTar(input))) {
    if (opts.password) {
      const decryptStream = await encryption.decryptStream(input, opts.password)
      input.on("error", err => {
        if (!decryptStream.destroyed) {
          decryptStream.destroy(err)
        }
      })
      // Decrypt errors will be caught when we try to use the stream
      input = decryptStream
    }
    await importDB(input)
    return
  }

  const extract = tar.extract()
  input.pipe(extract)
  // Propagate errors from input stream to extract
  input.on("error", err => {
    if (!extract.destroyed) {
      extract.destroy(err)
    }
  })
  // Extract errors will be caught in the try-catch below

  try {
    for await (const entry of extract) {
      // Skip directories etc.
      if (
        entry.header.type !== "file" &&
        entry.header.type !== "contiguous-file"
      ) {
        entry.resume()
        continue
      }

      let filename = entry.header.name
      let readable: Readable = entry

      const isEncrypted = filename.endsWith(".enc")
      filename = isEncrypted ? filename.replace(/\.enc$/, "") : filename

      if (
        filename.startsWith(".") ||
        filename === GLOBAL_DB_EXPORT_FILE ||
        !opts.importObjStoreContents
      ) {
        readable.resume()
        continue
      }

      if (isEncrypted) {
        if (!opts.password) {
          throw new Error("Files are encrypted but no password provided")
        }
        const decryptedStream = await encryption.decryptStream(
          readable,
          opts.password
        )
        // Propagate errors from source stream
        readable.on("error", err => {
          if (!decryptedStream.destroyed) {
            decryptedStream.destroy(err)
          }
        })
        readable = decryptedStream
      }

      if (filename === DB_EXPORT_FILE) {
        await importDB(readable)
        continue
      }

      try {
        await objectStore.streamUpload({
          bucket: ObjectStoreBuckets.APPS,
          stream: readable,
          filename: join(prodAppId, filename),
        })
      } catch (uploadErr) {
        // Make sure to consume the stream to prevent backpressure
        readable.resume()
        throw uploadErr
      }
    }
  } catch (err) {
    // Ensure streams are properly cleaned up on error
    extract.destroy()
    throw err
  }

  if (!dbImported) {
    throw new Error(
      "App export does not appear to be valid - no DB file found."
    )
  }
}
