const env = require("../../environment")
const { getAllApps, getGlobalDBName } = require("@budibase/backend-core/db")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { streamFile } = require("../../utilities/fileSystem")
const { stringToReadStream } = require("../../utilities")
const { getDocParams, DocumentType, isDevAppID } = require("../../db/utils")
const { create } = require("./application")
const { join } = require("path")
const sdk = require("../../sdk")

async function createApp(appName, appDirectory) {
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

async function getAllDocType(db, docType) {
  const response = await db.allDocs(
    getDocParams(docType, null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

exports.exportApps = async ctx => {
  if (env.SELF_HOSTED || !env.MULTI_TENANCY) {
    ctx.throw(400, "Exporting only allowed in multi-tenant cloud environments.")
  }
  const apps = await getAllApps({ all: true })
  const globalDBString = await sdk.backups.exportDB(getGlobalDBName(), {
    filter: doc => !doc._id.startsWith(DocumentType.USER),
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

async function hasBeenImported() {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    return true
  }
  const apps = await getAllApps({ all: true })
  return apps.length !== 0
}

exports.hasBeenImported = async ctx => {
  ctx.body = {
    imported: await hasBeenImported(),
  }
}

exports.importApps = async ctx => {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    ctx.throw(400, "Importing only allowed in self hosted environments.")
  }
  const beenImported = await hasBeenImported()
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

  const globalDb = getGlobalDB()
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
