import env from "../environment"
import { SEPARATOR, DocumentType } from "../db/constants"
import cls from "./FunctionContext"
import { dangerousGetDB, closeDB } from "../db"
import { baseGlobalDBName } from "../db/tenancy"
import { IdentityContext } from "@budibase/types"
import { DEFAULT_TENANT_ID as _DEFAULT_TENANT_ID } from "../constants"
import { ContextKey } from "./constants"
import {
  updateUsing,
  closeWithUsing,
  setAppTenantId,
  setIdentity,
  closeAppDBs,
  getContextDB,
} from "./utils"

export const DEFAULT_TENANT_ID = _DEFAULT_TENANT_ID

// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID: string | null = null

export const closeTenancy = async () => {
  let db
  try {
    if (env.USE_COUCH) {
      db = getGlobalDB()
    }
  } catch (err) {
    // no DB found - skip closing
    return
  }
  await closeDB(db)
  // clear from context now that database is closed/task is finished
  cls.setOnContext(ContextKey.TENANT_ID, null)
  cls.setOnContext(ContextKey.GLOBAL_DB, null)
}

// export const isDefaultTenant = () => {
//   return getTenantId() === DEFAULT_TENANT_ID
// }

export const isMultiTenant = () => {
  return env.MULTI_TENANCY
}

/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
export const getTenantIDFromAppID = (appId: string) => {
  if (!appId) {
    return null
  }
  const split = appId.split(SEPARATOR)
  const hasDev = split[1] === DocumentType.DEV
  if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
    return null
  }
  if (hasDev) {
    return split[2]
  } else {
    return split[1]
  }
}

// used for automations, API endpoints should always be in context already
export const doInTenant = (tenantId: string | null, task: any) => {
  // make sure default always selected in single tenancy
  if (!env.MULTI_TENANCY) {
    tenantId = tenantId || DEFAULT_TENANT_ID
  }
  // the internal function is so that we can re-use an existing
  // context - don't want to close DB on a parent context
  async function internal(opts = { existing: false }) {
    // set the tenant id + global db if this is a new context
    if (!opts.existing) {
      updateTenantId(tenantId)
    }

    try {
      // invoke the task
      return await task()
    } finally {
      await closeWithUsing(ContextKey.TENANCY_IN_USE, () => {
        return closeTenancy()
      })
    }
  }

  const existing = cls.getFromContext(ContextKey.TENANT_ID) === tenantId
  return updateUsing(ContextKey.TENANCY_IN_USE, existing, internal)
}

export const doInAppContext = (appId: string, task: any) => {
  if (!appId) {
    throw new Error("appId is required")
  }

  const identity = getIdentity()

  // the internal function is so that we can re-use an existing
  // context - don't want to close DB on a parent context
  async function internal(opts = { existing: false }) {
    // set the app tenant id
    if (!opts.existing) {
      setAppTenantId(appId)
    }
    // set the app ID
    cls.setOnContext(ContextKey.APP_ID, appId)

    // preserve the identity
    if (identity) {
      setIdentity(identity)
    }
    try {
      // invoke the task
      return await task()
    } finally {
      await closeWithUsing(ContextKey.APP_IN_USE, async () => {
        await closeAppDBs()
        await closeTenancy()
      })
    }
  }
  const existing = cls.getFromContext(ContextKey.APP_ID) === appId
  return updateUsing(ContextKey.APP_IN_USE, existing, internal)
}

export const doInIdentityContext = (identity: IdentityContext, task: any) => {
  if (!identity) {
    throw new Error("identity is required")
  }

  async function internal(opts = { existing: false }) {
    if (!opts.existing) {
      cls.setOnContext(ContextKey.IDENTITY, identity)
      // set the tenant so that doInTenant will preserve identity
      if (identity.tenantId) {
        updateTenantId(identity.tenantId)
      }
    }

    try {
      // invoke the task
      return await task()
    } finally {
      await closeWithUsing(ContextKey.IDENTITY_IN_USE, async () => {
        setIdentity(null)
        await closeTenancy()
      })
    }
  }

  const existing = cls.getFromContext(ContextKey.IDENTITY)
  return updateUsing(ContextKey.IDENTITY_IN_USE, existing, internal)
}

export const getIdentity = (): IdentityContext | undefined => {
  try {
    return cls.getFromContext(ContextKey.IDENTITY)
  } catch (e) {
    // do nothing - identity is not in context
  }
}

export const updateTenantId = (tenantId: string | null) => {
  cls.setOnContext(ContextKey.TENANT_ID, tenantId)
  if (env.USE_COUCH) {
    setGlobalDB(tenantId)
  }
}

export const updateAppId = async (appId: string) => {
  try {
    // have to close first, before removing the databases from context
    await closeAppDBs()
    cls.setOnContext(ContextKey.APP_ID, appId)
  } catch (err) {
    if (env.isTest()) {
      TEST_APP_ID = appId
    } else {
      throw err
    }
  }
}

export const setGlobalDB = (tenantId: string | null) => {
  const dbName = baseGlobalDBName(tenantId)
  const db = dangerousGetDB(dbName)
  cls.setOnContext(ContextKey.GLOBAL_DB, db)
  return db
}

export const getGlobalDB = () => {
  const db = cls.getFromContext(ContextKey.GLOBAL_DB)
  if (!db) {
    throw new Error("Global DB not found")
  }
  return db
}

export const isTenantIdSet = () => {
  const tenantId = cls.getFromContext(ContextKey.TENANT_ID)
  return !!tenantId
}

export const getTenantId = () => {
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }
  const tenantId = cls.getFromContext(ContextKey.TENANT_ID)
  if (!tenantId) {
    throw new Error("Tenant id not found")
  }
  return tenantId
}

export const getAppId = () => {
  const foundId = cls.getFromContext(ContextKey.APP_ID)
  if (!foundId && env.isTest() && TEST_APP_ID) {
    return TEST_APP_ID
  } else {
    return foundId
  }
}

/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
export const getAppDB = (opts?: any) => {
  return getContextDB(ContextKey.CURRENT_DB, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
export const getProdAppDB = (opts?: any) => {
  return getContextDB(ContextKey.PROD_DB, opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
export const getDevAppDB = (opts?: any) => {
  return getContextDB(ContextKey.DEV_DB, opts)
}
