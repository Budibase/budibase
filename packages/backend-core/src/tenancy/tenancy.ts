import { doWithDB, queryPlatformView, getGlobalDBName } from "../db"
import {
  DEFAULT_TENANT_ID,
  getTenantId,
  getTenantIDFromAppID,
  isMultiTenant,
} from "../context"
import env from "../environment"
import {
  BBContext,
  PlatformUser,
  TenantResolutionStrategy,
  GetTenantIdOptions,
} from "@budibase/types"
import { Header, StaticDatabases, ViewName } from "../constants"

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

export function addTenantToUrl(url: string) {
  const tenantId = getTenantId()

  if (isMultiTenant()) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}

export async function doesTenantExist(tenantId: string) {
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

export async function tryAddTenant(
  tenantId: string,
  userId: string,
  email: string,
  afterCreateTenant: () => Promise<void>
) {
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

export function doWithGlobalDB(tenantId: string, cb: any) {
  return doWithDB(getGlobalDBName(tenantId), cb)
}

export async function lookupTenantId(userId: string) {
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
export async function getTenantUser(
  identifier: string
): Promise<PlatformUser | undefined> {
  // use the view here and allow to find anyone regardless of casing
  // Use lowercase to ensure email login is case-insensitive
  const users = await queryPlatformView<PlatformUser>(
    ViewName.PLATFORM_USERS_LOWERCASE,
    {
      keys: [identifier.toLowerCase()],
      include_docs: true,
    }
  )
  if (Array.isArray(users)) {
    return users[0]
  } else {
    return users
  }
}

export function isUserInAppTenant(appId: string, user?: any) {
  let userTenantId
  if (user) {
    userTenantId = user.tenantId || DEFAULT_TENANT_ID
  } else {
    userTenantId = getTenantId()
  }
  const tenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  return tenantId === userTenantId
}

export async function getTenantIds() {
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

const ALL_STRATEGIES = Object.values(TenantResolutionStrategy)

export const getTenantIDFromCtx = (
  ctx: BBContext,
  opts: GetTenantIdOptions
): string | null => {
  // exit early if not multi-tenant
  if (!isMultiTenant()) {
    return DEFAULT_TENANT_ID
  }

  // opt defaults
  if (opts.allowNoTenant === undefined) {
    opts.allowNoTenant = false
  }
  if (!opts.includeStrategies) {
    opts.includeStrategies = ALL_STRATEGIES
  }
  if (!opts.excludeStrategies) {
    opts.excludeStrategies = []
  }

  const isAllowed = (strategy: TenantResolutionStrategy) => {
    // excluded takes precedence
    if (opts.excludeStrategies?.includes(strategy)) {
      return false
    }
    if (opts.includeStrategies?.includes(strategy)) {
      return true
    }
  }

  // always use user first
  if (isAllowed(TenantResolutionStrategy.USER)) {
    const userTenantId = ctx.user?.tenantId
    if (userTenantId) {
      return userTenantId
    }
  }

  // header
  if (isAllowed(TenantResolutionStrategy.HEADER)) {
    const headerTenantId = ctx.request.headers[Header.TENANT_ID]
    if (headerTenantId) {
      return headerTenantId as string
    }
  }

  // query param
  if (isAllowed(TenantResolutionStrategy.QUERY)) {
    const queryTenantId = ctx.request.query.tenantId
    if (queryTenantId) {
      return queryTenantId as string
    }
  }

  // subdomain
  if (isAllowed(TenantResolutionStrategy.SUBDOMAIN)) {
    // e.g. budibase.app or local.com:10000
    const platformHost = new URL(env.PLATFORM_URL).host.split(":")[0]
    // e.g. tenant.budibase.app or tenant.local.com
    const requestHost = ctx.host
    // parse the tenant id from the difference
    if (requestHost.includes(platformHost)) {
      const tenantId = requestHost.substring(
        0,
        requestHost.indexOf(`.${platformHost}`)
      )
      if (tenantId) {
        return tenantId
      }
    }
  }

  // path
  if (isAllowed(TenantResolutionStrategy.PATH)) {
    // params - have to parse manually due to koa-router not run yet
    const match = ctx.matched.find(
      (m: any) => !!m.paramNames.find((p: any) => p.name === "tenantId")
    )

    // get the raw path url - without any query params
    const ctxUrl = ctx.originalUrl
    let url
    if (ctxUrl.includes("?")) {
      url = ctxUrl.split("?")[0]
    } else {
      url = ctxUrl
    }

    if (match) {
      const params = match.params(url, match.captures(url), {})
      if (params.tenantId) {
        return params.tenantId
      }
    }
  }

  if (!opts.allowNoTenant) {
    ctx.throw(403, "Tenant id not set")
  }

  return null
}
