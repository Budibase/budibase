const CouchDB = require("../../db")
const ClientDb = require("../../db/clientDb")
const { getPackageForBuilder } = require("../../utilities/builder")
const newid = require("../../db/newid")
const env = require("../../environment")
const instanceController = require("./instance")
const { resolve, join } = require("path")
const { copy, readJSON, writeJSON, exists } = require("fs-extra")
const { exec } = require("child_process")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))
  const body = await db.query("client/by_type", {
    include_docs: true,
    key: ["app"],
  })

  ctx.body = body.rows.map(row => row.doc)
}

exports.fetchAppPackage = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))
  const application = await db.get(ctx.params.applicationId)
  ctx.body = await getPackageForBuilder(ctx.config, application)
}

exports.create = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))

  const newApplication = {
    _id: newid(),
    type: "app",
    instances: [],
    userInstanceMap: {},
    componentLibraries: [
      "@budibase/standard-components",
      "@budibase/materialdesign-components",
    ],
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  }

  const { rev } = await db.post(newApplication)
  newApplication._rev = rev

  const createInstCtx = {
    params: {
      clientId: env.CLIENT_ID,
      applicationId: newApplication._id,
    },
    request: {
      body: { name: `dev-${env.CLIENT_ID}` },
    },
  }
  await instanceController.create(createInstCtx)

  if (ctx.isDev) {
    const newAppFolder = await createEmptyAppPackage(ctx, newApplication)
    await runNpmInstall(newAppFolder)
  }

  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}

const createEmptyAppPackage = async (ctx, app) => {
  const templateFolder = resolve(
    __dirname,
    "..",
    "..",
    "utilities",
    "appDirectoryTemplate"
  )

  const appsFolder = env.BUDIBASE_DIR
  const newAppFolder = resolve(appsFolder, app._id)

  if (await exists(newAppFolder)) {
    ctx.throw(400, "App folder already exists for this application")
    return
  }

  await copy(templateFolder, newAppFolder)

  const packageJsonPath = join(appsFolder, app._id, "package.json")
  const packageJson = await readJSON(packageJsonPath)

  packageJson.name = npmFriendlyAppName(app.name)

  await writeJSON(packageJsonPath, packageJson)

  return newAppFolder
}

const runNpmInstall = async newAppFolder => {
  return new Promise((resolve, reject) => {
    const cmd = `cd ${newAppFolder} && npm install`
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

const npmFriendlyAppName = name =>
  name
    .replace(/_/g, "")
    .replace(/./g, "")
    .replace(/ /g, "")
    .toLowerCase()
