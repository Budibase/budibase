const CouchDB = require("../../db")
const env = require("../../environment")
const packageJson = require("../../../package.json")
const {
  createLinkView,
  createRoutingView,
  createAllSearchIndex,
} = require("../../db/views/staticViews")
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
  generateDevAppID,
  DocumentTypes,
  AppStatus,
} = require("../../db/utils")
const { BUILTIN_ROLE_IDS, AccessController } = require("@budibase/auth/roles")
const { BASE_LAYOUTS } = require("../../constants/layouts")
const { createHomeScreen } = require("../../constants/screens")
const { cloneDeep } = require("lodash/fp")
const { processObject } = require("@budibase/string-templates")
const { getAllApps } = require("../../utilities")
const { USERS_TABLE_SCHEMA } = require("../../constants")
const { getDeployedApps } = require("../../utilities/workerRequests")
const { clientLibraryPath } = require("../../utilities")
const { getAllLocks } = require("../../utilities/redis")

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
  if (!env.SELF_HOSTED) {
    return url
  }
  const deployedApps = await getDeployedApps(ctx)
  if (
    deployedApps[url] != null &&
    deployedApps[url].appId !== ctx.params.appId
  ) {
    ctx.throw(400, "App name/URL is already in use.")
  }
  return url
}

async function createInstance(template) {
  const baseAppId = generateAppID()
  const appId = generateDevAppID(baseAppId)

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
  await createAllSearchIndex(appId)

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

exports.fetch = async function (ctx) {
  const dev = ctx.query && ctx.query.status === AppStatus.DEV
  const all = ctx.query && ctx.query.status === AppStatus.ALL
  const apps = await getAllApps({ dev, all })

  // get the locks for all the dev apps
  if (dev || all) {
    const locks = await getAllLocks()
    for (let app of apps) {
      if (app.status !== "development") {
        continue
      }
      const lock = locks.find(lock => lock.appId === app.appId)
      if (lock) {
        app.lockedBy = lock.user
      } else {
        // make sure its definitely not present
        delete app.lockedBy
      }
    }
  }

  ctx.body = apps
}

exports.fetchAppDefinition = async function (ctx) {
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

exports.fetchAppPackage = async function (ctx) {
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(DocumentTypes.APP_METADATA)
  const [layouts, screens] = await Promise.all([getLayouts(db), getScreens(db)])

  ctx.body = {
    application,
    screens,
    layouts,
    clientLibPath: clientLibraryPath(ctx.params.appId),
  }
}

exports.create = async function (ctx) {
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
  const newApplication = {
    _id: DocumentTypes.APP_METADATA,
    appId: instance._id,
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
  if (!env.isTest()) {
    await createApp(appId)
  }

  ctx.status = 200
  ctx.body = newApplication
}

exports.update = async function (ctx) {
  const url = await getAppUrlIfNotInUse(ctx)
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(DocumentTypes.APP_METADATA)

  const data = ctx.request.body
  const newData = { ...application, ...data, url }

  // the locked by property is attached by server but generated from
  // Redis, shouldn't ever store it
  if (newData.lockedBy) {
    delete newData.lockedBy
  }

  const response = await db.put(newData)
  data._rev = response.rev

  ctx.status = 200
  ctx.body = response
}

exports.delete = async function (ctx) {
  const db = new CouchDB(ctx.params.appId)
  const app = await db.get(DocumentTypes.APP_METADATA)
  const result = await db.destroy()
  /* istanbul ignore next */
  if (!env.isTest()) {
    await deleteApp(ctx.params.appId)
  }

  ctx.status = 200
  ctx.body = result
}

const createEmptyAppPackage = async (ctx, app) => {
  const db = new CouchDB(app.appId)

  let screensAndLayouts = []
  for (let layout of BASE_LAYOUTS) {
    const cloned = cloneDeep(layout)
    screensAndLayouts.push(await processObject(cloned, app))
  }

  const homeScreen = createHomeScreen(app)
  homeScreen._id = generateScreenID()
  screensAndLayouts.push(homeScreen)

  await db.bulkDocs(screensAndLayouts)
}
