import {
  DEFAULT_TENANT_ID,
  getTenantId,
  getTenantIDFromAppID,
  isMultiTenant,
  getPlatformURL,
} from "../context"
import {
  BBContext,
  TenantResolutionStrategy,
  GetTenantIdOptions,
} from "@budibase/types"
import { Header } from "../constants"

export function addTenantToUrl(url: string) {
  const tenantId = getTenantId()

  if (isMultiTenant()) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}

export const isUserInAppTenant = (appId: string, user?: any) => {
  let userTenantId
  if (user) {
    userTenantId = user.tenantId || DEFAULT_TENANT_ID
  } else {
    userTenantId = getTenantId()
  }
  const tenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  return tenantId === userTenantId
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
    const platformHost = new URL(getPlatformURL()).host.split(":")[0]
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
