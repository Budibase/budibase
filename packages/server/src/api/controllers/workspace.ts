import {
  cache,
  configs,
  context,
  db,
  db as dbCore,
  docIds,
  env as envCore,
  events,
  objectStore,
  roles,
  tenancy,
  users,
  utils,
} from "@budibase/backend-core"
import { groups, licensing, quotas } from "@budibase/pro"
import { DefaultAppTheme, sdk as sharedCoreSDK } from "@budibase/shared-core"
import {
  AddWorkspaceSampleDataResponse,
  BBReferenceFieldSubType,
  BBRequest,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  Database,
  DeleteWorkspaceResponse,
  DuplicateWorkspaceRequest,
  DuplicateWorkspaceResponse,
  ErrorCode,
  FetchAppDefinitionResponse,
  FetchAppPackageResponse,
  FetchPublishedAppsResponse,
  FetchWorkspacesResponse,
  FieldType,
  ImportToUpdateWorkspaceRequest,
  ImportToUpdateWorkspaceResponse,
  Layout,
  PlanType,
  RevertAppClientResponse,
  Row,
  Screen,
  SyncWorkspaceResponse,
  UnpublishWorkspaceResponse,
  UpdateAppClientResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  UserCtx,
  Workspace,
} from "@budibase/types"
import { cleanupAutomations } from "../../automations/utils"
import { DEFAULT_BB_DATASOURCE_ID, USERS_TABLE_SCHEMA } from "../../constants"
import { defaultAppNavigator } from "../../constants/definitions"
import { BASE_LAYOUT_PROP_IDS } from "../../constants/layouts"
import { createSampleDataTableScreen } from "../../constants/screens"
import { buildDefaultDocs } from "../../db/defaultData/datasource_bb_default"
import {
  DocumentType,
  generateWorkspaceID,
  getDevWorkspaceID,
  getLayoutParams,
  isDevWorkspaceID,
  WorkspaceStatus,
} from "../../db/utils"
import {
  createAllSearchIndex,
  createLinkView,
  createRoutingView,
} from "../../db/views/staticViews"
import env from "../../environment"
import sdk from "../../sdk"
import {
  backupClientLibrary,
  deleteAppFiles,
  revertClientLibrary,
  updateClientLibrary,
  uploadAppFiles,
} from "../../utilities/fileSystem"
import { doesUserHaveLock } from "../../utilities/redis"
import { getUniqueRows } from "../../utilities/usageQuota/rows"
import { removeAppFromUserRoles } from "../../utilities/workerRequests"
import { builderSocket } from "../../websockets"
import * as workspaceMigrations from "../../workspaceMigrations"
import { processMigrations } from "../../workspaceMigrations/migrationsProcessor"

const DEFAULT_WORKSPACE_NAME = "Default workspace"

// utility function, need to do away with this
async function getLayouts() {
  const db = context.getWorkspaceDB()
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
  apps: Workspace[],
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
  apps: Workspace[],
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
  const db = context.getWorkspaceDB()
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
  const db = context.getWorkspaceDB()
  try {
    // Check if default datasource exists before creating it
    await sdk.datasources.get(DEFAULT_BB_DATASOURCE_ID)
  } catch (err: any) {
    const defaultDbDocs = await buildDefaultDocs()

    // add in the default db data docs - tables, datasource, rows and links
    await db.bulkDocs([...defaultDbDocs])
  }
}

async function createDefaultWorkspaceApp(name: string): Promise<string> {
  const workspaceApp = await sdk.workspaceApps.create({
    name: name,
    url: "/",
    navigation: {
      ...defaultAppNavigator(name),
      links: [],
    },
    disabled: true,
    isDefault: true,
  })

  return workspaceApp._id!
}

async function addSampleDataScreen() {
  const workspaceApps = await sdk.workspaceApps.fetch(context.getWorkspaceDB())
  const workspaceApp = workspaceApps.find(wa => wa.isDefault)

  if (!workspaceApp) {
    throw new Error("Default workspace app not found")
  }

  workspaceApp.navigation.links = workspaceApp.navigation.links || []
  workspaceApp.navigation.links.push({
    text: "Inventory",
    url: "/inventory",
    type: "link",
    roleId: roles.BUILTIN_ROLE_IDS.BASIC,
  })

  await sdk.workspaceApps.update(workspaceApp)

  const screen = createSampleDataTableScreen(workspaceApp._id!)
  await sdk.screens.create(screen)
}

export const addSampleData = async (
  ctx: UserCtx<void, AddWorkspaceSampleDataResponse>
) => {
  await addSampleDataDocs()
  ctx.body = { message: "Sample tables added." }
}

export async function fetch(ctx: UserCtx<void, FetchWorkspacesResponse>) {
  const apps = await sdk.applications.fetch(
    ctx.query.status as WorkspaceStatus,
    ctx.user
  )

  ctx.body = await sdk.applications.enrichWithDefaultWorkspaceAppUrl(apps)
}
export async function fetchClientApps(
  ctx: UserCtx<void, FetchPublishedAppsResponse>
) {
  const apps = await sdk.applications.fetch(WorkspaceStatus.DEPLOYED, ctx.user)

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
  const appId = context.getWorkspaceId()
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

  const isDev = isDevWorkspaceID(ctx.params.appId)
  if (!isBuilder) {
    const userRoleId = getUserRoleId(ctx)
    const accessController = new roles.AccessController()
    screens = await accessController.checkScreensAccess(screens, userRoleId)

    const embedPath: string | undefined = ctx.request.get(
      "x-budibase-embed-location"
    )

    const urlPath =
      embedPath ||
      (ctx.headers.referer ? new URL(ctx.headers.referer).pathname : "")

    const matchedWorkspaceApp =
      await sdk.workspaceApps.getMatchedWorkspaceApp(urlPath)

    // disabled workspace apps should appear to not exist
    // if the dev workspace is being served, allow the request regardless
    if (!matchedWorkspaceApp || (matchedWorkspaceApp.disabled && !isDev)) {
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
  ctx: UserCtx<CreateWorkspaceRequest, CreateWorkspaceResponse>
) {
  const workspaces = await dbCore.getAllWorkspaces({
    dev: true,
  })
  const { body } = ctx.request
  const { name, url, encryptionPassword, templateKey } = body

  let isOnboarding = false
  if (typeof body.isOnboarding === "string") {
    isOnboarding = body.isOnboarding === "true"
  } else if (typeof body.isOnboarding === "boolean") {
    isOnboarding = body.isOnboarding
  }

  let useTemplate = false
  if (typeof body.useTemplate === "string") {
    useTemplate = body.useTemplate === "true"
  } else if (typeof body.useTemplate === "boolean") {
    useTemplate = body.useTemplate
  }

  checkAppName(ctx, workspaces, name)
  const appUrl = sdk.applications.getAppUrl({ name, url })
  checkAppUrl(ctx, workspaces, appUrl)

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
  const workspaceId = getDevWorkspaceID(generateWorkspaceID(tenantId))

  return await context.doInWorkspaceContext(workspaceId, async () => {
    const instance = await createInstance(workspaceId, instanceConfig)
    const db = context.getWorkspaceDB()
    const isImport = !!instanceConfig.file
    const addSampleData = isOnboarding && !isImport && !useTemplate

    if (instanceConfig.useTemplate && !instanceConfig.file) {
      await updateUserColumns(workspaceId, db, ctx.user._id!)
    }

    let newApplication: Workspace = {
      _id: DocumentType.WORKSPACE_METADATA,
      _rev: undefined,
      appId: workspaceId,
      type: "app",
      version: envCore.VERSION,
      componentLibraries: ["@budibase/standard-components"],
      name: isOnboarding ? DEFAULT_WORKSPACE_NAME : name,
      url: appUrl,
      template: templateKey,
      instance,
      tenantId: tenancy.getTenantId(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: WorkspaceStatus.DEV,
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
    // If we used a template or imported a workspace there will be an existing doc.
    // Fetch and migrate some metadata from the existing workspace.
    if (existing) {
      const keys: (keyof Workspace)[] = [
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

    await uploadAppFiles(workspaceId)

    // Add sample datasource and example screen for non-templates/non-imports
    if (addSampleData) {
      try {
        await createDefaultWorkspaceApp(name)
        await addSampleDataDocs()
        await addSampleDataScreen()

        // Fetch the latest version of the workspace after these changes
        newApplication = await sdk.applications.metadata.get()
      } catch (err) {
        ctx.throw(400, "App created, but failed to add sample data")
      }
    }

    const latestMigrationId = workspaceMigrations.getLatestEnabledMigrationId()
    if (latestMigrationId) {
      if (useTemplate) {
        await processMigrations(workspaceId)
      } else if (!isImport) {
        // Initialise the app migration version as the latest one
        await workspaceMigrations.updateAppMigrationMetadata({
          appId: workspaceId,
          version: latestMigrationId,
          skipHistory: true,
        })
      }
    }

    await disableAllAppsAndAutomations()

    await cache.workspace.invalidateWorkspaceMetadata(
      workspaceId,
      newApplication
    )
    return newApplication
  })
}

async function disableAllAppsAndAutomations() {
  const workspaceApps = await sdk.workspaceApps.fetch()
  for (const workspaceApp of workspaceApps.filter(a => !a.disabled)) {
    await sdk.workspaceApps.update({ ...workspaceApp, disabled: true })
  }

  const automations = await sdk.automations.fetch()
  for (const automation of automations.filter(a => !a.disabled)) {
    await sdk.automations.update({ ...automation, disabled: true })
  }
}

async function updateUserColumns(
  appId: string,
  db: Database,
  toUserId: string
) {
  await context.doInWorkspaceContext(appId, async () => {
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

async function creationEvents(
  request: BBRequest<CreateWorkspaceRequest>,
  app: Workspace
) {
  let creationFns: ((app: Workspace) => Promise<void>)[] = []

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
      // explicitly pass in the newly created workspace id
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

async function appPostCreate(
  ctx: UserCtx<CreateWorkspaceRequest, Workspace>,
  app: Workspace
) {
  await creationEvents(ctx.request, app)

  // app import, template creation and duplication
  if (ctx.request.body.useTemplate) {
    const { rows } = await getUniqueRows([app.appId])
    const rowCount = rows ? rows.length : 0
    if (rowCount) {
      try {
        await context.doInWorkspaceContext(app.appId, () => {
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
  ctx: UserCtx<CreateWorkspaceRequest, CreateWorkspaceResponse>
) {
  const newApplication = await quotas.addApp(() => performAppCreate(ctx))
  await appPostCreate(ctx, newApplication)
  await cache.bustCache(cache.CacheKey.CHECKLIST)
  ctx.body = newApplication
}

export async function find(ctx: UserCtx) {
  ctx.body = await sdk.applications.metadata.get()
}

// This endpoint currently operates as a PATCH rather than a PUT
// Thus name and url fields are handled only if present
export async function update(
  ctx: UserCtx<UpdateWorkspaceRequest, UpdateWorkspaceResponse>
) {
  const workspaces = await dbCore.getAllWorkspaces({
    dev: true,
  })
  // validation
  const name = ctx.request.body.name,
    possibleUrl = ctx.request.body.url
  if (name) {
    checkAppName(ctx, workspaces, name, ctx.params.appId)
  }
  const url = sdk.applications.getAppUrl({ name, url: possibleUrl })
  if (url) {
    checkAppUrl(ctx, workspaces, url, ctx.params.appId)
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
  // Get current workspace version
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
  appId = dbCore.getProdWorkspaceID(appId)

  const db = context.getProdWorkspaceDB()
  const result = await db.destroy()

  await events.app.unpublished({ appId } as Workspace)

  // automations only in production
  await cleanupAutomations(appId)

  await disableAllAppsAndAutomations()

  await cache.workspace.invalidateWorkspaceMetadata(appId)
  return result
}

async function invalidateAppCache(appId: string) {
  await cache.workspace.invalidateWorkspaceMetadata(
    dbCore.getDevWorkspaceID(appId)
  )
  await cache.workspace.invalidateWorkspaceMetadata(
    dbCore.getProdWorkspaceID(appId)
  )
}

async function destroyApp(ctx: UserCtx) {
  const prodAppId = dbCore.getProdWorkspaceID(ctx.params.appId)
  const devAppId = dbCore.getDevWorkspaceID(ctx.params.appId)

  const app = await sdk.applications.metadata.get()

  // check if we need to unpublish first
  if (await dbCore.dbExists(prodAppId)) {
    // app is deployed, run through unpublish flow
    await sdk.applications.syncApp(devAppId, {
      automationOnly: true,
    })
    await unpublishApp(ctx)
  }

  const db = dbCore.getDB(devAppId)
  // standard app deletion flow
  const result = await db.destroy()
  await quotas.removeApp()
  await events.app.deleted(app)

  await deleteAppFiles(prodAppId)

  await removeAppFromUserRoles(ctx, prodAppId)
  await invalidateAppCache(prodAppId)
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

export async function destroy(ctx: UserCtx<void, DeleteWorkspaceResponse>) {
  await preDestroyApp(ctx)
  const result = await destroyApp(ctx)
  await postDestroyApp(ctx)
  ctx.body = result
}

export async function unpublish(
  ctx: UserCtx<void, UnpublishWorkspaceResponse>
) {
  const prodAppId = dbCore.getProdWorkspaceID(ctx.params.appId)
  const dbExists = await dbCore.dbExists(prodAppId)

  // check app has been published
  if (!dbExists) {
    return ctx.throw(400, "App has not been published.")
  }

  await workspaceMigrations.doInMigrationLock(prodAppId, async () => {
    await preDestroyApp(ctx)
    await unpublishApp(ctx)
    await postDestroyApp(ctx)
  })
  builderSocket?.emitAppUnpublish(ctx)
  ctx.body = { message: "App unpublished." }
}

export async function sync(ctx: UserCtx<void, SyncWorkspaceResponse>) {
  const appId = ctx.params.appId
  try {
    ctx.body = await sdk.applications.syncApp(appId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err.message)
  }
}

export async function importToApp(
  ctx: UserCtx<ImportToUpdateWorkspaceRequest, ImportToUpdateWorkspaceResponse>
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
  ctx: UserCtx<DuplicateWorkspaceRequest, DuplicateWorkspaceResponse>
) {
  const { name: appName, url: possibleUrl } = ctx.request.body
  const { appId: sourceAppId } = ctx.params
  const [workspace] = await dbCore.getWorkspacesByIDs([sourceAppId])

  if (!workspace) {
    ctx.throw(404, "Source app not found")
  }

  const workspaces = await dbCore.getAllWorkspaces({
    dev: true,
  })

  checkAppName(ctx, workspaces, appName)
  const url = sdk.applications.getAppUrl({ name: appName, url: possibleUrl })
  checkAppUrl(ctx, workspaces, url)

  const tmpPath = await sdk.backups.exportApp(sourceAppId, {
    excludeRows: false,
    tar: false,
  })

  const createRequestBody: CreateWorkspaceRequest = {
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
  } as UserCtx<CreateWorkspaceRequest, Workspace>

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
  appPackage: Partial<Workspace>,
  appId: string
) {
  return context.doInWorkspaceContext(appId, async () => {
    const db = context.getWorkspaceDB()
    const application = await sdk.applications.metadata.get()

    const newAppPackage: Workspace = { ...application, ...appPackage }
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
    await cache.workspace.invalidateWorkspaceMetadata(appId)
    return newAppPackage
  })
}

async function migrateAppNavigation() {
  const db = context.getWorkspaceDB()
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
