import { db as dbCore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../utilities/budibaseDir"
import { DB_EXPORT_FILE, ATTACHMENT_DIR } from "./constants"
import { uploadDirectory } from "../../utilities/fileSystem/utilities"
import { ObjectStoreBuckets } from "../../constants"
import { join } from "path"
import fs from "fs"
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
  } else {
    // TODO: need to iterate over attachments and update their URLs
  }
  return ok
}
