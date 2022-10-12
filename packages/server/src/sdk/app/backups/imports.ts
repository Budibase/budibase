import { db as dbCore } from "@budibase/backend-core"
import { TABLE_ROW_PREFIX } from "../../../db/utils"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import {
  DB_EXPORT_FILE,
  ATTACHMENT_DIR,
  GLOBAL_DB_EXPORT_FILE,
} from "./constants"
import { uploadDirectory } from "../../../utilities/fileSystem/utilities"
import { ObjectStoreBuckets, FieldTypes } from "../../../constants"
import { join } from "path"
import fs from "fs"
import sdk from "../../"
import { CouchFindOptions, RowAttachment } from "@budibase/types"
const uuid = require("uuid/v4")
const tar = require("tar")

type TemplateType = {
  file?: {
    type: string
    path: string
  }
  key?: string
}

async function updateAttachmentColumns(
  prodAppId: string,
  db: PouchDB.Database
) {
  // iterate through attachment documents and update them
  const tables = await sdk.tables.getAllInternalTables(db)
  for (let table of tables) {
    const attachmentCols: string[] = []
    for (let [key, column] of Object.entries(table.schema)) {
      if (column.type === FieldTypes.ATTACHMENT) {
        attachmentCols.push(key)
      }
    }
    // no attachment columns, nothing to do
    if (attachmentCols.length === 0) {
      continue
    }
    // use the CouchDB Mango query API to lookup rows that have attachments
    const params: CouchFindOptions = {
      selector: {
        _id: {
          $regex: `^${TABLE_ROW_PREFIX}`,
        },
      },
    }
    attachmentCols.forEach(col => (params.selector[col] = { $exists: true }))
    const { rows } = await dbCore.directCouchFind(db.name, params)
    for (let row of rows) {
      for (let column of attachmentCols) {
        if (!Array.isArray(row[column])) {
          continue
        }
        row[column] = row[column].map((attachment: RowAttachment) => {
          // URL looks like: /prod-budi-app-assets/appId/attachments/file.csv
          const urlParts = attachment.url.split("/")
          // drop the first empty element
          urlParts.shift()
          // get the prefix
          const prefix = urlParts.shift()
          // remove the app ID
          urlParts.shift()
          // add new app ID
          urlParts.unshift(prodAppId)
          const key = urlParts.join("/")
          return {
            ...attachment,
            key,
            url: `/${prefix}/${key}`,
          }
        })
      }
    }
    // write back the updated attachments
    await db.bulkDocs(rows)
  }
}

/**
 * This function manages temporary template files which are stored by Koa.
 * @param {Object} template The template object retrieved from the Koa context object.
 * @returns {Object} Returns a fs read stream which can be loaded into the database.
 */
async function getTemplateStream(template: TemplateType) {
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else if (template.key) {
    const [type, name] = template.key.split("/")
    const tmpPath = await exports.downloadTemplate(type, name)
    return fs.createReadStream(join(tmpPath, name, "db", "dump.txt"))
  }
}

export function untarFile(file: { path: string }) {
  const tmpPath = join(budibaseTempDir(), uuid())
  fs.mkdirSync(tmpPath)
  // extract the tarball
  tar.extract({
    sync: true,
    cwd: tmpPath,
    file: file.path,
  })
  return tmpPath
}

export function getGlobalDBFile(tmpPath: string) {
  return fs.readFileSync(join(tmpPath, GLOBAL_DB_EXPORT_FILE), "utf8")
}

export async function importApp(
  appId: string,
  db: PouchDB.Database,
  template: TemplateType
) {
  let prodAppId = dbCore.getProdAppID(appId)
  let dbStream: any
  const isTar = template.file && template.file.type === "application/gzip"
  const isDirectory =
    template.file && fs.lstatSync(template.file.path).isDirectory()
  if (template.file && (isTar || isDirectory)) {
    const tmpPath = isTar ? untarFile(template.file) : template.file.path
    const attachmentPath = join(tmpPath, ATTACHMENT_DIR)
    // have to handle object import
    if (fs.existsSync(attachmentPath)) {
      await uploadDirectory(
        ObjectStoreBuckets.APPS,
        attachmentPath,
        join(prodAppId, ATTACHMENT_DIR)
      )
    }
    dbStream = fs.createReadStream(join(tmpPath, DB_EXPORT_FILE))
  } else {
    dbStream = await getTemplateStream(template)
  }
  // @ts-ignore
  const { ok } = await db.load(dbStream)
  if (!ok) {
    throw "Error loading database dump from template."
  }
  await updateAttachmentColumns(prodAppId, db)
  return ok
}
