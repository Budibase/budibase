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
import { DB_EXPORT_FILE, GLOBAL_DB_EXPORT_FILE } from "./constants"
import { ObjectStoreBuckets } from "../../../constants"
import { join } from "path"
import fs from "fs"
import sdk from "../../"
import tar from "tar-stream"
import zlib from "zlib"
import { Readable, PassThrough } from "stream"
import { isGzip, isTar } from "../../../utilities/fileSystem"

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

export interface ImportOpts {
  importObjStoreContents?: boolean
  updateAttachmentColumns?: boolean
  password?: string
}

class Importer {
  private appId: string
  private prodAppId: string
  private db: Database
  private opts: ImportOpts
  private dbImported: boolean

  constructor(
    appId: string,
    db: Database,
    opts: ImportOpts = {
      importObjStoreContents: true,
      updateAttachmentColumns: true,
    }
  ) {
    this.appId = appId
    this.prodAppId = dbCore.getProdAppID(appId)
    this.db = db
    this.opts = opts || {}
    this.dbImported = false
  }

  async importDB(input: Readable) {
    const { ok } = await this.db.load(input)
    if (!ok) {
      throw new Error("Error loading database dump from template.")
    }
    if (this.opts.updateAttachmentColumns) {
      await updateAttachmentColumns(this.prodAppId, this.db)
    }
    await updateAutomations(this.prodAppId, this.db)
    this.dbImported = true
  }

  async decryptStream(stream: Readable) {
    if (!this.opts.password) {
      throw new Error("Files are encrypted but no password provided")
    }
    const decryptedStream = await encryption.decryptStream(
      stream,
      this.opts.password
    )

    // Propagate errors from source stream
    stream.on("error", err => {
      if (!decryptedStream.destroyed) {
        decryptedStream.destroy(err)
      }
    })
    return decryptedStream
  }

  async run(input: Readable) {
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
      return await this.importDB(
        this.opts.password ? await this.decryptStream(input) : input
      )
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
          filename !== DB_EXPORT_FILE &&
          (filename.startsWith(".") ||
            filename === GLOBAL_DB_EXPORT_FILE ||
            !this.opts.importObjStoreContents)
        ) {
          readable.resume()
          continue
        }

        if (isEncrypted) {
          readable = await this.decryptStream(readable)
        } else {
          // Convert to a proper PassThrough stream for AWS SDK compatibility
          const passthroughStream = new PassThrough()
          readable.pipe(passthroughStream)
          readable = passthroughStream
        }

        try {
          if (filename === DB_EXPORT_FILE) {
            await this.importDB(readable)
          } else {
            await objectStore.streamUpload({
              bucket: ObjectStoreBuckets.APPS,
              stream: readable,
              filename: join(this.prodAppId, filename),
            })
          }
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

    if (!this.dbImported) {
      throw new Error(
        "App export does not appear to be valid - no DB file found."
      )
    }
  }
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
  if (typeof input === "string") {
    // if input is a string, assume it's a file path
    input = fs.createReadStream(input)
  }
  const importer = new Importer(appId, db, opts)
  await importer.run(input)
}
