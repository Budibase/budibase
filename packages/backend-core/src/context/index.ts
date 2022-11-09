import env from "../environment"
import { SEPARATOR, DocumentType } from "../db/constants"
import cls from "./FunctionContext"
import { baseGlobalDBName } from "../db/tenancy"
import { IdentityContext } from "@budibase/types"
import { DEFAULT_TENANT_ID as _DEFAULT_TENANT_ID } from "../constants"
import { ContextKey } from "./constants"
import { PouchLike } from "../couch"
import { getDevelopmentAppID, getProdAppID } from "../db/conversions"

export const DEFAULT_TENANT_ID = _DEFAULT_TENANT_ID

// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID: string | null = null

export const isMultiTenant = () => {
  return env.MULTI_TENANCY
}

const setAppTenantId = (appId: string) => {
  const appTenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  updateTenantId(appTenantId)
}

const setIdentity = (identity: IdentityContext | null) => {
  cls.setOnContext(ContextKey.IDENTITY, identity)
}

/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
export const getTenantIDFromAppID = (appId: string) => {
  if (!appId) {
    return null
  }
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
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

export const doInContext = async (appId: string, task: any) => {
  // gets the tenant ID from the app ID
  const tenantId = getTenantIDFromAppID(appId)
  return doInTenant(tenantId, async () => {
    return doInAppContext(appId, async () => {
      return task()
    })
  })
}

export const doInTenant = (tenantId: string | null, task: any): any => {
  // make sure default always selected in single tenancy
  if (!env.MULTI_TENANCY) {
    tenantId = tenantId || DEFAULT_TENANT_ID
  }

  return cls.run(async () => {
    updateTenantId(tenantId)
    return await task()
  })
}

export const doInAppContext = (appId: string, task: any): any => {
  if (!appId) {
    throw new Error("appId is required")
  }

  const identity = getIdentity()

  return cls.run(async () => {
    // set the app tenant id
    setAppTenantId(appId)
    // set the app ID
    cls.setOnContext(ContextKey.APP_ID, appId)

    // preserve the identity
    if (identity) {
      setIdentity(identity)
    }
    // invoke the task
    return await task()
  })
}

export const doInIdentityContext = (
  identity: IdentityContext,
  task: any
): any => {
  if (!identity) {
    throw new Error("identity is required")
  }

  return cls.run(async () => {
    cls.setOnContext(ContextKey.IDENTITY, identity)
    // set the tenant so that doInTenant will preserve identity
    if (identity.tenantId) {
      updateTenantId(identity.tenantId)
    }
    // invoke the task
    return await task()
  })
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
}

export const updateAppId = async (appId: string) => {
  try {
    cls.setOnContext(ContextKey.APP_ID, appId)
  } catch (err) {
    if (env.isTest()) {
      TEST_APP_ID = appId
    } else {
      throw err
    }
  }
}

export const getGlobalDB = (): PouchLike => {
  const tenantId = cls.getFromContext(ContextKey.TENANT_ID)
  return new PouchLike(baseGlobalDBName(tenantId))
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

export const isTenancyEnabled = () => {
  return env.MULTI_TENANCY
}

/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
export const getAppDB = (opts?: any): PouchLike => {
  const appId = getAppId()
  return new PouchLike(appId, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
export const getProdAppDB = (opts?: any): PouchLike => {
  const appId = getAppId()
  return new PouchLike(getProdAppID(appId), opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
export const getDevAppDB = (opts?: any): PouchLike => {
  const appId = getAppId()
  return new PouchLike(getDevelopmentAppID(appId), opts)
}
