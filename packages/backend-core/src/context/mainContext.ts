import {
  Database,
  IdentityContext,
  License,
  Snippet,
  Table,
  Workspace,
} from "@budibase/types"
import {
  DEFAULT_TENANT_ID,
  DocumentType,
  SEPARATOR,
  StaticDatabases,
} from "../constants"
import { getDB } from "../db/db"
import * as conversions from "../docIds/conversions"
import env from "../environment"
import Context from "./Context"
import { ContextMap } from "./types"

let TEST_WORKSPACE_ID: string | null = null

export function getGlobalDBName(tenantId?: string) {
  // tenant ID can be set externally, for example user API where
  // new tenants are being created, this may be the case
  if (!tenantId) {
    tenantId = getTenantId()
  }
  return baseGlobalDBName(tenantId)
}

export function getAuditLogDBName(tenantId?: string) {
  if (!tenantId) {
    tenantId = getTenantId()
  }
  if (tenantId === DEFAULT_TENANT_ID) {
    return StaticDatabases.AUDIT_LOGS.name
  } else {
    return `${tenantId}${SEPARATOR}${StaticDatabases.AUDIT_LOGS.name}`
  }
}

export function getScimDBName(tenantId?: string) {
  if (!tenantId) {
    tenantId = getTenantId()
  }
  if (tenantId === DEFAULT_TENANT_ID) {
    return StaticDatabases.SCIM_LOGS.name
  } else {
    return `${tenantId}${SEPARATOR}${StaticDatabases.SCIM_LOGS.name}`
  }
}

export function baseGlobalDBName(tenantId: string | undefined | null) {
  if (!tenantId || tenantId === DEFAULT_TENANT_ID) {
    return StaticDatabases.GLOBAL.name
  } else {
    return `${tenantId}${SEPARATOR}${StaticDatabases.GLOBAL.name}`
  }
}

export function getPlatformURL() {
  return env.PLATFORM_URL
}

export function isMultiTenant() {
  return !!env.MULTI_TENANCY
}

export function isTenantIdSet() {
  const context = Context.get()
  return !!context?.tenantId
}

export function isTenancyEnabled() {
  return env.MULTI_TENANCY
}

/**
 * Given a workspace ID this will attempt to retrieve the tenant ID from it.
 * @return The tenant ID found within the workspace ID.
 */
export function getTenantIDFromWorkspaceID(workspaceId: string) {
  if (!workspaceId) {
    return undefined
  }
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }
  const split = workspaceId.split(SEPARATOR)
  const hasDev = split[1] === DocumentType.DEV
  if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
    return undefined
  }
  if (hasDev) {
    return split[2]
  } else {
    return split[1]
  }
}

function updateContext(updates: ContextMap): ContextMap {
  let context: ContextMap
  try {
    context = Context.get()
  } catch (err) {
    // no context, start empty
    context = {}
  }
  context = {
    ...context,
    ...updates,
  }
  return context
}

async function newContext<T>(updates: ContextMap, task: () => T) {
  guardMigration()

  // see if there already is a context setup
  let context: ContextMap = updateContext(updates)
  return Context.run(context, task)
}

export async function doInAutomationContext<T>(params: {
  workspaceId: string
  automationId: string
  task: () => T
}): Promise<T> {
  await ensureSnippetContext()
  return await newContext(
    {
      tenantId: getTenantIDFromWorkspaceID(params.workspaceId),
      appId: params.workspaceId,
      automationId: params.automationId,
    },
    params.task
  )
}

export async function doInContext(
  workspaceId: string,
  task: any
): Promise<any> {
  const tenantId = getTenantIDFromWorkspaceID(workspaceId)
  return newContext(
    {
      tenantId,
      appId: workspaceId,
    },
    task
  )
}

export async function doInTenant<T>(
  tenantId: string | undefined,
  task: () => T
): Promise<T> {
  // make sure default always selected in single tenancy
  if (!env.MULTI_TENANCY) {
    tenantId = tenantId || DEFAULT_TENANT_ID
  }

  const updates = tenantId ? { tenantId } : {}
  return newContext(updates, task)
}

// We allow self-host licensed users to make use of some Budicloud services
// (e.g. Budibase AI). When they do this, they use their license key as an API
// key. We use that license key to identify the tenant ID, and we set the
// context to be self-host using cloud. This affects things like where their
// quota documents get stored (because we want to avoid creating a new global
// DB for each self-host tenant).
export async function doInSelfHostTenantUsingCloud<T>(
  tenantId: string,
  task: () => T
): Promise<T> {
  const updates = { tenantId, isSelfHostUsingCloud: true }
  return newContext(updates, task)
}

export async function doInLicenseContext<T>(
  license: License,
  task: () => T
): Promise<T> {
  return newContext({ license }, task)
}

export function getLicense(): License | undefined {
  const context = Context.get()
  return context?.license
}

export function isSelfHostUsingCloud() {
  const context = Context.get()
  return !!context?.isSelfHostUsingCloud
}

export function getSelfHostCloudDB() {
  const context = Context.get()
  if (!context || !context.isSelfHostUsingCloud) {
    throw new Error("Self-host cloud DB not found")
  }
  return getDB(StaticDatabases.SELF_HOST_CLOUD.name)
}

export async function doInWorkspaceContext<T>(
  workspaceId: string,
  task: () => T
): Promise<T> {
  return _doInWorkspaceContext(workspaceId, task)
}

async function _doInWorkspaceContext<T>(
  workspaceId: string,
  task: () => T,
  extraContextSettings?: ContextMap
): Promise<T> {
  if (!workspaceId) {
    throw new Error("workspaceId is required")
  }

  const tenantId = getTenantIDFromWorkspaceID(workspaceId)
  const updates: ContextMap = { appId: workspaceId, ...extraContextSettings }
  if (tenantId) {
    updates.tenantId = tenantId
  }

  return newContext(updates, task)
}

export async function doInIdentityContext<T>(
  identity: IdentityContext,
  task: () => T
): Promise<T> {
  if (!identity) {
    throw new Error("identity is required")
  }

  const context: ContextMap = {
    identity,
  }
  if (identity.tenantId) {
    context.tenantId = identity.tenantId
  }
  return newContext(context, task)
}

function guardMigration() {
  const context = Context.get()
  if (context?.isMigrating) {
    throw new Error(
      "The context cannot be changed, a migration is currently running"
    )
  }
}

export async function doInWorkspaceMigrationContext<T>(
  workspaceId: string,
  task: () => T
): Promise<T> {
  return _doInWorkspaceContext(workspaceId, task, {
    isMigrating: true,
  })
}

export function getIdentity(): IdentityContext | undefined {
  try {
    const context = Context.get()
    return context?.identity
  } catch (e) {
    // do nothing - identity is not in context
  }
}

export function getTenantId(): string {
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }
  const context = Context.get()
  const tenantId = context?.tenantId
  if (!tenantId) {
    throw new Error("Tenant id not found")
  }
  return tenantId
}

export function getAutomationId(): string | undefined {
  const context = Context.get()
  return context?.automationId
}

export function getWorkspaceId(): string | undefined {
  const context = Context.get()
  const foundId = context?.appId
  if (!foundId && env.isTest() && TEST_WORKSPACE_ID) {
    return TEST_WORKSPACE_ID
  } else {
    return foundId
  }
}

export function getIP(): string | undefined {
  const context = Context.get()
  return context?.ip
}

export const getDevWorkspaceId = () => {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not get workspaceId")
  }
  return conversions.getDevWorkspaceID(workspaceId)
}

export const getProdWorkspaceId = () => {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not get workspaceId")
  }
  return conversions.getProdWorkspaceID(workspaceId)
}

export function doInEnvironmentContext<T>(
  values: Record<string, string>,
  task: () => T
) {
  if (!values) {
    throw new Error("Must supply environment variables.")
  }
  const updates = {
    environmentVariables: values,
  }
  return newContext(updates, task)
}

export function doInScimContext(task: any) {
  const updates: ContextMap = {
    isScim: true,
  }
  return newContext(updates, task)
}

export function doInIPContext(ip: string, task: any) {
  return newContext({ ip }, task)
}

export async function ensureSnippetContext() {
  const ctx = getCurrentContext()

  // If we've already added snippets to context, continue
  if (!ctx || ctx.snippets) {
    return
  }

  // Otherwise get snippets for this workspace and update context
  let snippets: Snippet[] | undefined
  const db = getWorkspaceDB()
  if (db) {
    const workspace = await db.tryGet<Workspace>(
      DocumentType.WORKSPACE_METADATA
    )
    snippets = workspace?.snippets
  }

  // Always set snippets to a non-null value so that we can tell we've attempted
  // to load snippets
  ctx.snippets = snippets || []
}

export function getEnvironmentVariables() {
  const context = Context.get()
  if (!context.environmentVariables) {
    return null
  } else {
    return context.environmentVariables
  }
}

export function getGlobalDB(): Database {
  const context = Context.get()
  if (!context || (env.MULTI_TENANCY && !context.tenantId)) {
    throw new Error("Global DB not found")
  }
  if (context.isSelfHostUsingCloud) {
    throw new Error(
      "Global DB not found - self-host users using cloud don't have a global DB"
    )
  }
  return getDB(baseGlobalDBName(context?.tenantId))
}

export function getAuditLogsDB(): Database {
  if (!getTenantId()) {
    throw new Error("No tenant ID found - cannot open audit log DB")
  }
  return getDB(getAuditLogDBName())
}

/**
 * Gets the workspace database based on whatever the request
 * contained, dev or prod.
 */
export function getWorkspaceDB(opts?: any): Database {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Unable to retrieve workspace DB - no workspace ID.")
  }
  if (isSelfHostUsingCloud()) {
    throw new Error(
      "Workspace DB not found - self-host users using cloud don't have workspace DBs"
    )
  }
  return getDB(workspaceId, opts)
}

/**
 * This specifically gets the prod workspace ID, if the request
 * contained a development workspace ID, this will get the prod one.
 */
export function getProdWorkspaceDB(opts?: any): Database {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Unable to retrieve prod DB - no workspace ID.")
  }
  return getDB(conversions.getProdWorkspaceID(workspaceId), opts)
}

/**
 * This specifically gets the dev workspace ID, if the request
 * contained a prod workspace ID, this will get the dev one.
 */
export function getDevWorkspaceDB(opts?: any): Database {
  const workspaceId = getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Unable to retrieve dev DB - no workspace ID.")
  }
  return getDB(conversions.getDevWorkspaceID(workspaceId), opts)
}

export function isScim(): boolean {
  const context = Context.get()
  const scimCall = context?.isScim
  return !!scimCall
}

export function getCurrentContext(): ContextMap | undefined {
  try {
    return Context.get()
  } catch (e) {
    return undefined
  }
}

export function getFeatureFlags(
  key: string
): Record<string, boolean> | undefined {
  const context = getCurrentContext()
  if (!context) {
    return undefined
  }
  return context.featureFlagCache?.[key]
}

export function setFeatureFlags(key: string, value: Record<string, boolean>) {
  const context = getCurrentContext()
  if (!context) {
    return
  }
  context.featureFlagCache ??= {}
  context.featureFlagCache[key] = value
}

export function getFeatureFlagOverrides(): Record<string, boolean> {
  return getCurrentContext()?.featureFlagOverrides || {}
}

export async function doInFeatureFlagOverrideContext<T>(
  value: Record<string, boolean>,
  callback: () => Promise<T>
) {
  return await newContext({ featureFlagOverrides: value }, callback)
}

export function getTableForView(viewId: string): Table | undefined {
  const context = getCurrentContext()
  if (!context) {
    return
  }
  return context.viewToTableCache?.[viewId]
}

export function setTableForView(viewId: string, table: Table) {
  const context = getCurrentContext()
  if (!context) {
    return
  }
  context.viewToTableCache ??= {}
  context.viewToTableCache[viewId] = table
}
