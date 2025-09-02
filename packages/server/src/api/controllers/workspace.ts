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
  WorkspaceStatus,
  DocumentType,
  generateWorkspaceID,
  generateDevWorkspaceID,
  getLayoutParams,
  isDevWorkspaceID,
} from "../../db/utils"
import {
  cache,
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
  configs,
} from "@budibase/backend-core"
import { USERS_TABLE_SCHEMA, DEFAULT_BB_DATASOURCE_ID } from "../../constants"
import { buildDefaultDocs } from "../../db/defaultData/datasource_bb_default"
import { removeWorkspaceFromUserRoles } from "../../utilities/workerRequests"
import { doesUserHaveLock } from "../../utilities/redis"
import { cleanupAutomations } from "../../automations/utils"
import { getUniqueRows } from "../../utilities/usageQuota/rows"
import { groups, licensing, quotas } from "@budibase/pro"
import {
  Workspace,
  Layout,
  PlanType,
  Screen,
  UserCtx,
  CreateWorkspaceRequest,
  FetchWorkspaceDefinitionResponse,
  FetchWorkspacePackageResponse,
  DuplicateWorkspaceRequest,
  DuplicateWorkspaceResponse,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResponse,
  Database,
  FieldType,
  BBReferenceFieldSubType,
  Row,
  BBRequest,
  SyncWorkspaceResponse,
  CreateWorkspaceResponse,
  FetchWorkspacesResponse,
  UpdateWorkspaceClientResponse,
  RevertWorkspaceClientResponse,
  DeleteWorkspaceResponse,
  ImportToUpdateWorkspaceRequest,
  ImportToUpdateWorkspaceResponse,
  AddSampleDataResponse,
  UnpublishWorkspaceResponse,
  ErrorCode,
  FetchPublishedWorkspacesResponse,
} from "@budibase/types"
import { BASE_LAYOUT_PROP_IDS } from "../../constants/layouts"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"
import { DefaultAppTheme, sdk as sharedCoreSDK } from "@budibase/shared-core"
import * as workspaceMigrations from "../../workspaceMigrations"
import { createSampleDataTableScreen } from "../../constants/screens"
import { defaultAppNavigator } from "../../constants/definitions"
import { processMigrations } from "../../workspaceMigrations/migrationsProcessor"

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

function checkWorkspaceUrl(
  ctx: UserCtx,
  workspaces: Workspace[],
  url: string,
  currentWorkspaceId?: string
) {
  if (currentWorkspaceId) {
    workspaces = workspaces.filter(
      workspace => workspace.appId !== currentWorkspaceId
    )
  }
  if (workspaces.some(workspace => workspace.url === url)) {
    ctx.throw(400, "App URL is already in use.")
  }
}

function checkWorkspaceName(
  ctx: UserCtx,
  workspaces: Workspace[],
  name: string,
  currentWorkspaceId?: string
) {
  // TODO: Replace with Joi
  if (!name) {
    ctx.throw(400, "Name is required")
  }
  if (currentWorkspaceId) {
    workspaces = workspaces.filter(
      workspace => workspace.appId !== currentWorkspaceId
    )
  }
  if (workspaces.some(workspace => workspace.name === name)) {
    ctx.throw(400, "Workspace name is already in use.")
  }
}

interface WorkspaceTemplate {
  useTemplate?: boolean
  file?: {
    type?: string
    path: string
    password?: string
  }
  key?: string
}

async function createInstance(
  workspaceId: string,
  template: WorkspaceTemplate
) {
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
    await sdk.backups.importApp(workspaceId, db, template, opts)
  } else {
    // create the users table
    await db.put(USERS_TABLE_SCHEMA)
  }

  return { _id: workspaceId }
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

async function createDefaultWorkspaceApp(): Promise<string> {
  const workspaceMetadata = await sdk.workspaces.metadata.get()
  const workspaceApp = await sdk.workspaceApps.create({
    name: workspaceMetadata.name,
    url: "/",
    navigation: {
      ...defaultAppNavigator(workspaceMetadata.name),
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
  ctx: UserCtx<void, AddSampleDataResponse>
) => {
  await addSampleDataDocs()
  ctx.body = { message: "Sample tables added." }
}

export async function fetch(ctx: UserCtx<void, FetchWorkspacesResponse>) {
  const workspaces = await sdk.workspaces.fetch(
    ctx.query.status as WorkspaceStatus,
    ctx.user
  )

  ctx.body =
    await sdk.workspaces.enrichWithDefaultWorkspaceWorkspaceUrl(workspaces)
}
export async function fetchClientWorkspaces(
  ctx: UserCtx<void, FetchPublishedWorkspacesResponse>
) {
  const workspaces = await sdk.workspaces.fetch(
    WorkspaceStatus.DEPLOYED,
    ctx.user
  )

  const result: FetchPublishedWorkspacesResponse["apps"] = []
  for (const workspace of workspaces) {
    const workspaceApps = await db.doWithDB(workspace.appId, db =>
      sdk.workspaceApps.fetch(db)
    )
    for (const workspaceApp of workspaceApps) {
      // don't return disabled workspace apps
      if (workspaceApp.disabled) {
        continue
      }
      result.push({
        // This is used as idempotency key for rendering in the frontend
        appId: `${workspace.appId}_${workspaceApp._id}`,
        // TODO: this can be removed when the flag is cleaned from packages/builder/src/pages/builder/apps/index.svelte
        prodId: workspace.appId,
        name: `${workspaceApp.name}`,
        url: `${workspace.url}${workspaceApp.url || ""}`.replace(/\/$/, ""),
        updatedAt: workspace.updatedAt,
      })
    }
  }

  ctx.body = { apps: result }
}

export async function fetchAppDefinition(
  ctx: UserCtx<void, FetchWorkspaceDefinitionResponse>
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
  ctx: UserCtx<void, FetchWorkspacePackageResponse>
) {
  const workspaceId = context.getWorkspaceId()
  let [workspace, layouts, screens, license, recaptchaConfig] =
    await Promise.all([
      sdk.workspaces.metadata.get(),
      getLayouts(),
      sdk.screens.fetch(),
      licensing.cache.getCachedLicense(),
      configs.getRecaptchaConfig(),
    ])

  // Enrich plugin URLs
  workspace.usedPlugins = await objectStore.enrichPluginURLs(
    workspace.usedPlugins
  )

  // Enrich PWA icon URLs if they exist
  if (workspace.pwa?.icons && workspace.pwa.icons.length > 0) {
    workspace.pwa.icons = await objectStore.enrichPWAImages(workspace.pwa.icons)
  }

  // Only filter screens if the user is not a builder call
  const isBuilder =
    users.isBuilder(ctx.user, workspaceId) && !utils.isClient(ctx)

  const isDev = isDevWorkspaceID(ctx.params.workspaceId)
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
    // if the dev app is being served, allow the request regardless
    if (!matchedWorkspaceApp || (matchedWorkspaceApp.disabled && !isDev)) {
      ctx.throw("No matching workspace app found for URL path: " + urlPath, 404)
    }
    screens = screens.filter(s => s.workspaceAppId === matchedWorkspaceApp._id)

    workspace.navigation = matchedWorkspaceApp.navigation
  }

  const clientLibPath = objectStore.clientLibraryUrl(
    ctx.params.workspaceId,
    workspace.version
  )

  ctx.body = {
    application: { ...workspace, upgradableVersion: envCore.VERSION },
    licenseType: license?.plan.type || PlanType.FREE,
    screens,
    layouts,
    clientLibPath,
    hasLock: await doesUserHaveLock(workspace.appId, ctx.user),
    recaptchaKey: recaptchaConfig?.config.siteKey,
  }
}

async function performWorkspaceCreate(
  ctx: UserCtx<CreateWorkspaceRequest, CreateWorkspaceResponse>
) {
  const workspaces = (await dbCore.getAllWorkspaces({
    dev: true,
  })) as Workspace[]
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

  checkWorkspaceName(ctx, workspaces, name)
  const workspaceUrl = sdk.workspaces.getWorkspaceUrl({ name, url })
  checkWorkspaceUrl(ctx, workspaces, workspaceUrl)

  const instanceConfig: WorkspaceTemplate = {
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
  const workspaceId = generateDevWorkspaceID(generateWorkspaceID(tenantId))

  return await context.doInWorkspaceContext(workspaceId, async () => {
    const instance = await createInstance(workspaceId, instanceConfig)
    const db = context.getWorkspaceDB()
    const isImport = !!instanceConfig.file
    const addSampleData = isOnboarding && !isImport && !useTemplate

    if (instanceConfig.useTemplate && !instanceConfig.file) {
      await updateUserColumns(workspaceId, db, ctx.user._id!)
    }

    let newWorkspace: Workspace = {
      _id: DocumentType.WORKSPACE_METADATA,
      _rev: undefined,
      appId: workspaceId,
      type: "app",
      version: envCore.VERSION,
      componentLibraries: ["@budibase/standard-components"],
      name: name,
      url: workspaceUrl,
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
      newWorkspace.creationVersion = envCore.VERSION
    }

    const existing = await sdk.workspaces.metadata.tryGet()
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
          newWorkspace[key] = existing[key]
        }
      })

      // Keep existing feature flags
      if (!existing.features?.componentValidation) {
        newWorkspace.features!.componentValidation = false
      }
      if (!existing.features?.disableUserMetadata) {
        newWorkspace.features!.disableUserMetadata = false
      }

      // Migrate navigation settings and screens if required
      const navigation = await migrateAppNavigation()
      if (navigation) {
        newWorkspace.navigation = navigation
      }
    }

    const response = await db.put(newWorkspace, { force: true })
    newWorkspace._rev = response.rev

    if (!env.USE_LOCAL_COMPONENT_LIBS) {
      await uploadAppFiles(workspaceId)
    }

    // Add sample datasource and example screen for non-templates/non-imports
    if (addSampleData) {
      try {
        await createDefaultWorkspaceApp()
        await addSampleDataDocs()
        await addSampleDataScreen()

        // Fetch the latest version of the workspace after these changes
        newWorkspace = await sdk.workspaces.metadata.get()
      } catch (err) {
        ctx.throw(400, "Workspace created, but failed to add sample data")
      }
    }

    const latestMigrationId = workspaceMigrations.getLatestEnabledMigrationId()
    if (latestMigrationId) {
      if (useTemplate) {
        await processMigrations(workspaceId)
      } else if (!isImport) {
        // Initialise the workspace migration version as the latest one
        await workspaceMigrations.updateWorkspaceMigrationMetadata({
          workspaceId,
          version: latestMigrationId,
          skipHistory: true,
        })
      }
    }

    await disableAllAppsAndAutomations()

    await cache.workspace.invalidateWorkspaceMetadata(workspaceId, newWorkspace)
    return newWorkspace
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
  workspaceId: string,
  db: Database,
  toUserId: string
) {
  await context.doInWorkspaceContext(workspaceId, async () => {
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
  workspace: Workspace
) {
  let creationFns: ((workspace: Workspace) => Promise<void>)[] = []

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
      creationFns.push(a => events.app.duplicated(a, workspace.appId))
    }
    // unknown
    else {
      console.error("Could not determine template creation event")
    }
  }

  creationFns.push(a => events.app.created(a))

  for (let fn of creationFns) {
    await fn(workspace)
  }
}

async function workspacePostCreate(
  ctx: UserCtx<CreateWorkspaceRequest, Workspace>,
  workspace: Workspace
) {
  await creationEvents(ctx.request, workspace)

  // workspace import, template creation and duplication
  if (ctx.request.body.useTemplate) {
    const { rows } = await getUniqueRows([workspace.appId])
    const rowCount = rows ? rows.length : 0
    if (rowCount) {
      try {
        await context.doInWorkspaceContext(workspace.appId, () => {
          return quotas.addRows(rowCount)
        })
      } catch (err: any) {
        if (err.code && err.code === ErrorCode.USAGE_LIMIT_EXCEEDED) {
          // this import resulted in row usage exceeding the quota
          // delete the workspace
          // skip pre and post-steps as no rows have been added to quotas yet
          ctx.params.workspaceId = workspace.appId
          await destroyWorkspace(ctx)
        }
        throw err
      }
    }
  }

  // If the user is a creator, we need to give them access to the new workspace
  if (sharedCoreSDK.users.hasCreatorPermissions(ctx.user)) {
    const user = await users.UserDB.getUser(ctx.user._id!)
    await users.addAppBuilder(user, workspace.appId)
  }
}

export async function create(
  ctx: UserCtx<CreateWorkspaceRequest, CreateWorkspaceResponse>
) {
  const newWorkspace = await quotas.addApp(() => performWorkspaceCreate(ctx))
  await workspacePostCreate(ctx, newWorkspace)
  await cache.bustCache(cache.CacheKey.CHECKLIST)
  ctx.body = newWorkspace
}

export async function find(ctx: UserCtx) {
  ctx.body = await sdk.workspaces.metadata.get()
}

// This endpoint currently operates as a PATCH rather than a PUT
// Thus name and url fields are handled only if present
export async function update(
  ctx: UserCtx<UpdateWorkspaceRequest, UpdateWorkspaceResponse>
) {
  const workspaces = await dbCore.getAllWorkspaces({ dev: true })
  // validation
  const name = ctx.request.body.name,
    possibleUrl = ctx.request.body.url
  if (name) {
    checkWorkspaceName(ctx, workspaces, name, ctx.params.workspaceId)
  }
  const url = sdk.workspaces.getWorkspaceUrl({ name, url: possibleUrl })
  if (url) {
    checkWorkspaceUrl(ctx, workspaces, url, ctx.params.workspaceId)
    ctx.request.body.url = url
  }

  const workspace = await updateWorkspacePackage(
    ctx.request.body,
    ctx.params.appId
  )
  await events.app.updated(workspace)
  ctx.body = workspace
  builderSocket?.emitAppMetadataUpdate(ctx, {
    theme: workspace.theme,
    customTheme: workspace.customTheme,
    navigation: workspace.navigation,
    name: workspace.name,
    url: workspace.url,
    icon: workspace.icon,
    automations: {
      chainAutomations: workspace.automations?.chainAutomations,
    },
  })
}

export async function updateClient(
  ctx: UserCtx<void, UpdateWorkspaceClientResponse>
) {
  // Don't allow updating in dev
  if (env.isDev() && !env.isTest()) {
    ctx.throw(400, "Updating or reverting workspaces is not supported in dev")
  }
  // Get current workspace version
  let workspace = await sdk.workspaces.metadata.get()
  const currentVersion = workspace.version

  let manifest
  // Update client library and manifest
  if (!env.isTest()) {
    await backupClientLibrary(ctx.params.workspaceId)
    manifest = await updateClientLibrary(ctx.params.workspaceId)
  }

  // Update versions in workspace package
  const updatedToVersion = envCore.VERSION
  const workspacePackageUpdates = {
    version: updatedToVersion,
    revertableVersion: currentVersion,
    features: {
      ...(workspace.features ?? {}),
      skeletonLoader: manifest?.features?.skeletonLoader ?? false,
    },
  }
  workspace = await updateWorkspacePackage(
    workspacePackageUpdates,
    ctx.params.workspaceId
  )
  await events.app.versionUpdated(workspace, currentVersion, updatedToVersion)
  ctx.body = workspace
}

export async function revertClient(
  ctx: UserCtx<void, RevertWorkspaceClientResponse>
) {
  // Don't allow reverting in dev
  if (env.isDev() && !env.isTest()) {
    ctx.throw(400, "Updating or reverting workspaces is not supported in dev")
  }

  // Check workspace can be reverted
  let workspace = await sdk.workspaces.metadata.get()
  if (!workspace.revertableVersion) {
    ctx.throw(400, "There is no version to revert to")
  }

  let manifest
  // Update client library and manifest
  if (!env.isTest()) {
    manifest = await revertClientLibrary(ctx.params.appId)
  }

  // Update versions in workspace package
  const currentVersion = workspace.version
  const revertedToVersion = workspace.revertableVersion
  const workspacePackageUpdates = {
    version: revertedToVersion,
    revertableVersion: undefined,
    features: {
      ...(workspace.features ?? {}),
      skeletonLoader: manifest?.features?.skeletonLoader ?? false,
    },
  }
  workspace = await updateWorkspacePackage(
    workspacePackageUpdates,
    ctx.params.appId
  )
  await events.app.versionReverted(workspace, currentVersion, revertedToVersion)
  ctx.body = workspace
}

async function unpublishWorkspace(ctx: UserCtx) {
  let workspaceId = ctx.params.appId
  workspaceId = dbCore.getProdWorkspaceID(workspaceId)

  const db = context.getProdWorkspaceDB()
  const result = await db.destroy()

  await events.app.unpublished({ appId: workspaceId } as Workspace)

  // automations only in production
  await cleanupAutomations(workspaceId)

  await disableAllAppsAndAutomations()

  await cache.workspace.invalidateWorkspaceMetadata(workspaceId)
  return result
}

async function invalidateWorkspaceCache(workspaceId: string) {
  await cache.workspace.invalidateWorkspaceMetadata(
    dbCore.getDevWorkspaceID(workspaceId)
  )
  await cache.workspace.invalidateWorkspaceMetadata(
    dbCore.getProdWorkspaceID(workspaceId)
  )
}

async function destroyWorkspace(ctx: UserCtx) {
  let workspaceId = ctx.params.appId
  workspaceId = dbCore.getProdWorkspaceID(workspaceId)
  const devWorkspaceId = dbCore.getDevWorkspaceID(workspaceId)

  // check if we need to unpublish first
  if (await dbCore.dbExists(workspaceId)) {
    // workspace is deployed, run through unpublish flow
    await sdk.workspaces.syncWorkspace(devWorkspaceId, {
      automationOnly: true,
    })
    await unpublishWorkspace(ctx)
  }

  const db = dbCore.getDB(devWorkspaceId)
  // standard workspace deletion flow
  const workspace = await sdk.workspaces.metadata.get()
  const result = await db.destroy()
  await quotas.removeApp()
  await events.app.deleted(workspace)

  if (!env.USE_LOCAL_COMPONENT_LIBS) {
    await deleteAppFiles(workspaceId)
  }

  await removeWorkspaceFromUserRoles(ctx, workspaceId)
  await invalidateWorkspaceCache(workspaceId)
  return result
}

async function preDestroyWorkspace(ctx: UserCtx) {
  // invalidate the cache immediately in-case they are leading to
  // zombie appearing workspaces
  const workspaceId = ctx.params.appId
  await invalidateWorkspaceCache(workspaceId)
  const { rows } = await getUniqueRows([workspaceId])
  ctx.rowCount = rows.length
}

async function postDestroyWorkspace(ctx: UserCtx) {
  const rowCount = ctx.rowCount
  await groups.cleanupApp(ctx.params.appId)
  if (rowCount) {
    await quotas.removeRows(rowCount)
  }
}

export async function destroy(ctx: UserCtx<void, DeleteWorkspaceResponse>) {
  await preDestroyWorkspace(ctx)
  const result = await destroyWorkspace(ctx)
  await postDestroyWorkspace(ctx)
  ctx.body = result
}

export async function unpublish(
  ctx: UserCtx<void, UnpublishWorkspaceResponse>
) {
  const prodWorkspaceId = dbCore.getProdWorkspaceID(ctx.params.workspaceId)
  const dbExists = await dbCore.dbExists(prodWorkspaceId)

  // check workspace has been published
  if (!dbExists) {
    return ctx.throw(400, "Workspace has not been published.")
  }

  await workspaceMigrations.doInMigrationLock(prodWorkspaceId, async () => {
    await preDestroyWorkspace(ctx)
    await unpublishWorkspace(ctx)
    await postDestroyWorkspace(ctx)
  })
  builderSocket?.emitAppUnpublish(ctx)
  ctx.body = { message: "Workspace unpublished." }
}

export async function sync(ctx: UserCtx<void, SyncWorkspaceResponse>) {
  const workspaceId = ctx.params.appId
  try {
    ctx.body = await sdk.workspaces.syncWorkspace(workspaceId)
  } catch (err: any) {
    ctx.throw(err.status || 400, err.message)
  }
}

export async function importToWorkspace(
  ctx: UserCtx<ImportToUpdateWorkspaceRequest, ImportToUpdateWorkspaceResponse>
) {
  const { appId } = ctx.params
  const appExport = ctx.request.files?.appExport
  const password = ctx.request.body.encryptionPassword
  if (!appExport) {
    ctx.throw(400, "Must supply workspace export to import")
  }
  if (Array.isArray(appExport)) {
    ctx.throw(400, "Must only supply one workspace export")
  }
  const fileAttributes = { type: appExport.type!, path: appExport.path! }
  try {
    await sdk.workspaces.updateWithExport(appId, fileAttributes, password)
  } catch (err: any) {
    ctx.throw(
      500,
      `Unable to perform update, please retry - ${err?.message || err}`
    )
  }
  ctx.body = { message: "workspace updated" }
}

/**
 * Create a copy of the latest dev workspace.
 * Performs an export of the workspace, then imports from the export dir path
 */
export async function duplicateWorkspace(
  ctx: UserCtx<DuplicateWorkspaceRequest, DuplicateWorkspaceResponse>
) {
  const { name: workspaceName, url: possibleUrl } = ctx.request.body
  const { appId: sourceWorkspaceId } = ctx.params
  const [workspace] = await dbCore.getWorkspacesByIDs([sourceWorkspaceId])

  if (!workspace) {
    ctx.throw(404, "Source workspace not found")
  }

  const workspaces = await dbCore.getAllWorkspaces({ dev: true })

  checkWorkspaceName(ctx, workspaces, workspaceName)
  const url = sdk.workspaces.getWorkspaceUrl({
    name: workspaceName,
    url: possibleUrl,
  })
  checkWorkspaceUrl(ctx, workspaces, url)

  const tmpPath = await sdk.backups.exportApp(sourceWorkspaceId, {
    excludeRows: false,
    tar: false,
  })

  const createRequestBody: CreateWorkspaceRequest = {
    name: workspaceName,
    url: possibleUrl,
    useTemplate: "true",
    // The workspace export path
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

  // Build the new workspace
  await create(createRequest)
  const { body: newWorkspace } = createRequest

  if (!newWorkspace) {
    ctx.throw(500, "There was a problem duplicating the workspace")
  }

  ctx.body = {
    duplicateAppId: newWorkspace?.appId,
    sourceAppId: sourceWorkspaceId,
  }
}

export async function updateWorkspacePackage(
  workspacePackage: Partial<Workspace>,
  workspaceId: string
) {
  return context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const workspace = await sdk.workspaces.metadata.get()

    const newWorkspacePackage: Workspace = { ...workspace, ...workspacePackage }
    if (workspacePackage._rev !== workspace._rev) {
      newWorkspacePackage._rev = workspace._rev
    }

    // Make sure that when saving down pwa settings, we don't override the keys with the enriched url
    if (workspacePackage.pwa && workspace.pwa) {
      if (workspacePackage.pwa.icons) {
        workspacePackage.pwa.icons = workspacePackage.pwa.icons.map(
          (icon, i) =>
            icon.src.startsWith(objectStore.SIGNED_FILE_PREFIX) &&
            workspace?.pwa?.icons?.[i]
              ? { ...icon, src: workspace?.pwa?.icons?.[i].src }
              : icon
        )
      }
    }

    // the locked by property is attached by server but generated from
    // Redis, shouldn't ever store it
    delete newWorkspacePackage.lockedBy

    await db.put(newWorkspacePackage)
    // remove any cached metadata, so that it will be updated
    await cache.workspace.invalidateWorkspaceMetadata(workspaceId)
    return newWorkspacePackage
  })
}

async function migrateAppNavigation() {
  const db = context.getWorkspaceDB()
  const existing = await sdk.workspaces.metadata.get()
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
