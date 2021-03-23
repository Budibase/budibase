const CouchDB = require("../../db")
const env = require("../../environment")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const packageJson = require("../../../package.json")
const { createLinkView } = require("../../db/linkedRows")
const { createRoutingView } = require("../../utilities/routing")
const {
  getTemplateStream,
  createApp,
  deleteApp,
} = require("../../utilities/fileSystem")
const {
  generateAppID,
  getLayoutParams,
  getScreenParams,
  generateScreenID,
} = require("../../db/utils")
const {
  BUILTIN_ROLE_IDS,
  AccessController,
} = require("../../utilities/security/roles")
const { BASE_LAYOUTS } = require("../../constants/layouts")
const {
  createHomeScreen,
  createLoginScreen,
} = require("../../constants/screens")
const { cloneDeep } = require("lodash/fp")
const { processObject } = require("@budibase/string-templates")
const { getAllApps } = require("../../utilities")
const { USERS_TABLE_SCHEMA } = require("../../constants")
const {
  getDeployedApps,
  getHostingInfo,
  HostingTypes,
} = require("../../utilities/builder/hosting")

const URL_REGEX_SLASH = /\/|\\/g

// utility function, need to do away with this
async function getLayouts(db) {
  return (
    await db.allDocs(
      getLayoutParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
}

async function getScreens(db) {
  return (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
}

function getUserRoleId(ctx) {
  return !ctx.user.role || !ctx.user.role._id
    ? BUILTIN_ROLE_IDS.PUBLIC
    : ctx.user.role._id
}

async function getAppUrlIfNotInUse(ctx) {
  let url
  if (ctx.request.body.url) {
    url = encodeURI(ctx.request.body.url)
  } else {
    url = encodeURI(`${ctx.request.body.name}`)
  }
  url = `/${url.replace(URL_REGEX_SLASH, "")}`.toLowerCase()
  const hostingInfo = await getHostingInfo()
  if (hostingInfo.type === HostingTypes.CLOUD) {
    return url
  }
  const deployedApps = await getDeployedApps()
  if (
    deployedApps[url] != null &&
    deployedApps[url].appId !== ctx.params.appId
  ) {
    ctx.throw(400, "App name/URL is already in use.")
  }
  return url
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
  // this is currently very hard to test, downloading and importing template files
  /* istanbul ignore next */
  if (template && template.useTemplate === "true") {
    const { ok } = await db.load(await getTemplateStream(template))
    if (!ok) {
      throw "Error loading database dump from template."
    }
  } else {
    // create the users table
    await db.put(USERS_TABLE_SCHEMA)
  }

  return { _id: appId }
}

exports.fetch = async function(ctx) {
  ctx.body = await getAllApps()
}

exports.fetchAppDefinition = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  const layouts = await getLayouts(db)
  const userRoleId = getUserRoleId(ctx)
  const accessController = new AccessController(ctx.params.appId)
  const screens = await accessController.checkScreensAccess(
    await getScreens(db),
    userRoleId
  )
  ctx.body = {
    layouts,
    screens,
    libraries: ["@budibase/standard-components"],
  }
}

exports.fetchAppPackage = async function(ctx) {
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(ctx.params.appId)
  const [layouts, screens] = await Promise.all([getLayouts(db), getScreens(db)])

  ctx.body = {
    application,
    screens,
    layouts,
  }
  await setBuilderToken(ctx, ctx.params.appId, application.version)
}

exports.create = async function(ctx) {
  const { useTemplate, templateKey } = ctx.request.body
  const instanceConfig = {
    useTemplate,
    key: templateKey,
  }
  if (ctx.request.files && ctx.request.files.templateFile) {
    instanceConfig.file = ctx.request.files.templateFile
  }
  const instance = await createInstance(instanceConfig)

  const url = await getAppUrlIfNotInUse(ctx)
  const appId = instance._id
  const version = packageJson.version
  const newApplication = {
    _id: appId,
    type: "app",
    version: packageJson.version,
    componentLibraries: ["@budibase/standard-components"],
    name: ctx.request.body.name,
    url: url,
    template: ctx.request.body.template,
    instance: instance,
    deployment: {
      type: "cloud",
    },
  }
  const instanceDb = new CouchDB(appId)
  await instanceDb.put(newApplication)

  await createEmptyAppPackage(ctx, newApplication)
  /* istanbul ignore next */
  if (env.NODE_ENV !== "jest") {
    await createApp(appId)
  }

  await setBuilderToken(ctx, appId, version)
  ctx.status = 200
  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}

exports.update = async function(ctx) {
  const url = await getAppUrlIfNotInUse(ctx)
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(ctx.params.appId)

  const data = ctx.request.body
  const newData = { ...application, ...data, url }

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

  if (env.NODE_ENV !== "jest") {
    await deleteApp(ctx.params.appId)
  }

  ctx.status = 200
  ctx.message = `Application ${app.name} deleted successfully.`
  ctx.body = result
}

const createEmptyAppPackage = async (ctx, app) => {
  const db = new CouchDB(app._id)

  let screensAndLayouts = []
  for (let layout of BASE_LAYOUTS) {
    const cloned = cloneDeep(layout)
    screensAndLayouts.push(await processObject(cloned, app))
  }

  const homeScreen = createHomeScreen(app)
  homeScreen._id = generateScreenID()
  screensAndLayouts.push(homeScreen)

  const loginScreen = createLoginScreen(app)
  loginScreen._id = generateScreenID()
  screensAndLayouts.push(loginScreen)

  await db.bulkDocs(screensAndLayouts)
}
