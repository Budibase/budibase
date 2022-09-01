import env from "../../environment"
import packageJson from "../../../package.json"
import {
  createLinkView,
  createRoutingView,
  createAllSearchIndex,
} from "../../db/views/staticViews"
import {
  getTemplateStream,
  createApp,
  deleteApp,
} from "../../utilities/fileSystem"
import {
  generateAppID,
  getLayoutParams,
  getScreenParams,
  generateDevAppID,
  DocumentType,
  AppStatus,
} from "../../db/utils"
const {
  BUILTIN_ROLE_IDS,
  AccessController,
} = require("@budibase/backend-core/roles")
const { CacheKeys, bustCache } = require("@budibase/backend-core/cache")
const {
  getAllApps,
  isDevAppID,
  getProdAppID,
  Replication,
} = require("@budibase/backend-core/db")
import { USERS_TABLE_SCHEMA } from "../../constants"
import { removeAppFromUserRoles } from "../../utilities/workerRequests"
import { clientLibraryPath, stringToReadStream } from "../../utilities"
import { getAllLocks } from "../../utilities/redis"
import {
  updateClientLibrary,
  backupClientLibrary,
  revertClientLibrary,
} from "../../utilities/fileSystem/clientLibrary"
const { getTenantId, isMultiTenant } = require("@budibase/backend-core/tenancy")
import { syncGlobalUsers } from "./user"
const { app: appCache } = require("@budibase/backend-core/cache")
import { cleanupAutomations } from "../../automations/utils"
import { context } from "@budibase/backend-core"
import { checkAppMetadata } from "../../automations/logging"
import { getUniqueRows } from "../../utilities/usageQuota/rows"
import { quotas } from "@budibase/pro"
import { errors, events, migrations } from "@budibase/backend-core"
import {
  App,
  Layout,
  Screen,
  MigrationType,
  AppNavigation,
} from "@budibase/types"
import { BASE_LAYOUT_PROP_IDS } from "../../constants/layouts"

const URL_REGEX_SLASH = /\/|\\/g

// utility function, need to do away with this
async function getLayouts() {
  const db = context.getAppDB()
  return (
    await db.allDocs(
      getLayoutParams(null, {
        include_docs: true,
      })
    )
  ).rows.map((row: any) => row.doc)
}

async function getScreens() {
  const db = context.getAppDB()
  return (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map((row: any) => row.doc)
}

function getUserRoleId(ctx: any) {
  return !ctx.user.role || !ctx.user.role._id
    ? BUILTIN_ROLE_IDS.PUBLIC
    : ctx.user.role._id
}

export const getAppUrl = (ctx: any) => {
  // construct the url
  let url
  if (ctx.request.body.url) {
    // if the url is provided, use that
    url = encodeURI(ctx.request.body.url)
  } else if (ctx.request.body.name) {
    // otherwise use the name
    url = encodeURI(`${ctx.request.body.name}`)
  }
  if (url) {
    url = `/${url.replace(URL_REGEX_SLASH, "")}`.toLowerCase()
  }
  return url
}

const checkAppUrl = (ctx: any, apps: any, url: any, currentAppId?: string) => {
  if (currentAppId) {
    apps = apps.filter((app: any) => app.appId !== currentAppId)
  }
  if (apps.some((app: any) => app.url === url)) {
    ctx.throw(400, "App URL is already in use.")
  }
}

const checkAppName = (
  ctx: any,
  apps: any,
  name: any,
  currentAppId?: string
) => {
  // TODO: Replace with Joi
  if (!name) {
    ctx.throw(400, "Name is required")
  }
  if (currentAppId) {
    apps = apps.filter((app: any) => app.appId !== currentAppId)
  }
  if (apps.some((app: any) => app.name === name)) {
    ctx.throw(400, "App name is already in use.")
  }
}

async function createInstance(template: any) {
  const tenantId = isMultiTenant() ? getTenantId() : null
  const baseAppId = generateAppID(tenantId)
  const appId = generateDevAppID(baseAppId)
  await context.updateAppId(appId)

  const db = context.getAppDB()
  await db.put({
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  })

  // NOTE: indexes need to be created before any tables/templates
  // add view for linked rows
  await createLinkView()
  await createRoutingView()
  await createAllSearchIndex()

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

export const fetch = async (ctx: any) => {
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
      const lock = locks.find((lock: any) => lock.appId === app.appId)
      if (lock) {
        app.lockedBy = lock.user
      } else {
        // make sure its definitely not present
        delete app.lockedBy
      }
    }
  }

  ctx.body = await checkAppMetadata(apps)
}

export const fetchAppDefinition = async (ctx: any) => {
  const layouts = await getLayouts()
  const userRoleId = getUserRoleId(ctx)
  const accessController = new AccessController()
  const screens = await accessController.checkScreensAccess(
    await getScreens(),
    userRoleId
  )
  ctx.body = {
    layouts,
    screens,
    libraries: ["@budibase/standard-components"],
  }
}

export const fetchAppPackage = async (ctx: any) => {
  const db = context.getAppDB()
  const application = await db.get(DocumentType.APP_METADATA)
  const layouts = await getLayouts()
  let screens = await getScreens()

  // Only filter screens if the user is not a builder
  if (!(ctx.user.builder && ctx.user.builder.global)) {
    const userRoleId = getUserRoleId(ctx)
    const accessController = new AccessController()
    screens = await accessController.checkScreensAccess(screens, userRoleId)
  }

  ctx.body = {
    application,
    screens,
    layouts,
    clientLibPath: clientLibraryPath(ctx.params.appId, application.version),
  }
}

const performAppCreate = async (ctx: any) => {
  const apps = await getAllApps({ dev: true })
  const name = ctx.request.body.name
  checkAppName(ctx, apps, name)
  const url = getAppUrl(ctx)
  checkAppUrl(ctx, apps, url)

  const { useTemplate, templateKey, templateString } = ctx.request.body
  const instanceConfig: any = {
    useTemplate,
    key: templateKey,
    templateString,
  }
  if (ctx.request.files && ctx.request.files.templateFile) {
    instanceConfig.file = ctx.request.files.templateFile
  }
  const instance = await createInstance(instanceConfig)
  const appId = instance._id
  const db = context.getAppDB()

  let newApplication: App = {
    _id: DocumentType.APP_METADATA,
    _rev: undefined,
    appId,
    type: "app",
    version: packageJson.version,
    componentLibraries: ["@budibase/standard-components"],
    name: name,
    url: url,
    template: templateKey,
    instance,
    tenantId: getTenantId(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: AppStatus.DEV,
    navigation: {
      navigation: "Top",
      title: name,
      navWidth: "Large",
      navBackground: "var(--spectrum-global-color-gray-100)",
      links: [
        {
          url: "/home",
          text: "Home",
        },
      ],
    },
    theme: "spectrum--light",
    customTheme: {
      buttonBorderRadius: "16px",
    },
  }

  // If we used a template or imported an app there will be an existing doc.
  // Fetch and migrate some metadata from the existing app.
  try {
    const existing: App = await db.get(DocumentType.APP_METADATA)
    const keys: (keyof App)[] = [
      "_rev",
      "navigation",
      "theme",
      "customTheme",
      "icon",
    ]
    keys.forEach(key => {
      if (existing[key]) {
        // @ts-ignore
        newApplication[key] = existing[key]
      }
    })

    // Migrate navigation settings and screens if required
    if (existing && !existing.navigation) {
      const navigation = await migrateAppNavigation()
      if (navigation) {
        newApplication.navigation = navigation
      }
    }
  } catch (err) {
    // Nothing to do
  }

  const response = await db.put(newApplication, { force: true })
  newApplication._rev = response.rev

  /* istanbul ignore next */
  if (!env.isTest()) {
    await createApp(appId)
  }

  await appCache.invalidateAppMetadata(appId, newApplication)
  return newApplication
}

const creationEvents = async (request: any, app: App) => {
  let creationFns: ((app: App) => Promise<void>)[] = []

  const body = request.body
  if (body.useTemplate === "true") {
    // from template
    if (body.templateKey && body.templateKey !== "undefined") {
      creationFns.push(a => events.app.templateImported(a, body.templateKey))
    }
    // from file
    else if (request.files?.templateFile) {
      creationFns.push(a => events.app.fileImported(a))
    }
    // unknown
    else {
      console.error("Could not determine template creation event")
    }
  }
  creationFns.push(a => events.app.created(a))

  for (let fn of creationFns) {
    await fn(app)
  }
}

const appPostCreate = async (ctx: any, app: App) => {
  const tenantId = getTenantId()
  await migrations.backPopulateMigrations({
    type: MigrationType.APP,
    tenantId,
    appId: app.appId,
  })
  await creationEvents(ctx.request, app)
  // app import & template creation
  if (ctx.request.body.useTemplate === "true") {
    const rows = await getUniqueRows([app.appId])
    const rowCount = rows ? rows.length : 0
    if (rowCount) {
      try {
        await quotas.addRows(rowCount)
      } catch (err: any) {
        if (err.code && err.code === errors.codes.USAGE_LIMIT_EXCEEDED) {
          // this import resulted in row usage exceeding the quota
          // delete the app
          // skip pre and post steps as no rows have been added to quotas yet
          ctx.params.appId = app.appId
          await destroyApp(ctx)
        }
        throw err
      }
    }
  }
}

export const create = async (ctx: any) => {
  const newApplication = await quotas.addApp(() => performAppCreate(ctx))
  await appPostCreate(ctx, newApplication)
  await bustCache(CacheKeys.CHECKLIST)
  ctx.body = newApplication
  ctx.status = 200
}

// This endpoint currently operates as a PATCH rather than a PUT
// Thus name and url fields are handled only if present
export const update = async (ctx: any) => {
  const apps = await getAllApps({ dev: true })
  // validation
  const name = ctx.request.body.name
  if (name) {
    checkAppName(ctx, apps, name, ctx.params.appId)
  }
  const url = getAppUrl(ctx)
  if (url) {
    checkAppUrl(ctx, apps, url, ctx.params.appId)
    ctx.request.body.url = url
  }

  const app = await updateAppPackage(ctx.request.body, ctx.params.appId)
  await events.app.updated(app)
  ctx.status = 200
  ctx.body = app
}

export const updateClient = async (ctx: any) => {
  // Get current app version
  const db = context.getAppDB()
  const application = await db.get(DocumentType.APP_METADATA)
  const currentVersion = application.version

  // Update client library and manifest
  if (!env.isTest()) {
    await backupClientLibrary(ctx.params.appId)
    await updateClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const updatedToVersion = packageJson.version
  const appPackageUpdates = {
    version: updatedToVersion,
    revertableVersion: currentVersion,
  }
  const app = await updateAppPackage(appPackageUpdates, ctx.params.appId)
  await events.app.versionUpdated(app, currentVersion, updatedToVersion)
  ctx.status = 200
  ctx.body = app
}

export const revertClient = async (ctx: any) => {
  // Check app can be reverted
  const db = context.getAppDB()
  const application = await db.get(DocumentType.APP_METADATA)
  if (!application.revertableVersion) {
    ctx.throw(400, "There is no version to revert to")
  }

  // Update client library and manifest
  if (!env.isTest()) {
    await revertClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const currentVersion = application.version
  const revertedToVersion = application.revertableVersion
  const appPackageUpdates = {
    version: revertedToVersion,
    revertableVersion: null,
  }
  const app = await updateAppPackage(appPackageUpdates, ctx.params.appId)
  await events.app.versionReverted(app, currentVersion, revertedToVersion)
  ctx.status = 200
  ctx.body = app
}

const destroyApp = async (ctx: any) => {
  let appId = ctx.params.appId
  let isUnpublish = ctx.query && ctx.query.unpublish

  if (isUnpublish) {
    appId = getProdAppID(appId)
  }

  const db = isUnpublish ? context.getProdAppDB() : context.getAppDB()
  const app = await db.get(DocumentType.APP_METADATA)
  const result = await db.destroy()

  if (isUnpublish) {
    await quotas.removePublishedApp()
    await events.app.unpublished(app)
  } else {
    await quotas.removeApp()
    await events.app.deleted(app)
  }

  /* istanbul ignore next */
  if (!env.isTest() && !isUnpublish) {
    await deleteApp(appId)
  }
  // automations only in production
  if (isUnpublish) {
    await cleanupAutomations(appId)
  }
  // remove app role when the dev app is deleted (no trace of app anymore)
  else {
    await removeAppFromUserRoles(ctx, appId)
  }
  await appCache.invalidateAppMetadata(appId)
  return result
}

const preDestroyApp = async (ctx: any) => {
  const rows = await getUniqueRows([ctx.params.appId])
  ctx.rowCount = rows.length
}

const postDestroyApp = async (ctx: any) => {
  const rowCount = ctx.rowCount
  if (rowCount) {
    await quotas.removeRows(rowCount)
  }
}

export const destroy = async (ctx: any) => {
  await preDestroyApp(ctx)
  const result = await destroyApp(ctx)
  await postDestroyApp(ctx)
  ctx.status = 200
  ctx.body = result
}

export const sync = async (ctx: any, next: any) => {
  if (env.DISABLE_AUTO_PROD_APP_SYNC) {
    ctx.status = 200
    ctx.body = {
      message:
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable.",
    }
    return next()
  }

  const appId = ctx.params.appId
  if (!isDevAppID(appId)) {
    ctx.throw(400, "This action cannot be performed for production apps")
  }

  // replicate prod to dev
  const prodAppId = getProdAppID(appId)

  try {
    // specific case, want to make sure setup is skipped
    const prodDb = context.getProdAppDB({ skip_setup: true })
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
      filter: function (doc: any) {
        return doc._id !== DocumentType.APP_METADATA
      },
    })
  } catch (err) {
    error = err
  } finally {
    await replication.close()
  }

  // sync the users
  await syncGlobalUsers()

  if (error) {
    ctx.throw(400, error)
  } else {
    ctx.body = {
      message: "App sync completed successfully.",
    }
  }
}

const updateAppPackage = async (appPackage: any, appId: any) => {
  return context.doInAppContext(appId, async () => {
    const db = context.getAppDB()
    const application = await db.get(DocumentType.APP_METADATA)

    const newAppPackage = { ...application, ...appPackage }
    if (appPackage._rev !== application._rev) {
      newAppPackage._rev = application._rev
    }

    // the locked by property is attached by server but generated from
    // Redis, shouldn't ever store it
    delete newAppPackage.lockedBy

    await db.put(newAppPackage)
    // remove any cached metadata, so that it will be updated
    await appCache.invalidateAppMetadata(appId)
    return newAppPackage
  })
}

const migrateAppNavigation = async () => {
  const db = context.getAppDB()
  const existing: App = await db.get(DocumentType.APP_METADATA)
  const layouts: Layout[] = await getLayouts()
  const screens: Screen[] = await getScreens()

  // Migrate all screens, removing custom layouts
  for (let screen of screens) {
    if (!screen.layoutId) {
      return
    }
    const layout = layouts.find(layout => layout._id === screen.layoutId)
    screen.layoutId = undefined
    screen.showNavigation = layout?.props.navigation !== "None"
    screen.width = layout?.props.width || "Large"
    await db.put(screen)
  }

  // Migrate layout navigation settings
  const { name, customTheme } = existing
  const layout = layouts?.find(
    (layout: Layout) => layout._id === BASE_LAYOUT_PROP_IDS.PRIVATE
  )
  if (layout) {
    let navigationSettings: any = {
      navigation: "Top",
      title: name,
      navWidth: "Large",
      navBackground:
        customTheme?.navBackground || "var(--spectrum-global-color-gray-50)",
      navTextColor:
        customTheme?.navTextColor || "var(--spectrum-global-color-gray-800)",
    }
    if (layout) {
      navigationSettings.hideLogo = layout.props.hideLogo
      navigationSettings.hideTitle = layout.props.hideTitle
      navigationSettings.title = layout.props.title || name
      navigationSettings.logoUrl = layout.props.logoUrl
      navigationSettings.links = layout.props.links
      navigationSettings.navigation = layout.props.navigation || "Top"
      navigationSettings.sticky = layout.props.sticky
      navigationSettings.navWidth = layout.props.width || "Large"
      if (navigationSettings.navigation === "None") {
        navigationSettings.navigation = "Top"
      }
    }
    return navigationSettings
  } else {
    return null
  }
}
