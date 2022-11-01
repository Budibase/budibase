import env from "../../environment"
import { db, tenancy } from "@budibase/backend-core"
import { streamFile } from "../../utilities/fileSystem"
import { stringToReadStream } from "../../utilities"
import { getDocParams, DocumentType, isDevAppID } from "../../db/utils"
import { create } from "./application"
import { join } from "path"
import sdk from "../../sdk"
import { Ctx } from "@budibase/types"

async function createApp(appName: string, appDirectory: string) {
  const ctx = {
    request: {
      body: {
        useTemplate: true,
        name: appName,
      },
      files: {
        templateFile: {
          path: appDirectory,
        },
      },
    },
  }
  return create(ctx)
}

async function getAllDocType(db: any, docType: any) {
  const response = await db.allDocs(
    getDocParams(docType, null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const exportApps = async (ctx: Ctx) => {
  if (env.SELF_HOSTED || !env.MULTI_TENANCY) {
    ctx.throw(400, "Exporting only allowed in multi-tenant cloud environments.")
  }
  const apps = await db.getAllApps({ all: true })
  const globalDBString = await sdk.backups.exportDB(db.getGlobalDBName(), {
    filter: (doc: any) => !doc._id.startsWith(DocumentType.USER),
  })
  // only export the dev apps as they will be the latest, the user can republish the apps
  // in their self-hosted environment
  let appMetadata = apps
    .filter(app => isDevAppID(app.appId || app._id))
    .map(app => ({ appId: app.appId || app._id, name: app.name }))
  const tmpPath = await sdk.backups.exportMultipleApps(
    appMetadata,
    globalDBString
  )
  const filename = `cloud-export-${new Date().getTime()}.tar.gz`
  ctx.attachment(filename)
  ctx.body = streamFile(tmpPath)
}

async function _hasBeenImported() {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    return true
  }
  const apps = await db.getAllApps({ all: true })
  return apps.length !== 0
}

export const hasBeenImported = async (ctx: Ctx) => {
  ctx.body = {
    imported: await _hasBeenImported(),
  }
}

export const importApps = async (ctx: Ctx) => {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    ctx.throw(400, "Importing only allowed in self hosted environments.")
  }
  const beenImported = await _hasBeenImported()
  if (beenImported || !ctx.request.files || !ctx.request.files.importFile) {
    ctx.throw(
      400,
      "Import file is required and environment must be fresh to import apps."
    )
  }
  const file = ctx.request.files.importFile
  if (Array.isArray(file)) {
    ctx.throw(400, "Single file is required")
  }
  if (file.type !== "application/gzip") {
    ctx.throw(400, "Import file must be a gzipped tarball.")
  }

  // initially get all the app databases out of the tarball
  const tmpPath = sdk.backups.untarFile(file)
  const globalDbImport = sdk.backups.getGlobalDBFile(tmpPath)
  const appNames = sdk.backups.getListOfAppsInMulti(tmpPath)

  const globalDb = tenancy.getGlobalDB()
  // load the global db first
  await globalDb.load(stringToReadStream(globalDbImport))
  for (let appName of appNames) {
    await createApp(appName, join(tmpPath, appName))
  }

  // if there are any users make sure to remove them
  let users = await getAllDocType(globalDb, DocumentType.USER)
  let userDeletionPromises = []
  for (let user of users) {
    userDeletionPromises.push(globalDb.remove(user._id, user._rev))
  }
  if (userDeletionPromises.length > 0) {
    await Promise.all(userDeletionPromises)
  }

  await globalDb.bulkDocs(users)
  ctx.body = {
    message: "Apps successfully imported.",
  }
}
