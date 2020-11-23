const CouchDB = require("../../db")
const compileStaticAssetsForPage = require("../../utilities/builder/compileStaticAssetsForPage")
const env = require("../../environment")
const { existsSync } = require("fs-extra")
const { budibaseAppsDir } = require("../../utilities/budibaseDir")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const fs = require("fs-extra")
const { join, resolve } = require("../../utilities/centralPath")
const packageJson = require("../../../package.json")
const { createLinkView } = require("../../db/linkedRows")
const { createRoutingView } = require("../../utilities/routing")
const { downloadTemplate } = require("../../utilities/templates")
const {
  generateAppID,
  DocumentTypes,
  SEPARATOR,
  getPageParams,
  getScreenParams,
  generatePageID,
  generateScreenID,
} = require("../../db/utils")
const { BUILTIN_LEVEL_IDS } = require("../../utilities/security/accessLevels")
const {
  downloadExtractComponentLibraries,
} = require("../../utilities/createAppPackage")
const { MAIN, UNAUTHENTICATED, PageTypes } = require("../../constants/pages")
const { HOME_SCREEN } = require("../../constants/screens")
const { cloneDeep } = require("lodash/fp")

const APP_PREFIX = DocumentTypes.APP + SEPARATOR

// utility function, need to do away with this
async function getMainAndUnauthPage(db) {
  let pages = await db.allDocs(
    getPageParams(null, {
      include_docs: true,
    })
  )
  pages = pages.rows.map(row => row.doc)

  const mainPage = pages.find(page => page.name === PageTypes.MAIN)
  const unauthPage = pages.find(page => page.name === PageTypes.UNAUTHENTICATED)
  return { mainPage, unauthPage }
}

async function createInstance(template) {
  const appId = generateAppID()

  const db = new CouchDB(appId)
  await db.put({
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  })
  // add view for linked rows
  await createLinkView(appId)
  await createRoutingView(appId)

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

  return { _id: appId }
}

exports.fetch = async function(ctx) {
  let allDbs = await CouchDB.allDbs()
  const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))
  const apps = appDbNames.map(db => new CouchDB(db).get(db))
  if (apps.length === 0) {
    ctx.body = []
  } else {
    const response = await Promise.allSettled(apps)
    ctx.body = response.filter(result => result.status === "fulfilled")
  }
}

exports.fetchAppDefinition = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  // TODO: need to get rid of pages here, they shouldn't be needed anymore
  const { mainPage, unauthPage } = await getMainAndUnauthPage(db)
  const userAccessLevelId =
    !ctx.user.accessLevel || !ctx.user.accessLevel._id
      ? BUILTIN_LEVEL_IDS.PUBLIC
      : ctx.user.accessLevel._id
  const correctPage =
    userAccessLevelId === BUILTIN_LEVEL_IDS.PUBLIC ? unauthPage : mainPage
  const screens = (
    await db.allDocs(
      getScreenParams(correctPage._id, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  // TODO: need to handle access control here, limit screens to user access level
  ctx.body = {
    page: correctPage,
    screens: screens,
    libraries: ["@budibase/standard-components"],
  }
}

exports.fetchAppPackage = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(ctx.params.appId)

  const { mainPage, unauthPage } = await getMainAndUnauthPage(db)
  ctx.body = {
    application,
    pages: {
      main: mainPage,
      unauthenticated: unauthPage,
    },
  }

  await setBuilderToken(ctx, ctx.params.appId, application.version)
}

exports.create = async function(ctx) {
  const instance = await createInstance(ctx.request.body.template)
  const appId = instance._id
  const version = packageJson.version
  const newApplication = {
    _id: appId,
    type: "app",
    version: packageJson.version,
    componentLibraries: ["@budibase/standard-components"],
    name: ctx.request.body.name,
    template: ctx.request.body.template,
    instance: instance,
  }
  const instanceDb = new CouchDB(appId)
  await instanceDb.put(newApplication)

  if (env.NODE_ENV !== "jest") {
    const newAppFolder = await createEmptyAppPackage(ctx, newApplication)
    await downloadExtractComponentLibraries(newAppFolder)
  }

  await setBuilderToken(ctx, appId, version)
  ctx.status = 200
  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(ctx.params.appId)

  const data = ctx.request.body
  const newData = { ...application, ...data }

  const response = await db.put(newData)
  data._rev = response.rev

  ctx.status = 200
  ctx.message = `Application ${application.name} updated successfully.`
  ctx.body = response
}

exports.delete = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  const app = await db.get(ctx.params.appId)
  const result = await db.destroy()

  // remove top level directory
  await fs.rmdir(join(budibaseAppsDir(), ctx.params.appId), {
    recursive: true,
  })

  ctx.status = 200
  ctx.message = `Application ${app.name} deleted successfully.`
  ctx.body = result
}

const createEmptyAppPackage = async (ctx, app) => {
  const appsFolder = budibaseAppsDir()
  const newAppFolder = resolve(appsFolder, app._id)

  const db = new CouchDB(app._id)

  if (existsSync(newAppFolder)) {
    ctx.throw(400, "App folder already exists for this application")
  }

  fs.mkdirpSync(newAppFolder)

  const mainPage = cloneDeep(MAIN)
  mainPage._id = generatePageID()
  mainPage.title = app.name

  const unauthPage = cloneDeep(UNAUTHENTICATED)
  unauthPage._id = generatePageID()
  unauthPage.title = app.name
  unauthPage.props._children[0].title = `Log in to ${app.name}`

  const homeScreen = cloneDeep(HOME_SCREEN)
  homeScreen._id = generateScreenID(mainPage._id)
  await db.bulkDocs([mainPage, unauthPage, homeScreen])

  await compileStaticAssetsForPage(app._id, "main", {
    page: mainPage,
    screens: [homeScreen],
  })
  await compileStaticAssetsForPage(app._id, "unauthenticated", {
    page: unauthPage,
    screens: [],
  })

  return newAppFolder
}
