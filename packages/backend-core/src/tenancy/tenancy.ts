import { doWithDB } from "../db"
import { queryPlatformView } from "../db/views"
import { StaticDatabases, ViewName } from "../db/constants"
import { getGlobalDBName } from "../db/tenancy"
import {
  getTenantId,
  DEFAULT_TENANT_ID,
  isMultiTenant,
  getTenantIDFromAppID,
} from "../context"
import env from "../environment"
import { PlatformUser } from "@budibase/types"

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

export const addTenantToUrl = (url: string) => {
  const tenantId = getTenantId()

  if (isMultiTenant()) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}

export const doesTenantExist = async (tenantId: string) => {
  return doWithDB(PLATFORM_INFO_DB, async (db: any) => {
    let tenants
    try {
      tenants = await db.get(TENANT_DOC)
    } catch (err) {
      // if theres an error the doc doesn't exist, no tenants exist
      return false
    }
    return (
      tenants &&
      Array.isArray(tenants.tenantIds) &&
      tenants.tenantIds.indexOf(tenantId) !== -1
    )
  })
}

export const tryAddTenant = async (
  tenantId: string,
  userId: string,
  email: string,
  afterCreateTenant: () => Promise<void>
) => {
  return doWithDB(PLATFORM_INFO_DB, async (db: any) => {
    const getDoc = async (id: string) => {
      if (!id) {
        return null
      }
      try {
        return await db.get(id)
      } catch (err) {
        return { _id: id }
      }
    }
    let [tenants, userIdDoc, emailDoc] = await Promise.all([
      getDoc(TENANT_DOC),
      getDoc(userId),
      getDoc(email),
    ])
    if (!Array.isArray(tenants.tenantIds)) {
      tenants = {
        _id: TENANT_DOC,
        tenantIds: [],
      }
    }
    let promises = []
    if (userIdDoc) {
      userIdDoc.tenantId = tenantId
      promises.push(db.put(userIdDoc))
    }
    if (emailDoc) {
      emailDoc.tenantId = tenantId
      emailDoc.userId = userId
      promises.push(db.put(emailDoc))
    }
    if (tenants.tenantIds.indexOf(tenantId) === -1) {
      tenants.tenantIds.push(tenantId)
      promises.push(db.put(tenants))
      await afterCreateTenant()
    }
    await Promise.all(promises)
  })
}

export const doWithGlobalDB = (tenantId: string, cb: any) => {
  return doWithDB(getGlobalDBName(tenantId), cb)
}

export const lookupTenantId = async (userId: string) => {
  return doWithDB(StaticDatabases.PLATFORM_INFO.name, async (db: any) => {
    let tenantId = env.MULTI_TENANCY ? DEFAULT_TENANT_ID : null
    try {
      const doc = await db.get(userId)
      if (doc && doc.tenantId) {
        tenantId = doc.tenantId
      }
    } catch (err) {
      // just return the default
    }
    return tenantId
  })
}

// lookup, could be email or userId, either will return a doc
export const getTenantUser = async (
  identifier: string
): Promise<PlatformUser | null> => {
  // use the view here and allow to find anyone regardless of casing
  // Use lowercase to ensure email login is case insensitive
  const response = queryPlatformView(ViewName.PLATFORM_USERS_LOWERCASE, {
    keys: [identifier.toLowerCase()],
    include_docs: true,
  }) as Promise<PlatformUser>
  return response
}

export const isUserInAppTenant = (appId: string, user: any) => {
  let userTenantId
  if (user) {
    userTenantId = user.tenantId || DEFAULT_TENANT_ID
  } else {
    userTenantId = getTenantId()
  }
  const tenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  return tenantId === userTenantId
}

export const getTenantIds = async () => {
  return doWithDB(PLATFORM_INFO_DB, async (db: any) => {
    let tenants
    try {
      tenants = await db.get(TENANT_DOC)
    } catch (err) {
      // if theres an error the doc doesn't exist, no tenants exist
      return []
    }
    return (tenants && tenants.tenantIds) || []
  })
}
