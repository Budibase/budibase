const env = require("../../environment")
const { getAllApps } = require("@budibase/auth/db")
const CouchDB = require("../../db")
const {
  exportDB,
  sendTempFile,
  readFileSync,
} = require("../../utilities/fileSystem")
const { getGlobalDBName, getGlobalDB } = require("@budibase/auth/tenancy")
const { create } = require("./application")

async function createApp(appName, appImport) {
  const ctx = {
    request: {
      body: {
        templateString: appImport,
        name: appName,
      },
    },
  }
  return create(ctx)
}

exports.exportApps = async ctx => {
  if (env.SELF_HOSTED || !env.MULTI_TENANCY) {
    ctx.throw(400, "Exporting only allowed in multi-tenant cloud environments.")
  }
  const apps = await getAllApps(CouchDB, { all: true })
  const globalDBString = await exportDB(getGlobalDBName())
  let allDBs = {
    global: globalDBString,
  }
  for (let app of apps) {
    allDBs[app.name] = await exportDB(app._id)
  }
  const filename = `cloud-export-${new Date().getTime()}.txt`
  ctx.attachment(filename)
  ctx.body = sendTempFile(JSON.stringify(allDBs))
}

exports.importApps = async ctx => {
  if (!env.SELF_HOSTED || env.MULTI_TENANCY) {
    ctx.throw(400, "Importing only allowed in self hosted environments.")
  }
  const apps = await getAllApps(CouchDB, { all: true })
  if (
    apps.length !== 0 ||
    !ctx.request.files ||
    !ctx.request.files.importFile
  ) {
    ctx.throw(
      400,
      "Import file is required and environment must be fresh to import apps."
    )
  }
  const importFile = ctx.request.files.importFile
  const importString = readFileSync(importFile.file.path)
  const dbs = JSON.parse(importString)
  const globalDb = dbs.global
  const db = getGlobalDB()
  // load the global db first
  await db.load(globalDb)
  for (let [appName, appImport] of Object.values(dbs)) {
    await createApp(appName, appImport)
  }
  ctx.body = {
    message: "Apps successfully imported.",
  }
}
