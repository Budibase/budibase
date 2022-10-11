const env = require("../../environment")
const { getAllApps, getGlobalDBName } = require("@budibase/backend-core/db")
const { streamFile } = require("../../utilities/fileSystem")
const { DocumentType, isDevAppID } = require("../../db/utils")
const sdk = require("../../sdk")

exports.exportApps = async ctx => {
  if (env.SELF_HOSTED || !env.MULTI_TENANCY) {
    ctx.throw(400, "Exporting only allowed in multi-tenant cloud environments.")
  }
  const apps = await getAllApps({ all: true })
  const globalDBString = await sdk.apps.exports.exportDB(getGlobalDBName(), {
    filter: doc => !doc._id.startsWith(DocumentType.USER),
  })
  // only export the dev apps as they will be the latest, the user can republish the apps
  // in their self-hosted environment
  let appIds = apps
    .map(app => app.appId || app._id)
    .filter(appId => isDevAppID(appId))
  const tmpPath = await sdk.apps.exports.exportMultipleApps(
    appIds,
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

  // TODO: IMPLEMENT TARBALL EXTRACTION, APP IMPORT, ATTACHMENT IMPORT AND GLOBAL DB IMPORT
  // async function getAllDocType(db, docType) {
  //   const response = await db.allDocs(
  //     getDocParams(docType, null, {
  //       include_docs: true,
  //     })
  //   )
  //   return response.rows.map(row => row.doc)
  // }
  // async function createApp(appName, appImport) {
  //   const ctx = {
  //     request: {
  //       body: {
  //         templateString: appImport,
  //         name: appName,
  //       },
  //     },
  //   }
  //   return create(ctx)
  // }
  // const importFile = ctx.request.files.importFile
  // const importString = readFileSync(importFile.path)
  // const dbs = JSON.parse(importString)
  // const globalDbImport = dbs.global
  // // remove from the list of apps
  // delete dbs.global
  // const globalDb = getGlobalDB()
  // // load the global db first
  // await globalDb.load(stringToReadStream(globalDbImport))
  // for (let [appName, appImport] of Object.entries(dbs)) {
  //   await createApp(appName, appImport)
  // }
  //
  // // if there are any users make sure to remove them
  // let users = await getAllDocType(globalDb, DocumentType.USER)
  // let userDeletionPromises = []
  // for (let user of users) {
  //   userDeletionPromises.push(globalDb.remove(user._id, user._rev))
  // }
  // if (userDeletionPromises.length > 0) {
  //   await Promise.all(userDeletionPromises)
  // }
  //
  // await globalDb.bulkDocs(users)
  ctx.body = {
    message: "Apps successfully imported.",
  }
}
