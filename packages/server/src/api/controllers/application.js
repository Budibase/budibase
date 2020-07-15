const CouchDB = require("../../db")
const ClientDb = require("../../db/clientDb")
const { getPackageForBuilder, buildPage } = require("../../utilities/builder")
const newid = require("../../db/newid")
const env = require("../../environment")
const instanceController = require("./instance")
const { resolve, join } = require("path")
const { copy, exists, readFile, writeFile } = require("fs-extra")
const { budibaseAppsDir } = require("../../utilities/budibaseDir")
const sqrl = require("squirrelly")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const fs = require("fs-extra")
const { promisify } = require("util")
const chmodr = require("chmodr")
const {
  downloadExtractComponentLibraries,
} = require("../../utilities/createAppPackage")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ClientDb.name(getClientId(ctx)))
  const body = await db.query("client/by_type", {
    include_docs: true,
    key: ["app"],
  })

  ctx.body = body.rows.map(row => row.doc)
}

exports.fetchAppPackage = async function(ctx) {
  const clientId = await lookupClientId(ctx.params.applicationId)
  const db = new CouchDB(ClientDb.name(clientId))
  const application = await db.get(ctx.params.applicationId)
  ctx.body = await getPackageForBuilder(ctx.config, application)
  /* 
  instance is hardcoded now - this can only change when we move
  pages and screens into the database 
  */
  const devInstance = application.instances.find(
    i => i.name === `dev-${clientId}`
  )
  setBuilderToken(ctx, ctx.params.applicationId, devInstance._id)
}

exports.create = async function(ctx) {
  const clientId =
    (ctx.request.body && ctx.request.body.clientId) || env.CLIENT_ID

  if (!clientId) {
    ctx.throw(400, "ClientId not suplied")
  }
  const appId = newid()
  // insert an appId -> clientId lookup
  const masterDb = new CouchDB("client_app_lookup")

  await masterDb.put({
    _id: appId,
    clientId,
  })

  const db = new CouchDB(ClientDb.name(clientId))

  const newApplication = {
    _id: appId,
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

  const { rev } = await db.put(newApplication)
  newApplication._rev = rev
  const createInstCtx = {
    user: {
      appId: newApplication._id,
    },
    request: {
      body: { name: `dev-${clientId}` },
    },
  }
  await instanceController.create(createInstCtx)
  newApplication.instances.push(createInstCtx.body)

  if (process.env.NODE_ENV !== "jest") {
    const newAppFolder = await createEmptyAppPackage(ctx, newApplication)
    await downloadExtractComponentLibraries(newAppFolder)
  }

  ctx.status = 200
  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}

exports.update = async function(ctx) {
  const clientId = await lookupClientId(ctx.params.applicationId)
  const db = new CouchDB(ClientDb.name(clientId))
  const application = await db.get(ctx.params.applicationId)

  const data = ctx.request.body
  const newData = { ...application, ...data }

  const response = await db.put(newData)
  data._rev = response.rev

  ctx.status = 200
  ctx.message = `Application ${application.name} updated successfully.`
  ctx.body = response
}

exports.delete = async function(ctx) {
  const db = new CouchDB(ClientDb.name(getClientId(ctx)))
  const app = await db.get(ctx.params.applicationId)
  const result = await db.remove(app)
  await fs.rmdir(`${budibaseAppsDir()}/${ctx.params.applicationId}`, {
    recursive: true,
  })

  ctx.status = 200
  ctx.message = `Application ${app.name} deleted successfully.`
  ctx.body = result
}

const createEmptyAppPackage = async (ctx, app) => {
  const templateFolder = resolve(
    __dirname,
    "..",
    "..",
    "utilities",
    "appDirectoryTemplate"
  )

  const appsFolder = budibaseAppsDir()
  const newAppFolder = resolve(appsFolder, app._id)

  if (await exists(newAppFolder)) {
    ctx.throw(400, "App folder already exists for this application")
  }

  await fs.ensureDir(join(newAppFolder, "pages", "main", "screens"), 0o777)
  await fs.ensureDir(
    join(newAppFolder, "pages", "unauthenticated", "screens"),
    0o777
  )

  await copy(templateFolder, newAppFolder)

  // this line allows full permission on copied files
  // we have an unknown problem without this, whereby the
  // files get weird permissions and cant be written to :(
  const chmodrPromise = promisify(chmodr)
  await chmodrPromise(newAppFolder, 0o777)

  await updateJsonFile(join(appsFolder, app._id, "package.json"), {
    name: npmFriendlyAppName(app.name),
  })

  const mainJson = await updateJsonFile(
    join(appsFolder, app._id, "pages", "main", "page.json"),
    app
  )

  await buildPage(ctx.config, app._id, "main", {
    page: mainJson,
    screens: await loadScreens(newAppFolder, "main"),
  })

  const unauthenticatedJson = await updateJsonFile(
    join(appsFolder, app._id, "pages", "unauthenticated", "page.json"),
    app
  )

  await buildPage(ctx.config, app._id, "unauthenticated", {
    page: unauthenticatedJson,
    screens: await loadScreens(newAppFolder, "unauthenticated"),
  })

  return newAppFolder
}

const loadScreens = async (appFolder, page) => {
  const screensFolder = join(appFolder, "pages", page, "screens")

  const screenFiles = (await fs.readdir(screensFolder)).filter(s =>
    s.endsWith(".json")
  )

  let screens = []
  for (let file of screenFiles) {
    screens.push(await fs.readJSON(join(screensFolder, file)))
  }
  return screens
}

const lookupClientId = async appId => {
  const masterDb = new CouchDB("client_app_lookup")
  const { clientId } = await masterDb.get(appId)
  return clientId
}

const getClientId = ctx => {
  const clientId =
    (ctx.request.body && ctx.request.body.clientId) ||
    (ctx.query && ctx.query.clientId) ||
    env.CLIENT_ID

  if (!clientId) {
    ctx.throw(400, "ClientId not suplied")
  }
  return clientId
}

const updateJsonFile = async (filePath, app) => {
  const json = await readFile(filePath, "utf8")
  const newJson = sqrl.Render(json, app)
  await writeFile(filePath, newJson, "utf8")
  return JSON.parse(newJson)
}

const npmFriendlyAppName = name =>
  name
    .replace(/_/g, "")
    .replace(/./g, "")
    .replace(/ /g, "")
    .toLowerCase()
