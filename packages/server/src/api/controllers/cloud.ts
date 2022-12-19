import env from "../../environment"
import { db as dbCore, tenancy } from "@budibase/backend-core"
import { streamFile } from "../../utilities/fileSystem"
import { stringToReadStream } from "../../utilities"
import { getDocParams, DocumentType, isDevAppID } from "../../db/utils"
import { create } from "./application"
import { join } from "path"
import { App, BBContext, Database } from "@budibase/types"
import sdk from "../../sdk"

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
  // @ts-ignore
  return create(ctx)
}

async function getAllDocType(db: Database, docType: string) {
  const response = await db.allDocs(
    getDocParams(docType, null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

export async function exportApps(ctx: BBContext) {
  if (env.SELF_HOSTED || !env.MULTI_TENANCY) {
    ctx.throw(400, "Exporting only allowed in multi-tenant cloud environments.")
  }
  const apps = (await dbCore.getAllApps({ all: true })) as App[]
  const globalDBString = await sdk.backups.exportDB(dbCore.getGlobalDBName(), {
    filter: (doc: any) => !doc._id.startsWith(DocumentType.USER),
  })
  // only export the dev apps as they will be the latest, the user can republish the apps
  // in their self-hosted environment
  let appMetadata = apps
    .filter((app: App) => isDevAppID(app.appId || app._id))
    .map((app: App) => ({ appId: (app.appId || app._id)!, name: app.name }))
  const tmpPath = await sdk.backups.exportMultipleApps(
    appMetadata,
    globalDBString
  )
  const filename = `cloud-export-${new Date().getTime()}.tar.gz`
  ctx.attachment(filename)
  ctx.body = streamFile(tmpPath)
}

async function checkHasBeenImported() {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    return true
  }
  const apps = await dbCore.getAllApps({ all: true })
  return apps.length !== 0
}

export async function hasBeenImported(ctx: BBContext) {
  ctx.body = {
    imported: await checkHasBeenImported(),
  }
}

export async function importApps(ctx: BBContext) {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    ctx.throw(400, "Importing only allowed in self hosted environments.")
  }
  const beenImported = await checkHasBeenImported()
  if (beenImported || !ctx.request.files || !ctx.request.files.importFile) {
    ctx.throw(
      400,
      "Import file is required and environment must be fresh to import apps."
    )
  }
  if (ctx.request.files.importFile.type !== "application/gzip") {
    ctx.throw(400, "Import file must be a gzipped tarball.")
  }

  // initially get all the app databases out of the tarball
  const tmpPath = sdk.backups.untarFile(ctx.request.files.importFile)
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
