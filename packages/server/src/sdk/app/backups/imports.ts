import { db as dbCore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { DB_EXPORT_FILE, ATTACHMENT_DIR } from "./constants"
import { uploadDirectory } from "../../../utilities/fileSystem/utilities"
import { ObjectStoreBuckets, FieldTypes } from "../../../constants"
import { join } from "path"
import fs from "fs"
import sdk from "../../"
import { CouchFindOptions, Row } from "@budibase/types"
const uuid = require("uuid/v4")
const tar = require("tar")

type TemplateType = {
  file?: {
    type: string
    path: string
  }
  key?: string
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

export async function importApp(
  appId: string,
  db: PouchDB.Database,
  template: TemplateType
) {
  let prodAppId = dbCore.getProdAppID(appId)
  let dbStream: any
  if (template.file && template.file.type === "application/gzip") {
    const tmpPath = join(budibaseTempDir(), uuid())
    fs.mkdirSync(tmpPath)
    // extract the tarball
    tar.extract({
      sync: true,
      cwd: tmpPath,
      file: template.file.path,
    })
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
    const params: CouchFindOptions = { selector: {} }
    attachmentCols.forEach(col => (params.selector[col] = { $exists: true }))
    const { rows } = await dbCore.directCouchFind(db.name, params)
    for (let row of rows) {
      // TODO:
    }
    // write back the updated attachments
    await db.bulkDocs(rows)
  }
  return ok
}
