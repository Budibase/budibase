// some test cases call functions directly, need to
// store an app ID to pretend there is a context
import env from "../environment"
import Context from "./Context"
import * as conversions from "../docIds/conversions"
import { getDB } from "../db/db"
import {
  DocumentType,
  SEPARATOR,
  StaticDatabases,
  DEFAULT_TENANT_ID,
} from "../constants"
import { Database, IdentityContext } from "@budibase/types"
import { ContextMap } from "./types"

let TEST_APP_ID: string | null = null

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
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
export function getTenantIDFromAppID(appId: string) {
  if (!appId) {
    return undefined
  }
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }
  const split = appId.split(SEPARATOR)
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

async function newContext(updates: ContextMap, task: any) {
  // see if there already is a context setup
  let context: ContextMap = updateContext(updates)
  return Context.run(context, task)
}

export async function doInAutomationContext(params: {
  appId: string
  automationId: string
  task: any
}): Promise<any> {
  const tenantId = getTenantIDFromAppID(params.appId)
  return newContext(
    {
      tenantId,
      appId: params.appId,
      automationId: params.automationId,
    },
    params.task
  )
}

export async function doInContext(appId: string, task: any): Promise<any> {
  const tenantId = getTenantIDFromAppID(appId)
  return newContext(
    {
      tenantId,
      appId,
    },
    task
  )
}

export async function doInTenant<T>(
  tenantId: string | null,
  task: () => T
): Promise<T> {
  // make sure default always selected in single tenancy
  if (!env.MULTI_TENANCY) {
    tenantId = tenantId || DEFAULT_TENANT_ID
  }

  const updates = tenantId ? { tenantId } : {}
  return newContext(updates, task)
}

export async function doInAppContext(
  appId: string | null,
  task: any
): Promise<any> {
  if (!appId && !env.isTest()) {
    throw new Error("appId is required")
  }

  let updates: ContextMap
  if (!appId) {
    updates = { appId: "" }
  } else {
    const tenantId = getTenantIDFromAppID(appId)
    updates = { appId }
    if (tenantId) {
      updates.tenantId = tenantId
    }
  }
  return newContext(updates, task)
}

export async function doInIdentityContext(
  identity: IdentityContext,
  task: any
): Promise<any> {
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

export function getAppId(): string | undefined {
  const context = Context.get()
  const foundId = context?.appId
  if (!foundId && env.isTest() && TEST_APP_ID) {
    return TEST_APP_ID
  } else {
    return foundId
  }
}

export const getProdAppId = () => {
  const appId = getAppId()
  if (!appId) {
    throw new Error("Could not get appId")
  }
  return conversions.getProdAppID(appId)
}

export function doInEnvironmentContext(
  values: Record<string, string>,
  task: any
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
  return getDB(baseGlobalDBName(context?.tenantId))
}

export function getAuditLogsDB(): Database {
  if (!getTenantId()) {
    throw new Error("No tenant ID found - cannot open audit log DB")
  }
  return getDB(getAuditLogDBName())
}

/**
 * Gets the app database based on whatever the request
 * contained, dev or prod.
 */
export function getAppDB(opts?: any): Database {
  const appId = getAppId()
  return getDB(appId, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will get the prod one.
 */
export function getProdAppDB(opts?: any): Database {
  const appId = getAppId()
  if (!appId) {
    throw new Error("Unable to retrieve prod DB - no app ID.")
  }
  return getDB(conversions.getProdAppID(appId), opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will get the dev one.
 */
export function getDevAppDB(opts?: any): Database {
  const appId = getAppId()
  if (!appId) {
    throw new Error("Unable to retrieve dev DB - no app ID.")
  }
  return getDB(conversions.getDevelopmentAppID(appId), opts)
}

export function isScim(): boolean {
  const context = Context.get()
  const scimCall = context?.isScim
  return !!scimCall
}
