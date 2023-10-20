import env from "../../environment"
import {
  createAllSearchIndex,
  createLinkView,
  createRoutingView,
} from "../../db/views/staticViews"
import {
  backupClientLibrary,
  createApp,
  deleteApp,
  revertClientLibrary,
  updateClientLibrary,
} from "../../utilities/fileSystem"
import {
  AppStatus,
  DocumentType,
  generateAppID,
  generateDevAppID,
  getLayoutParams,
  getScreenParams,
} from "../../db/utils"
import {
  cache,
  context,
  db as dbCore,
  env as envCore,
  ErrorCode,
  events,
  migrations,
  objectStore,
  roles,
  tenancy,
  users,
} from "@budibase/backend-core"
import { USERS_TABLE_SCHEMA } from "../../constants"
import {
  buildDefaultDocs,
  DEFAULT_BB_DATASOURCE_ID,
} from "../../db/defaultData/datasource_bb_default"
import { removeAppFromUserRoles } from "../../utilities/workerRequests"
import { stringToReadStream } from "../../utilities"
import { doesUserHaveLock } from "../../utilities/redis"
import { cleanupAutomations } from "../../automations/utils"
import { getUniqueRows } from "../../utilities/usageQuota/rows"
import { groups, licensing, quotas } from "@budibase/pro"
import {
  App,
  Layout,
  MigrationType,
  PlanType,
  Screen,
  UserCtx,
} from "@budibase/types"
import { BASE_LAYOUT_PROP_IDS } from "../../constants/layouts"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"

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

function getUserRoleId(ctx: UserCtx) {
  return !ctx.user?.role || !ctx.user.role._id
    ? roles.BUILTIN_ROLE_IDS.PUBLIC
    : ctx.user.role._id
}

function checkAppUrl(
  ctx: UserCtx,
  apps: App[],
  url: string,
  currentAppId?: string
) {
  if (currentAppId) {
    apps = apps.filter((app: any) => app.appId !== currentAppId)
  }
  if (apps.some((app: any) => app.url === url)) {
    ctx.throw(400, "App URL is already in use.")
  }
}

function checkAppName(
  ctx: UserCtx,
  apps: App[],
  name: string,
  currentAppId?: string
) {
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

interface AppTemplate {
  templateString: string
  useTemplate: string
  file?: {
    type: string
    path: string
    password?: string
  }
  key?: string
}

async function createInstance(appId: string, template: AppTemplate) {
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
    await sdk.backups.importApp(appId, db, template)
  } else {
    // create the users table
    await db.put(USERS_TABLE_SCHEMA)
  }

  return { _id: appId }
}

export const addSampleData = async (ctx: UserCtx) => {
  const db = context.getAppDB()

  try {
    // Check if default datasource exists before creating it
    await sdk.datasources.get(DEFAULT_BB_DATASOURCE_ID)
  } catch (err: any) {
    const defaultDbDocs = await buildDefaultDocs()

    // add in the default db data docs - tables, datasource, rows and links
    await db.bulkDocs([...defaultDbDocs])
  }

  ctx.status = 200
}

export async function fetch(ctx: UserCtx) {
  ctx.body = await sdk.applications.fetch(
    ctx.query.status as AppStatus,
    ctx.user
  )
}

export async function fetchAppDefinition(ctx: UserCtx) {
  const layouts = await getLayouts()
  const userRoleId = getUserRoleId(ctx)
  const accessController = new roles.AccessController()
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

export async function fetchAppPackage(ctx: UserCtx) {
  const db = context.getAppDB()
  const appId = context.getAppId()
  let application = await db.get<any>(DocumentType.APP_METADATA)
  const layouts = await getLayouts()
  let screens = await getScreens()
  const license = await licensing.cache.getCachedLicense()

  // Enrich plugin URLs
  application.usedPlugins = objectStore.enrichPluginURLs(
    application.usedPlugins
  )

  // Only filter screens if the user is not a builder
  if (!users.isBuilder(ctx.user, appId)) {
    const userRoleId = getUserRoleId(ctx)
    const accessController = new roles.AccessController()
    screens = await accessController.checkScreensAccess(screens, userRoleId)
  }

  const clientLibPath = objectStore.clientLibraryUrl(
    ctx.params.appId,
    application.version
  )

  ctx.body = {
    application: { ...application, upgradableVersion: envCore.VERSION },
    licenseType: license?.plan.type || PlanType.FREE,
    screens,
    layouts,
    clientLibPath,
    hasLock: await doesUserHaveLock(application.appId, ctx.user),
  }
}

async function performAppCreate(ctx: UserCtx) {
  const apps = (await dbCore.getAllApps({ dev: true })) as App[]
  const name = ctx.request.body.name,
    possibleUrl = ctx.request.body.url,
    encryptionPassword = ctx.request.body.encryptionPassword

  checkAppName(ctx, apps, name)
  const url = sdk.applications.getAppUrl({ name, url: possibleUrl })
  checkAppUrl(ctx, apps, url)

  const { useTemplate, templateKey, templateString } = ctx.request.body
  const instanceConfig: AppTemplate = {
    useTemplate,
    key: templateKey,
    templateString,
  }
  if (ctx.request.files && ctx.request.files.templateFile) {
    instanceConfig.file = {
      ...(ctx.request.files.templateFile as any),
      password: encryptionPassword,
    }
  }
  const tenantId = tenancy.isMultiTenant() ? tenancy.getTenantId() : null
  const appId = generateDevAppID(generateAppID(tenantId))

  return await context.doInAppContext(appId, async () => {
    const instance = await createInstance(appId, instanceConfig)
    const db = context.getAppDB()

    let newApplication: App = {
      _id: DocumentType.APP_METADATA,
      _rev: undefined,
      appId,
      type: "app",
      version: envCore.VERSION,
      componentLibraries: ["@budibase/standard-components"],
      name: name,
      url: url,
      template: templateKey,
      instance,
      tenantId: tenancy.getTenantId(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: AppStatus.DEV,
      navigation: {
        navigation: "Top",
        title: name,
        navWidth: "Large",
        navBackground: "var(--spectrum-global-color-gray-100)",
        links: [],
      },
      theme: "spectrum--light",
      customTheme: {
        buttonBorderRadius: "16px",
      },
      features: {
        componentValidation: true,
        disableUserMetadata: true,
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

      // Keep existing feature flags
      if (!existing.features?.componentValidation) {
        newApplication.features!.componentValidation = false
      }
      if (!existing.features?.disableUserMetadata) {
        newApplication.features!.disableUserMetadata = false
      }

      // Migrate navigation settings and screens if required
      if (existing) {
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

    await cache.app.invalidateAppMetadata(appId, newApplication)
    return newApplication
  })
}

async function creationEvents(request: any, app: App) {
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

async function appPostCreate(ctx: UserCtx, app: App) {
  const tenantId = tenancy.getTenantId()
  await migrations.backPopulateMigrations({
    type: MigrationType.APP,
    tenantId,
    appId: app.appId,
  })
  await creationEvents(ctx.request, app)
  // app import & template creation
  if (ctx.request.body.useTemplate === "true") {
    const { rows } = await getUniqueRows([app.appId])
    const rowCount = rows ? rows.length : 0
    if (rowCount) {
      try {
        await context.doInAppContext(app.appId, () => {
          return quotas.addRows(rowCount)
        })
      } catch (err: any) {
        if (err.code && err.code === ErrorCode.USAGE_LIMIT_EXCEEDED) {
          // this import resulted in row usage exceeding the quota
          // delete the app
          // skip pre and post-steps as no rows have been added to quotas yet
          ctx.params.appId = app.appId
          await destroyApp(ctx)
        }
        throw err
      }
    }
  }
}

export async function create(ctx: UserCtx) {
  const newApplication = await quotas.addApp(() => performAppCreate(ctx))
  await appPostCreate(ctx, newApplication)
  await cache.bustCache(cache.CacheKey.CHECKLIST)
  ctx.body = newApplication
  ctx.status = 200
}

// This endpoint currently operates as a PATCH rather than a PUT
// Thus name and url fields are handled only if present
export async function update(ctx: UserCtx) {
  const apps = (await dbCore.getAllApps({ dev: true })) as App[]
  // validation
  const name = ctx.request.body.name,
    possibleUrl = ctx.request.body.url
  if (name) {
    checkAppName(ctx, apps, name, ctx.params.appId)
  }
  const url = sdk.applications.getAppUrl({ name, url: possibleUrl })
  if (url) {
    checkAppUrl(ctx, apps, url, ctx.params.appId)
    ctx.request.body.url = url
  }

  const app = await updateAppPackage(ctx.request.body, ctx.params.appId)
  await events.app.updated(app)
  ctx.status = 200
  ctx.body = app
  builderSocket?.emitAppMetadataUpdate(ctx, {
    theme: app.theme,
    customTheme: app.customTheme,
    navigation: app.navigation,
    name: app.name,
    url: app.url,
    icon: app.icon,
  })
}

export async function updateClient(ctx: UserCtx) {
  // Get current app version
  const db = context.getAppDB()
  const application = await db.get<App>(DocumentType.APP_METADATA)
  const currentVersion = application.version

  // Update client library and manifest
  if (!env.isTest()) {
    await backupClientLibrary(ctx.params.appId)
    await updateClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const updatedToVersion = envCore.VERSION
  const appPackageUpdates = {
    version: updatedToVersion,
    revertableVersion: currentVersion,
  }
  const app = await updateAppPackage(appPackageUpdates, ctx.params.appId)
  await events.app.versionUpdated(app, currentVersion, updatedToVersion)
  ctx.status = 200
  ctx.body = app
}

export async function revertClient(ctx: UserCtx) {
  // Check app can be reverted
  const db = context.getAppDB()
  const application = await db.get<App>(DocumentType.APP_METADATA)
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

async function unpublishApp(ctx: UserCtx) {
  let appId = ctx.params.appId
  appId = dbCore.getProdAppID(appId)

  const db = context.getProdAppDB()
  const result = await db.destroy()

  await events.app.unpublished({ appId } as App)

  // automations only in production
  await cleanupAutomations(appId)

  await cache.app.invalidateAppMetadata(appId)
  return result
}

async function destroyApp(ctx: UserCtx) {
  let appId = ctx.params.appId
  appId = dbCore.getProdAppID(appId)
  const devAppId = dbCore.getDevAppID(appId)

  // check if we need to unpublish first
  if (await dbCore.dbExists(appId)) {
    // app is deployed, run through unpublish flow
    await sdk.applications.syncApp(devAppId)
    await unpublishApp(ctx)
  }

  const db = dbCore.getDB(devAppId)
  // standard app deletion flow
  const app = await db.get<App>(DocumentType.APP_METADATA)
  const result = await db.destroy()
  await quotas.removeApp()
  await events.app.deleted(app)

  if (!env.isTest()) {
    await deleteApp(appId)
  }

  await removeAppFromUserRoles(ctx, appId)
  await cache.app.invalidateAppMetadata(devAppId)
  return result
}

async function preDestroyApp(ctx: UserCtx) {
  const { rows } = await getUniqueRows([ctx.params.appId])
  ctx.rowCount = rows.length
}

async function postDestroyApp(ctx: UserCtx) {
  const rowCount = ctx.rowCount
  await groups.cleanupApp(ctx.params.appId)
  if (rowCount) {
    await quotas.removeRows(rowCount)
  }
}

export async function destroy(ctx: UserCtx) {
  await preDestroyApp(ctx)
  const result = await destroyApp(ctx)
  await postDestroyApp(ctx)
  ctx.status = 200
  ctx.body = result
}

export async function unpublish(ctx: UserCtx) {
  const prodAppId = dbCore.getProdAppID(ctx.params.appId)
  const dbExists = await dbCore.dbExists(prodAppId)

  // check app has been published
  if (!dbExists) {
    return ctx.throw(400, "App has not been published.")
  }

  await preDestroyApp(ctx)
  await unpublishApp(ctx)
  await postDestroyApp(ctx)
  ctx.status = 204
  builderSocket?.emitAppUnpublish(ctx)
}

export async function sync(ctx: UserCtx) {
  const appId = ctx.params.appId
  try {
    ctx.body = await sdk.applications.syncApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err.message)
  }
}

export async function importToApp(ctx: UserCtx) {
  const { appId } = ctx.params
  const appExport = ctx.request.files?.appExport
  const password = ctx.request.body.encryptionPassword as string
  if (!appExport) {
    ctx.throw(400, "Must supply app export to import")
  }
  if (Array.isArray(appExport)) {
    ctx.throw(400, "Must only supply one app export")
  }
  const fileAttributes = { type: appExport.type!, path: appExport.path! }
  try {
    await sdk.applications.updateWithExport(appId, fileAttributes, password)
  } catch (err: any) {
    ctx.throw(
      500,
      `Unable to perform update, please retry - ${err?.message || err}`
    )
  }
  ctx.body = { message: "app updated" }
}

export async function updateAppPackage(appPackage: any, appId: any) {
  return context.doInAppContext(appId, async () => {
    const db = context.getAppDB()
    const application = await db.get<App>(DocumentType.APP_METADATA)

    const newAppPackage = { ...application, ...appPackage }
    if (appPackage._rev !== application._rev) {
      newAppPackage._rev = application._rev
    }

    // the locked by property is attached by server but generated from
    // Redis, shouldn't ever store it
    delete newAppPackage.lockedBy

    await db.put(newAppPackage)
    // remove any cached metadata, so that it will be updated
    await cache.app.invalidateAppMetadata(appId)
    return newAppPackage
  })
}

async function migrateAppNavigation() {
  const db = context.getAppDB()
  const existing: App = await db.get(DocumentType.APP_METADATA)
  const layouts: Layout[] = await getLayouts()
  const screens: Screen[] = await getScreens()

  // Migrate all screens, removing custom layouts
  for (let screen of screens) {
    if (!screen.layoutId) {
      continue
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
  if (layout && !existing.navigation) {
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
