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
  generateDevAppID,
  DocumentTypes,
  AppStatus,
} = require("../../db/utils")
const { BUILTIN_ROLE_IDS, AccessController } = require("@budibase/auth/roles")
const { BASE_LAYOUTS } = require("../../constants/layouts")
const { cloneDeep } = require("lodash/fp")
const { processObject } = require("@budibase/string-templates")
const {
  getAllApps,
  isDevAppID,
  getDeployedAppID,
  Replication,
} = require("@budibase/auth/db")
const { USERS_TABLE_SCHEMA } = require("../../constants")
const {
  getDeployedApps,
  removeAppFromUserRoles,
} = require("../../utilities/workerRequests")
const { clientLibraryPath, stringToReadStream } = require("../../utilities")
const { getAllLocks } = require("../../utilities/redis")
const {
  updateClientLibrary,
  backupClientLibrary,
  revertClientLibrary,
} = require("../../utilities/fileSystem/clientLibrary")
const { getTenantId, isMultiTenant } = require("@budibase/auth/tenancy")
const { syncGlobalUsers } = require("./user")
const { app: appCache } = require("@budibase/auth/cache")
const { cleanupAutomations } = require("../../automations/utils")

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
  } else if (ctx.request.body.name) {
    url = encodeURI(`${ctx.request.body.name}`)
  }
  if (url) {
    url = `/${url.replace(URL_REGEX_SLASH, "")}`.toLowerCase()
  }
  if (!env.SELF_HOSTED) {
    return url
  }
  const deployedApps = await getDeployedApps()
  if (
    url &&
    deployedApps[url] != null &&
    ctx.params != null &&
    deployedApps[url].appId !== ctx.params.appId
  ) {
    ctx.throw(400, "App name/URL is already in use.")
  }
  return url
}

async function createInstance(template) {
  const tenantId = isMultiTenant() ? getTenantId() : null
  const baseAppId = generateAppID(tenantId)
  const appId = generateDevAppID(baseAppId)

  const db = new CouchDB(appId)
  await db.put({
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  })

  // NOTE: indexes need to be created before any tables/templates
  // add view for linked rows
  await createLinkView(appId)
  await createRoutingView(appId)
  await createAllSearchIndex(appId)

  // replicate the template data to the instance DB
  // this is currently very hard to test, downloading and importing template files
  if (template && template.templateString) {
    const { ok } = await db.load(stringToReadStream(template.templateString))
    if (!ok) {
      throw "Error loading database dump from memory."
    }
  } else if (template && template.useTemplate === "true") {
    /* istanbul ignore next */
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

exports.fetch = async ctx => {
  const dev = ctx.query && ctx.query.status === AppStatus.DEV
  const all = ctx.query && ctx.query.status === AppStatus.ALL
  const apps = await getAllApps(CouchDB, { dev, all })

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

exports.fetchAppDefinition = async ctx => {
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

exports.fetchAppPackage = async ctx => {
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(DocumentTypes.APP_METADATA)
  const layouts = await getLayouts(db)
  let screens = await getScreens(db)

  // Only filter screens if the user is not a builder
  if (!(ctx.user.builder && ctx.user.builder.global)) {
    const userRoleId = getUserRoleId(ctx)
    const accessController = new AccessController(ctx.params.appId)
    screens = await accessController.checkScreensAccess(screens, userRoleId)
  }

  ctx.body = {
    application,
    screens,
    layouts,
    clientLibPath: clientLibraryPath(ctx.params.appId, application.version),
  }
}

exports.create = async ctx => {
  const { useTemplate, templateKey, templateString } = ctx.request.body
  const instanceConfig = {
    useTemplate,
    key: templateKey,
    templateString,
  }
  if (ctx.request.files && ctx.request.files.templateFile) {
    instanceConfig.file = ctx.request.files.templateFile
  }
  const instance = await createInstance(instanceConfig)
  const appId = instance._id

  const url = await getAppUrlIfNotInUse(ctx)
  const db = new CouchDB(appId)
  let _rev
  try {
    // if template there will be an existing doc
    const existing = await db.get(DocumentTypes.APP_METADATA)
    _rev = existing._rev
  } catch (err) {
    // nothing to do
  }
  const newApplication = {
    _id: DocumentTypes.APP_METADATA,
    _rev,
    appId: instance._id,
    type: "app",
    version: packageJson.version,
    componentLibraries: ["@budibase/standard-components"],
    name: ctx.request.body.name,
    url: url,
    template: ctx.request.body.template,
    instance: instance,
    tenantId: getTenantId(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  const response = await db.put(newApplication, { force: true })
  newApplication._rev = response.rev

  // Only create the default home screens and layout if we aren't importing
  // an app
  if (useTemplate !== "true") {
    await createEmptyAppPackage(ctx, newApplication)
  }

  /* istanbul ignore next */
  if (!env.isTest()) {
    await createApp(appId)
  }

  await appCache.invalidateAppMetadata(appId, newApplication)
  ctx.status = 200
  ctx.body = newApplication
}

exports.update = async ctx => {
  const data = await updateAppPackage(ctx, ctx.request.body, ctx.params.appId)
  ctx.status = 200
  ctx.body = data
}

exports.updateClient = async ctx => {
  // Get current app version
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(DocumentTypes.APP_METADATA)
  const currentVersion = application.version

  // Update client library and manifest
  if (!env.isTest()) {
    await backupClientLibrary(ctx.params.appId)
    await updateClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const appPackageUpdates = {
    version: packageJson.version,
    revertableVersion: currentVersion,
  }
  const data = await updateAppPackage(ctx, appPackageUpdates, ctx.params.appId)
  ctx.status = 200
  ctx.body = data
}

exports.revertClient = async ctx => {
  // Check app can be reverted
  const db = new CouchDB(ctx.params.appId)
  const application = await db.get(DocumentTypes.APP_METADATA)
  if (!application.revertableVersion) {
    ctx.throw(400, "There is no version to revert to")
  }

  // Update client library and manifest
  if (!env.isTest()) {
    await revertClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const appPackageUpdates = {
    version: application.revertableVersion,
    revertableVersion: null,
  }
  const data = await updateAppPackage(ctx, appPackageUpdates, ctx.params.appId)
  ctx.status = 200
  ctx.body = data
}

exports.delete = async ctx => {
  const db = new CouchDB(ctx.params.appId)

  const result = await db.destroy()
  /* istanbul ignore next */
  if (!env.isTest() && !ctx.query.unpublish) {
    await deleteApp(ctx.params.appId)
  }
  if (ctx.query && ctx.query.unpublish) {
    await cleanupAutomations(ctx.params.appId)
  }
  // make sure the app/role doesn't stick around after the app has been deleted
  await removeAppFromUserRoles(ctx, ctx.params.appId)
  await appCache.invalidateAppMetadata(ctx.params.appId)

  ctx.status = 200
  ctx.body = result
}

exports.sync = async (ctx, next) => {
  const appId = ctx.params.appId
  if (!isDevAppID(appId)) {
    ctx.throw(400, "This action cannot be performed for production apps")
  }

  // replicate prod to dev
  const prodAppId = getDeployedAppID(appId)

  try {
    const prodDb = new CouchDB(prodAppId, { skip_setup: true })
    const info = await prodDb.info()
    if (info.error) throw info.error
  } catch (err) {
    // the database doesn't exist. Don't replicate
    ctx.status = 200
    ctx.body = {
      message: "App sync not required, app not deployed.",
    }
    return next()
  }

  const replication = new Replication({
    source: prodAppId,
    target: appId,
  })
  let error
  try {
    await replication.replicate({
      filter: function (doc) {
        return doc._id !== DocumentTypes.APP_METADATA
      },
    })
  } catch (err) {
    error = err
  }

  // sync the users
  await syncGlobalUsers(appId)

  if (error) {
    ctx.throw(400, error)
  } else {
    ctx.body = {
      message: "App sync completed successfully.",
    }
  }
}

const updateAppPackage = async (ctx, appPackage, appId) => {
  const url = await getAppUrlIfNotInUse(ctx)
  const db = new CouchDB(appId)
  const application = await db.get(DocumentTypes.APP_METADATA)

  const newAppPackage = { ...application, ...appPackage, url }
  if (appPackage._rev !== application._rev) {
    newAppPackage._rev = application._rev
  }

  // the locked by property is attached by server but generated from
  // Redis, shouldn't ever store it
  delete newAppPackage.lockedBy

  const response = await db.put(newAppPackage)
  // remove any cached metadata, so that it will be updated
  await appCache.invalidateAppMetadata(appId)
  return response
}

const createEmptyAppPackage = async (ctx, app) => {
  const db = new CouchDB(app.appId)

  let screensAndLayouts = []
  for (let layout of BASE_LAYOUTS) {
    const cloned = cloneDeep(layout)
    screensAndLayouts.push(await processObject(cloned, app))
  }

  await db.bulkDocs(screensAndLayouts)
}
