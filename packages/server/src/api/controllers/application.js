const CouchDB = require("../../db")
const { getPackageForBuilder, buildPage } = require("../../utilities/builder")
const env = require("../../environment")
const { copy, existsSync, readFile, writeFile } = require("fs-extra")
const { budibaseAppsDir } = require("../../utilities/budibaseDir")
const sqrl = require("squirrelly")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const fs = require("fs-extra")
const { join, resolve } = require("../../utilities/centralPath")
const { promisify } = require("util")
const chmodr = require("chmodr")
const packageJson = require("../../../package.json")
const { createLinkView } = require("../../db/linkedRows")
const { downloadTemplate } = require("../../utilities/templates")
const { generateAppID, DocumentTypes, SEPARATOR } = require("../../db/utils")
const {
  downloadExtractComponentLibraries,
} = require("../../utilities/createAppPackage")
const APP_PREFIX = DocumentTypes.APP + SEPARATOR

async function createInstance(template) {
  const instanceId = generateAppID()

  const db = new CouchDB(instanceId)
  await db.put({
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  })
  // add view for linked rows
  await createLinkView(instanceId)

  // replicate the template data to the instance DB
  if (template) {
    const templatePath = await downloadTemplate(...template.key.split("/"))
    const dbDumpReadStream = fs.createReadStream(
      join(templatePath, "db", "dump.txt")
    )
    const { ok } = await db.load(dbDumpReadStream)
    if (!ok) {
      throw "Error loading database dump from template."
    }
  }

  return { _id: instanceId }
}

exports.fetch = async function(ctx) {
  let allDbs = await CouchDB.allDbs()
  const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))
  const apps = []
  for (let dbName of appDbNames) {
    const db = new CouchDB(dbName)
    apps.push(db.get(dbName))
  }
  if (apps.length === 0) {
    ctx.body = []
  } else {
    ctx.body = await Promise.all(apps)
  }
}

exports.fetchAppPackage = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const application = await db.get(ctx.params.instanceId)
  ctx.body = await getPackageForBuilder(ctx.config, application)
  setBuilderToken(ctx, ctx.params.instanceId, application.version)
}

exports.create = async function(ctx) {
  const instance = await createInstance(ctx.request.body.template)
  const instanceId = instance._id
  const newApplication = {
    _id: instanceId,
    type: "app",
    userInstanceMap: {},
    version: packageJson.version,
    componentLibraries: ["@budibase/standard-components"],
    name: ctx.request.body.name,
    template: ctx.request.body.template,
    instance: instance,
  }
  const instanceDb = new CouchDB(instanceId)
  await instanceDb.put(newApplication)

  if (env.NODE_ENV !== "jest") {
    const newAppFolder = await createEmptyAppPackage(ctx, newApplication)
    await downloadExtractComponentLibraries(newAppFolder)
  }

  ctx.status = 200
  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const application = await db.get(ctx.params.instanceId)

  const data = ctx.request.body
  const newData = { ...application, ...data }

  const response = await db.put(newData)
  data._rev = response.rev

  ctx.status = 200
  ctx.message = `Application ${application.name} updated successfully.`
  ctx.body = response
}

exports.delete = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const app = await db.get(ctx.params.instanceId)
  const result = await db.destroy()

  // remove top level directory
  await fs.rmdir(join(budibaseAppsDir(), ctx.params.instanceId), {
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

  if (existsSync(newAppFolder)) {
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

  // if this app is being created from a template,
  // copy the frontend page definition files from
  // the template directory.
  if (app.template) {
    const templatePageDefinitions = join(
      appsFolder,
      "templates",
      app.template.key,
      "pages"
    )
    await copy(templatePageDefinitions, join(appsFolder, app._id, "pages"))
  }

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
