import env from "../environment"
import { SEPARATOR, DocumentTypes } from "../db/constants"
import cls from "./FunctionContext"
import { dangerousGetDB, closeDB } from "../db"
import { getProdAppID, getDevelopmentAppID } from "../db/conversions"
import { baseGlobalDBName } from "../tenancy/utils"
import { IdentityContext } from "@budibase/types"
import { isEqual } from "lodash"
import { DEFAULT_TENANT_ID as _DEFAULT_TENANT_ID } from "../constants"

export const DEFAULT_TENANT_ID = _DEFAULT_TENANT_ID

// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID: string | null = null

enum ContextKeys {
  TENANT_ID = "tenantId",
  GLOBAL_DB = "globalDb",
  APP_ID = "appId",
  IDENTITY = "identity",
  // whatever the request app DB was
  CURRENT_DB = "currentDb",
  // get the prod app DB from the request
  PROD_DB = "prodDb",
  // get the dev app DB from the request
  DEV_DB = "devDb",
  DB_OPTS = "dbOpts",
  // check if something else is using the context, don't close DB
  TENANCY_IN_USE = "tenancyInUse",
  APP_IN_USE = "appInUse",
  IDENTITY_IN_USE = "identityInUse",
}

let openAppCount = 0
let closeAppCount = 0
let openTenancyCount = 0
let closeTenancyCount = 0

setInterval(function () {
  console.log("openAppCount: " + openAppCount)
  console.log("closeAppCount: " + closeAppCount)
  console.log("openTenancyCount: " + openTenancyCount)
  console.log("closeTenancyCount: " + closeTenancyCount)
  console.log("------------------ ")
}, 5000)

// this function makes sure the PouchDB objects are closed and
// fully deleted when finished - this protects against memory leaks
async function closeAppDBs() {
  const dbKeys = [
    ContextKeys.CURRENT_DB,
    ContextKeys.PROD_DB,
    ContextKeys.DEV_DB,
  ]
  for (let dbKey of dbKeys) {
    const db = cls.getFromContext(dbKey)
    if (!db) {
      continue
    }
    closeAppCount++
    await closeDB(db)
    // clear the DB from context, incase someone tries to use it again
    cls.setOnContext(dbKey, null)
  }
  // clear the app ID now that the databases are closed
  if (cls.getFromContext(ContextKeys.APP_ID)) {
    cls.setOnContext(ContextKeys.APP_ID, null)
  }
  if (cls.getFromContext(ContextKeys.DB_OPTS)) {
    cls.setOnContext(ContextKeys.DB_OPTS, null)
  }
}

export const closeTenancy = async () => {
  closeTenancyCount++
  if (env.USE_COUCH) {
    await closeDB(getGlobalDB())
  }
  // clear from context now that database is closed/task is finished
  cls.setOnContext(ContextKeys.TENANT_ID, null)
  cls.setOnContext(ContextKeys.GLOBAL_DB, null)
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
  const hasDev = split[1] === DocumentTypes.DEV
  if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
    return null
  }
  if (hasDev) {
    return split[2]
  } else {
    return split[1]
  }
}

const setAppTenantId = (appId: string) => {
  const appTenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  updateTenantId(appTenantId)
}

// used for automations, API endpoints should always be in context already
export const doInTenant = (tenantId: string | null, task: any) => {
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
      const using = cls.getFromContext(ContextKeys.TENANCY_IN_USE)
      if (!using || using <= 1) {
        await closeTenancy()
      } else {
        cls.setOnContext(using - 1)
      }
    }
  }

  const using = cls.getFromContext(ContextKeys.TENANCY_IN_USE)
  if (using && cls.getFromContext(ContextKeys.TENANT_ID) === tenantId) {
    // the tenant id of the current context matches the one we want to use
    // don't create a new context, just use the existing one
    cls.setOnContext(ContextKeys.TENANCY_IN_USE, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(ContextKeys.TENANCY_IN_USE, 1)
      return internal()
    })
  }
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
    cls.setOnContext(ContextKeys.APP_ID, appId)
    setAppTenantId(appId)

    // preserve the identity
    if (identity) {
      setIdentity(identity)
    }
    try {
      // invoke the task
      return await task()
    } finally {
      const using = cls.getFromContext(ContextKeys.APP_IN_USE)
      if (!using || using <= 1) {
        await closeAppDBs()
        await closeTenancy()
      } else {
        cls.setOnContext(using - 1)
      }
    }
  }
  const using = cls.getFromContext(ContextKeys.APP_IN_USE)
  if (using && cls.getFromContext(ContextKeys.APP_ID) === appId) {
    cls.setOnContext(ContextKeys.APP_IN_USE, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(ContextKeys.APP_IN_USE, 1)
      return internal()
    })
  }
}

export const doInIdentityContext = (identity: IdentityContext, task: any) => {
  if (!identity) {
    throw new Error("identity is required")
  }

  async function internal(opts = { existing: false }) {
    if (!opts.existing) {
      cls.setOnContext(ContextKeys.IDENTITY, identity)
      // set the tenant so that doInTenant will preserve identity
      if (identity.tenantId) {
        updateTenantId(identity.tenantId)
      }
    }

    try {
      // invoke the task
      return await task()
    } finally {
      const using = cls.getFromContext(ContextKeys.IDENTITY_IN_USE)
      if (!using || using <= 1) {
        setIdentity(null)
        await closeTenancy()
      } else {
        cls.setOnContext(using - 1)
      }
    }
  }

  const existing = cls.getFromContext(ContextKeys.IDENTITY)
  const using = cls.getFromContext(ContextKeys.IDENTITY_IN_USE)
  if (using && existing && existing._id === identity._id) {
    cls.setOnContext(ContextKeys.IDENTITY_IN_USE, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(ContextKeys.IDENTITY_IN_USE, 1)
      return internal({ existing: false })
    })
  }
}

const setIdentity = (identity: IdentityContext | null) => {
  cls.setOnContext(ContextKeys.IDENTITY, identity)
}

export const getIdentity = (): IdentityContext | undefined => {
  try {
    return cls.getFromContext(ContextKeys.IDENTITY)
  } catch (e) {
    // do nothing - identity is not in context
  }
}

export const updateTenantId = (tenantId: string | null) => {
  cls.setOnContext(ContextKeys.TENANT_ID, tenantId)
  if (env.USE_COUCH) {
    setGlobalDB(tenantId)
  }
}

export const updateAppId = async (appId: string) => {
  try {
    // have to close first, before removing the databases from context
    await closeAppDBs()
    cls.setOnContext(ContextKeys.APP_ID, appId)
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
  openTenancyCount++
  const db = dangerousGetDB(dbName)
  cls.setOnContext(ContextKeys.GLOBAL_DB, db)
  return db
}

export const getGlobalDB = () => {
  const db = cls.getFromContext(ContextKeys.GLOBAL_DB)
  if (!db) {
    throw new Error("Global DB not found")
  }
  return db
}

export const isTenantIdSet = () => {
  const tenantId = cls.getFromContext(ContextKeys.TENANT_ID)
  return !!tenantId
}

export const getTenantId = () => {
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }
  const tenantId = cls.getFromContext(ContextKeys.TENANT_ID)
  if (!tenantId) {
    throw new Error("Tenant id not found")
  }
  return tenantId
}

export const getAppId = () => {
  const foundId = cls.getFromContext(ContextKeys.APP_ID)
  if (!foundId && env.isTest() && TEST_APP_ID) {
    return TEST_APP_ID
  } else {
    return foundId
  }
}

function getContextDB(key: string, opts: any) {
  const dbOptsKey = `${key}${ContextKeys.DB_OPTS}`
  let storedOpts = cls.getFromContext(dbOptsKey)
  let db = cls.getFromContext(key)
  if (db && isEqual(opts, storedOpts)) {
    return db
  }

  const appId = getAppId()
  let toUseAppId

  switch (key) {
    case ContextKeys.CURRENT_DB:
      toUseAppId = appId
      break
    case ContextKeys.PROD_DB:
      toUseAppId = getProdAppID(appId)
      break
    case ContextKeys.DEV_DB:
      toUseAppId = getDevelopmentAppID(appId)
      break
  }
  openAppCount++
  db = dangerousGetDB(toUseAppId, opts)
  try {
    cls.setOnContext(key, db)
    if (opts) {
      cls.setOnContext(dbOptsKey, opts)
    }
  } catch (err) {
    if (!env.isTest()) {
      throw err
    }
  }
  return db
}

/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
export const getAppDB = (opts?: any) => {
  return getContextDB(ContextKeys.CURRENT_DB, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
export const getProdAppDB = (opts?: any) => {
  return getContextDB(ContextKeys.PROD_DB, opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
export const getDevAppDB = (opts?: any) => {
  return getContextDB(ContextKeys.DEV_DB, opts)
}
