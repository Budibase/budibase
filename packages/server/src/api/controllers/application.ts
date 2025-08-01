import env from "../../environment"
import {
  createAllSearchIndex,
  createLinkView,
  createRoutingView,
} from "../../db/views/staticViews"
import {
  backupClientLibrary,
  uploadAppFiles,
  deleteAppFiles,
  revertClientLibrary,
  updateClientLibrary,
} from "../../utilities/fileSystem"
import {
  AppStatus,
  DocumentType,
  generateAppID,
  generateDevAppID,
  getLayoutParams,
} from "../../db/utils"
import {
  cache,
  context,
  db,
  db as dbCore,
  docIds,
  env as envCore,
  events,
  features,
  objectStore,
  roles,
  tenancy,
  users,
  utils,
  configs,
} from "@budibase/backend-core"
import { USERS_TABLE_SCHEMA, DEFAULT_BB_DATASOURCE_ID } from "../../constants"
import { buildDefaultDocs } from "../../db/defaultData/datasource_bb_default"
import { removeAppFromUserRoles } from "../../utilities/workerRequests"
import { doesUserHaveLock } from "../../utilities/redis"
import { cleanupAutomations } from "../../automations/utils"
import { getUniqueRows } from "../../utilities/usageQuota/rows"
import { groups, licensing, quotas } from "@budibase/pro"
import {
  App,
  Layout,
  PlanType,
  Screen,
  UserCtx,
  CreateAppRequest,
  FetchAppDefinitionResponse,
  FetchAppPackageResponse,
  DuplicateAppRequest,
  DuplicateAppResponse,
  UpdateAppRequest,
  UpdateAppResponse,
  Database,
  FieldType,
  BBReferenceFieldSubType,
  Row,
  BBRequest,
  SyncAppResponse,
  CreateAppResponse,
  FetchAppsResponse,
  UpdateAppClientResponse,
  RevertAppClientResponse,
  DeleteAppResponse,
  ImportToUpdateAppRequest,
  ImportToUpdateAppResponse,
  AddAppSampleDataResponse,
  UnpublishAppResponse,
  ErrorCode,
  FeatureFlag,
  FetchPublishedAppsResponse,
} from "@budibase/types"
import { BASE_LAYOUT_PROP_IDS } from "../../constants/layouts"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"
import { DefaultAppTheme, sdk as sharedCoreSDK } from "@budibase/shared-core"
import * as appMigrations from "../../appMigrations"
import { createSampleDataTableScreen } from "../../constants/screens"
import { defaultAppNavigator } from "../../constants/definitions"
import { processMigrations } from "../../appMigrations/migrationsProcessor"

// utility function, need to do away with this
async function getLayouts() {
  const db = context.getAppDB()
  return (
    await db.allDocs<Layout>(
      getLayoutParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
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
  useTemplate?: boolean
  file?: {
    type?: string
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

  if (template && template.useTemplate) {
    const opts = {
      importObjStoreContents: true,
      updateAttachmentColumns: !template.key, // preserve attachments when using Budibase templates
    }
    await sdk.backups.importApp(appId, db, template, opts)
  } else {
    // create the users table
    await db.put(USERS_TABLE_SCHEMA)
  }

  return { _id: appId }
}

async function addSampleDataDocs() {
  const db = context.getAppDB()
  try {
    // Check if default datasource exists before creating it
    await sdk.datasources.get(DEFAULT_BB_DATASOURCE_ID)
  } catch (err: any) {
    const defaultDbDocs = await buildDefaultDocs()

    // add in the default db data docs - tables, datasource, rows and links
    await db.bulkDocs([...defaultDbDocs])
  }
}

async function addSampleDataScreen() {
  const appMetadata = await sdk.applications.metadata.get()
  const workspaceApp = await sdk.workspaceApps.create({
    name: appMetadata.name,
    url: "/",
    navigation: {
      ...defaultAppNavigator(appMetadata.name),
      links: [
        {
          text: "Inventory",
          url: "/inventory",
          type: "link",
          roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        },
      ],
    },
    isDefault: true,
  })

  const screen = createSampleDataTableScreen(workspaceApp._id!)
  await sdk.screens.create(screen)

  {
    // TODO: remove when cleaning the flag FeatureFlag.WORKSPACE_APPS
    const db = context.getAppDB()
    let app = await sdk.applications.metadata.get()
    if (!app.navigation) {
      return
    }
    if (!app.navigation.links) {
      app.navigation.links = []
    }
    app.navigation.links.push({
      text: "Inventory",
      url: "/inventory",
      type: "link",
      roleId: roles.BUILTIN_ROLE_IDS.BASIC,
    })

    await db.put(app)

    // remove any cached metadata, so that it will be updated
    await cache.app.invalidateAppMetadata(app.appId)
  }
}

export const addSampleData = async (
  ctx: UserCtx<void, AddAppSampleDataResponse>
) => {
  await addSampleDataDocs()
  ctx.body = { message: "Sample tables added." }
}

export async function fetch(ctx: UserCtx<void, FetchAppsResponse>) {
  const apps = await sdk.applications.fetch(
    ctx.query.status as AppStatus,
    ctx.user
  )

  ctx.body = await sdk.applications.enrichWithDefaultWorkspaceAppUrl(apps)
}
export async function fetchClientApps(
  ctx: UserCtx<void, FetchPublishedAppsResponse>
) {
  const apps = await sdk.applications.fetch(AppStatus.DEPLOYED, ctx.user)

  const result: FetchPublishedAppsResponse["apps"] = []
  for (const app of apps) {
    const workspaceApps = await db.doWithDB(app.appId, db =>
      sdk.workspaceApps.fetch(db)
    )
    for (const workspaceApp of workspaceApps) {
      // don't return disabled workspace apps
      if (workspaceApp.disabled) {
        continue
      }
      result.push({
        // This is used as idempotency key for rendering in the frontend
        appId: `${app.appId}_${workspaceApp._id}`,
        // TODO: this can be removed when the flag is cleaned from packages/builder/src/pages/builder/apps/index.svelte
        prodId: app.appId,
        name: `${workspaceApp.name}`,
        url: `${app.url}${workspaceApp.url || ""}`.replace(/\/$/, ""),
        updatedAt: app.updatedAt,
      })
    }
  }

  ctx.body = { apps: result }
}

export async function fetchAppDefinition(
  ctx: UserCtx<void, FetchAppDefinitionResponse>
) {
  const layouts = await getLayouts()
  const userRoleId = getUserRoleId(ctx)
  const accessController = new roles.AccessController()
  const screens = await accessController.checkScreensAccess(
    await sdk.screens.fetch(),
    userRoleId
  )
  ctx.body = {
    layouts,
    screens,
    libraries: ["@budibase/standard-components"],
  }
}

export async function fetchAppPackage(
  ctx: UserCtx<void, FetchAppPackageResponse>
) {
  const appId = context.getAppId()
  let [application, layouts, screens, license, recaptchaConfig] =
    await Promise.all([
      sdk.applications.metadata.get(),
      getLayouts(),
      sdk.screens.fetch(),
      licensing.cache.getCachedLicense(),
      configs.getRecaptchaConfig(),
    ])

  // Enrich plugin URLs
  application.usedPlugins = await objectStore.enrichPluginURLs(
    application.usedPlugins
  )

  // Enrich PWA icon URLs if they exist
  if (application.pwa?.icons && application.pwa.icons.length > 0) {
    application.pwa.icons = await objectStore.enrichPWAImages(
      application.pwa.icons
    )
  }

  // Only filter screens if the user is not a builder call
  const isBuilder = users.isBuilder(ctx.user, appId) && !utils.isClient(ctx)
  if (!isBuilder) {
    const userRoleId = getUserRoleId(ctx)
    const accessController = new roles.AccessController()
    screens = await accessController.checkScreensAccess(screens, userRoleId)
  }

  if (
    (await features.flags.isEnabled(FeatureFlag.WORKSPACE_APPS)) &&
    !isBuilder
  ) {
    const urlPath = ctx.headers.referer
      ? new URL(ctx.headers.referer).pathname
      : ""

    const [matchedWorkspaceApp] =
      await sdk.workspaceApps.getMatchedWorkspaceApp(urlPath)
    // disabled workspace apps should appear to not exist
    if (!matchedWorkspaceApp || matchedWorkspaceApp.disabled) {
      ctx.throw("No matching workspace app found for URL path: " + urlPath, 404)
    }
    screens = screens.filter(s => s.workspaceAppId === matchedWorkspaceApp._id)

    application.navigation = matchedWorkspaceApp.navigation
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
    recaptchaKey: recaptchaConfig?.config.siteKey,
  }
}

async function performAppCreate(
  ctx: UserCtx<CreateAppRequest, CreateAppResponse>
) {
  const apps = (await dbCore.getAllApps({ dev: true })) as App[]
  const { body } = ctx.request
  const { name, url, encryptionPassword, templateKey } = body

  let useTemplate = false
  if (typeof body.useTemplate === "string") {
    useTemplate = body.useTemplate === "true"
  } else if (typeof body.useTemplate === "boolean") {
    useTemplate = body.useTemplate
  }

  checkAppName(ctx, apps, name)
  const appUrl = sdk.applications.getAppUrl({ name, url })
  checkAppUrl(ctx, apps, appUrl)

  const instanceConfig: AppTemplate = {
    useTemplate,
    key: templateKey,
  }
  if (ctx.request.files && ctx.request.files.fileToImport) {
    instanceConfig.file = {
      ...(ctx.request.files.fileToImport as any),
      password: encryptionPassword,
    }
  } else if (typeof body.file?.path === "string") {
    instanceConfig.file = {
      path: body.file?.path,
    }
  }

  const tenantId = tenancy.isMultiTenant() ? tenancy.getTenantId() : null
  const appId = generateDevAppID(generateAppID(tenantId))

  return await context.doInAppContext(appId, async () => {
    const instance = await createInstance(appId, instanceConfig)
    const db = context.getAppDB()
    const isImport = !!instanceConfig.file
    const addSampleData = !isImport && !useTemplate

    if (instanceConfig.useTemplate && !instanceConfig.file) {
      await updateUserColumns(appId, db, ctx.user._id!)
    }

    let newApplication: App = {
      _id: DocumentType.APP_METADATA,
      _rev: undefined,
      appId,
      type: "app",
      version: envCore.VERSION,
      componentLibraries: ["@budibase/standard-components"],
      name: name,
      url: appUrl,
      template: templateKey,
      instance,
      tenantId: tenancy.getTenantId(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: AppStatus.DEV,
      navigation: defaultAppNavigator(name),
      theme: DefaultAppTheme,
      customTheme: {
        primaryColor: "var(--spectrum-global-color-blue-700)",
        primaryColorHover: "var(--spectrum-global-color-blue-600)",
        buttonBorderRadius: "16px",
      },
      features: {
        componentValidation: true,
        disableUserMetadata: true,
        skeletonLoader: true,
      },
      creationVersion: undefined,
    }

    if (!isImport) {
      newApplication.creationVersion = envCore.VERSION
    }

    const existing = await sdk.applications.metadata.tryGet()
    // If we used a template or imported an app there will be an existing doc.
    // Fetch and migrate some metadata from the existing app.
    if (existing) {
      const keys: (keyof App)[] = [
        "_rev",
        "navigation",
        "theme",
        "customTheme",
        "icon",
        "snippets",
        "creationVersion",
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
      const navigation = await migrateAppNavigation()
      if (navigation) {
        newApplication.navigation = navigation
      }
    }

    const response = await db.put(newApplication, { force: true })
    newApplication._rev = response.rev

    if (!env.USE_LOCAL_COMPONENT_LIBS) {
      await uploadAppFiles(appId)
    }

    // Add sample datasource and example screen for non-templates/non-imports
    if (addSampleData) {
      try {
        await addSampleDataDocs()
        await addSampleDataScreen()

        // Fetch the latest version of the app after these changes
        newApplication = await sdk.applications.metadata.get()
      } catch (err) {
        ctx.throw(400, "App created, but failed to add sample data")
      }
    }

    const latestMigrationId = appMigrations.getLatestEnabledMigrationId()
    if (latestMigrationId) {
      if (useTemplate) {
        await processMigrations(appId)
      } else if (!isImport) {
        // Initialise the app migration version as the latest one
        await appMigrations.updateAppMigrationMetadata({
          appId,
          version: latestMigrationId,
          skipHistory: true,
        })
      }
    }

    await cache.app.invalidateAppMetadata(appId, newApplication)
    return newApplication
  })
}

async function updateUserColumns(
  appId: string,
  db: Database,
  toUserId: string
) {
  await context.doInAppContext(appId, async () => {
    const allTables = await sdk.tables.getAllTables()
    const tablesWithUserColumns = []
    for (const table of allTables) {
      const userColumns = Object.values(table.schema).filter(
        f =>
          (f.type === FieldType.BB_REFERENCE ||
            f.type === FieldType.BB_REFERENCE_SINGLE) &&
          f.subtype === BBReferenceFieldSubType.USER
      )
      if (!userColumns.length) {
        continue
      }

      tablesWithUserColumns.push({
        tableId: table._id!,
        columns: userColumns.map(c => c.name),
      })
    }

    const docsToUpdate = []

    for (const { tableId, columns } of tablesWithUserColumns) {
      const docs = await db.allDocs<Row>(
        docIds.getRowParams(tableId, null, { include_docs: true })
      )
      const rows = docs.rows.map(d => d.doc!)

      for (const row of rows) {
        let shouldUpdate = false
        const updatedColumns = columns.reduce<Row>((newColumns, column) => {
          if (row[column]) {
            shouldUpdate = true
            if (Array.isArray(row[column])) {
              newColumns[column] = row[column]?.map(() => toUserId)
            } else if (row[column]) {
              newColumns[column] = toUserId
            }
          }
          return newColumns
        }, {})

        if (shouldUpdate) {
          docsToUpdate.push({
            ...row,
            ...updatedColumns,
          })
        }
      }
    }

    await db.bulkDocs(docsToUpdate)
  })
}

async function creationEvents(request: BBRequest<CreateAppRequest>, app: App) {
  let creationFns: ((app: App) => Promise<void>)[] = []

  const { useTemplate, templateKey, file } = request.body
  if (useTemplate === "true") {
    // from template
    if (templateKey && templateKey !== "undefined") {
      creationFns.push(a => events.app.templateImported(a, templateKey))
    }
    // from file
    else if (request.files?.fileToImport) {
      creationFns.push(a => events.app.fileImported(a))
    }
    // from server file path
    else if (file) {
      // explicitly pass in the newly created app id
      creationFns.push(a => events.app.duplicated(a, app.appId))
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

async function appPostCreate(ctx: UserCtx<CreateAppRequest, App>, app: App) {
  await creationEvents(ctx.request, app)

  // app import, template creation and duplication
  if (ctx.request.body.useTemplate) {
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

  // If the user is a creator, we need to give them access to the new app
  if (sharedCoreSDK.users.hasCreatorPermissions(ctx.user)) {
    const user = await users.UserDB.getUser(ctx.user._id!)
    await users.addAppBuilder(user, app.appId)
  }
}

export async function create(
  ctx: UserCtx<CreateAppRequest, CreateAppResponse>
) {
  const newApplication = await quotas.addApp(() => performAppCreate(ctx))
  await appPostCreate(ctx, newApplication)
  await cache.bustCache(cache.CacheKey.CHECKLIST)
  ctx.body = newApplication
}

// This endpoint currently operates as a PATCH rather than a PUT
// Thus name and url fields are handled only if present
export async function update(
  ctx: UserCtx<UpdateAppRequest, UpdateAppResponse>
) {
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
  ctx.body = app
  builderSocket?.emitAppMetadataUpdate(ctx, {
    theme: app.theme,
    customTheme: app.customTheme,
    navigation: app.navigation,
    name: app.name,
    url: app.url,
    icon: app.icon,
    automations: {
      chainAutomations: app.automations?.chainAutomations,
    },
  })
}

export async function updateClient(
  ctx: UserCtx<void, UpdateAppClientResponse>
) {
  // Don't allow updating in dev
  if (env.isDev() && !env.isTest()) {
    ctx.throw(400, "Updating or reverting apps is not supported in dev")
  }
  // Get current app version
  const application = await sdk.applications.metadata.get()
  const currentVersion = application.version

  let manifest
  // Update client library and manifest
  if (!env.isTest()) {
    await backupClientLibrary(ctx.params.appId)
    manifest = await updateClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const updatedToVersion = envCore.VERSION
  const appPackageUpdates = {
    version: updatedToVersion,
    revertableVersion: currentVersion,
    features: {
      ...(application.features ?? {}),
      skeletonLoader: manifest?.features?.skeletonLoader ?? false,
    },
  }
  const app = await updateAppPackage(appPackageUpdates, ctx.params.appId)
  await events.app.versionUpdated(app, currentVersion, updatedToVersion)
  ctx.body = app
}

export async function revertClient(
  ctx: UserCtx<void, RevertAppClientResponse>
) {
  // Don't allow reverting in dev
  if (env.isDev() && !env.isTest()) {
    ctx.throw(400, "Updating or reverting apps is not supported in dev")
  }

  // Check app can be reverted
  const application = await sdk.applications.metadata.get()
  if (!application.revertableVersion) {
    ctx.throw(400, "There is no version to revert to")
  }

  let manifest
  // Update client library and manifest
  if (!env.isTest()) {
    manifest = await revertClientLibrary(ctx.params.appId)
  }

  // Update versions in app package
  const currentVersion = application.version
  const revertedToVersion = application.revertableVersion
  const appPackageUpdates = {
    version: revertedToVersion,
    revertableVersion: undefined,
    features: {
      ...(application.features ?? {}),
      skeletonLoader: manifest?.features?.skeletonLoader ?? false,
    },
  }
  const app = await updateAppPackage(appPackageUpdates, ctx.params.appId)
  await events.app.versionReverted(app, currentVersion, revertedToVersion)
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

async function invalidateAppCache(appId: string) {
  await cache.app.invalidateAppMetadata(dbCore.getDevAppID(appId))
  await cache.app.invalidateAppMetadata(dbCore.getProdAppID(appId))
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
  const app = await sdk.applications.metadata.get()
  const result = await db.destroy()
  await quotas.removeApp()
  await events.app.deleted(app)

  if (!env.USE_LOCAL_COMPONENT_LIBS) {
    await deleteAppFiles(appId)
  }

  await removeAppFromUserRoles(ctx, appId)
  await invalidateAppCache(appId)
  return result
}

async function preDestroyApp(ctx: UserCtx) {
  // invalidate the cache immediately in-case they are leading to
  // zombie appearing apps
  const appId = ctx.params.appId
  await invalidateAppCache(appId)
  const { rows } = await getUniqueRows([appId])
  ctx.rowCount = rows.length
}

async function postDestroyApp(ctx: UserCtx) {
  const rowCount = ctx.rowCount
  await groups.cleanupApp(ctx.params.appId)
  if (rowCount) {
    await quotas.removeRows(rowCount)
  }
}

export async function destroy(ctx: UserCtx<void, DeleteAppResponse>) {
  await preDestroyApp(ctx)
  const result = await destroyApp(ctx)
  await postDestroyApp(ctx)
  ctx.body = result
}

export async function unpublish(ctx: UserCtx<void, UnpublishAppResponse>) {
  const prodAppId = dbCore.getProdAppID(ctx.params.appId)
  const dbExists = await dbCore.dbExists(prodAppId)

  // check app has been published
  if (!dbExists) {
    return ctx.throw(400, "App has not been published.")
  }

  await appMigrations.doInMigrationLock(prodAppId, async () => {
    await preDestroyApp(ctx)
    await unpublishApp(ctx)
    await postDestroyApp(ctx)
  })
  builderSocket?.emitAppUnpublish(ctx)
  ctx.body = { message: "App unpublished." }
}

export async function sync(ctx: UserCtx<void, SyncAppResponse>) {
  const appId = ctx.params.appId
  try {
    ctx.body = await sdk.applications.syncApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err.message)
  }
}

export async function importToApp(
  ctx: UserCtx<ImportToUpdateAppRequest, ImportToUpdateAppResponse>
) {
  const { appId } = ctx.params
  const appExport = ctx.request.files?.appExport
  const password = ctx.request.body.encryptionPassword
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

/**
 * Create a copy of the latest dev application.
 * Performs an export of the app, then imports from the export dir path
 */
export async function duplicateApp(
  ctx: UserCtx<DuplicateAppRequest, DuplicateAppResponse>
) {
  const { name: appName, url: possibleUrl } = ctx.request.body
  const { appId: sourceAppId } = ctx.params
  const [app] = await dbCore.getAppsByIDs([sourceAppId])

  if (!app) {
    ctx.throw(404, "Source app not found")
  }

  const apps = (await dbCore.getAllApps({ dev: true })) as App[]

  checkAppName(ctx, apps, appName)
  const url = sdk.applications.getAppUrl({ name: appName, url: possibleUrl })
  checkAppUrl(ctx, apps, url)

  const tmpPath = await sdk.backups.exportApp(sourceAppId, {
    excludeRows: false,
    tar: false,
  })

  const createRequestBody: CreateAppRequest = {
    name: appName,
    url: possibleUrl,
    useTemplate: "true",
    // The app export path
    file: {
      path: tmpPath,
    },
  }

  // Build a new request
  const createRequest = {
    roleId: ctx.roleId,
    user: {
      ...ctx.user,
      _id: dbCore.getGlobalIDFromUserMetadataID(ctx.user._id || ""),
    },
    request: {
      body: createRequestBody,
    },
  } as UserCtx<CreateAppRequest, App>

  // Build the new application
  await create(createRequest)
  const { body: newApplication } = createRequest

  if (!newApplication) {
    ctx.throw(500, "There was a problem duplicating the application")
  }

  ctx.body = {
    duplicateAppId: newApplication?.appId,
    sourceAppId,
  }
}

export async function updateAppPackage(
  appPackage: Partial<App>,
  appId: string
) {
  return context.doInAppContext(appId, async () => {
    const db = context.getAppDB()
    const application = await sdk.applications.metadata.get()

    const newAppPackage: App = { ...application, ...appPackage }
    if (appPackage._rev !== application._rev) {
      newAppPackage._rev = application._rev
    }

    // Make sure that when saving down pwa settings, we don't override the keys with the enriched url
    if (appPackage.pwa && application.pwa) {
      if (appPackage.pwa.icons) {
        appPackage.pwa.icons = appPackage.pwa.icons.map((icon, i) =>
          icon.src.startsWith(objectStore.SIGNED_FILE_PREFIX) &&
          application?.pwa?.icons?.[i]
            ? { ...icon, src: application?.pwa?.icons?.[i].src }
            : icon
        )
      }
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
  const existing = await sdk.applications.metadata.get()
  const layouts: Layout[] = await getLayouts()
  const screens: Screen[] = await sdk.screens.fetch()

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
