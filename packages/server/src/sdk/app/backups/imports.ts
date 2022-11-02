import { db as dbCore } from "@budibase/backend-core"
import { getAutomationParams, TABLE_ROW_PREFIX } from "../../../db/utils"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { DB_EXPORT_FILE, GLOBAL_DB_EXPORT_FILE } from "./constants"
import {
  upload,
  uploadDirectory,
} from "../../../utilities/fileSystem/utilities"
import { downloadTemplate } from "../../../utilities/fileSystem"
import { FieldTypes, ObjectStoreBuckets } from "../../../constants"
import { join } from "path"
import fs from "fs"
import sdk from "../../"
import {
  Automation,
  AutomationTriggerStepId,
  CouchFindOptions,
  RowAttachment,
} from "@budibase/types"
import PouchDB from "pouchdb"
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

async function updateAutomations(prodAppId: string, db: PouchDB.Database) {
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
      automation.definition.trigger.stepId === AutomationTriggerStepId.WEBHOOK
    ) {
      const old = automation.definition.trigger.inputs
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

/**
 * This function manages temporary template files which are stored by Koa.
 * @param {Object} template The template object retrieved from the Koa context object.
 * @returns {Object} Returns a fs read stream which can be loaded into the database.
 */
async function getTemplateStream(template: TemplateType) {
  if (template.file && template.file.type !== "text/plain") {
    throw new Error("Cannot import a non-text based file.")
  }
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else if (template.key) {
    const [type, name] = template.key.split("/")
    const tmpPath = await downloadTemplate(type, name)
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

export function getListOfAppsInMulti(tmpPath: string) {
  return fs.readdirSync(tmpPath).filter(dir => dir !== GLOBAL_DB_EXPORT_FILE)
}

export async function importApp(
  appId: string,
  db: PouchDB.Database,
  template: TemplateType
) {
  let prodAppId = dbCore.getProdAppID(appId)
  let dbStream: any
  const isTar = template.file && template?.file?.type?.endsWith("gzip")
  const isDirectory =
    template.file && fs.lstatSync(template.file.path).isDirectory()
  if (template.file && (isTar || isDirectory)) {
    const tmpPath = isTar ? untarFile(template.file) : template.file.path
    const contents = fs.readdirSync(tmpPath)
    // have to handle object import
    if (contents.length) {
      let promises = []
      let excludedFiles = [GLOBAL_DB_EXPORT_FILE, DB_EXPORT_FILE]
      for (let filename of contents) {
        const path = join(tmpPath, filename)
        if (excludedFiles.includes(filename)) {
          continue
        }
        filename = join(prodAppId, filename)
        if (fs.lstatSync(path).isDirectory()) {
          promises.push(
            uploadDirectory(ObjectStoreBuckets.APPS, path, filename)
          )
        } else {
          promises.push(
            upload({
              bucket: ObjectStoreBuckets.APPS,
              path,
              filename,
            })
          )
        }
      }
      await Promise.all(promises)
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
  await updateAutomations(prodAppId, db)
  return ok
}
