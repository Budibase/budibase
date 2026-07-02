import type { UserBuilderInfo } from "@budibase/types"
import { ACCOUNT_PORTAL_PATHS, BUILDER_URLS } from "../constants"
import { hasBuilderPermissions } from "../sdk/documents/users"

const FIND_ANY_HBS_REGEX = /{?{{([^{].*?)}}}?/g

export function applyBaseUrl(currentUrl: string, newBase: string): string {
  if (!newBase) {
    return currentUrl
  }
  const blocks: string[] = currentUrl.match(FIND_ANY_HBS_REGEX) ?? []
  const portBlocks: string[] = []

  // Substitute HBS blocks in port position with ':0' so new URL() can parse it
  let parseable = currentUrl
  for (const block of blocks) {
    const portPattern = `:${block}`
    if (parseable.includes(portPattern)) {
      portBlocks.push(block)
      parseable = parseable.replace(portPattern, ":0")
    }
  }

  const placeholder = (i: number) => `__hbs${i}__`
  const pathBlocks = blocks.filter(b => !portBlocks.includes(b))
  parseable = pathBlocks.reduce(
    (s, block, i) => s.replace(block, placeholder(i)),
    parseable
  )

  const restore = (s: string) =>
    pathBlocks.reduce((r, block, i) => r.replace(placeholder(i), block), s)

  const base = newBase.replace(/\/$/, "")
  try {
    const parsed = new URL(parseable)
    const path = parsed.pathname === "/" ? "" : parsed.pathname
    return base + restore(path + parsed.search + parsed.hash)
  } catch {
    const restored = restore(parseable)
    if (restored.startsWith("/")) {
      return base + restored
    }
    return base
  }
}

const normalizePath = (path?: string) => {
  if (!path) {
    return ""
  }
  return path.startsWith("/") ? path : `/${path}`
}

const normalizeBase = (base?: string | null) => {
  if (!base) {
    return ""
  }
  return base.endsWith("/") ? base.slice(0, -1) : base
}

const joinBaseAndPath = (base?: string | null, path?: string) => {
  const sanitizedPath = normalizePath(path)
  if (!base) {
    return sanitizedPath
  }
  const sanitizedBase = normalizeBase(base)
  if (!sanitizedPath) {
    return sanitizedBase
  }
  return `${sanitizedBase}${sanitizedPath}`
}

const trimTrailingSlash = (path: string) => path.replace(/\/+$/, "")

const normalizeAppUrl = (appUrl: string) =>
  trimTrailingSlash(normalizePath(appUrl))

export const accountPortalAccountUrl = (accountPortalUrl?: string | null) =>
  joinBaseAndPath(accountPortalUrl, ACCOUNT_PORTAL_PATHS.ACCOUNT)

export const accountPortalBillingUrl = (
  accountPortalUrl?: string | null,
  options?:
    | { tenantId?: string | null; purchasePrepaidAiCredits?: boolean }
    | string
    | null
) => {
  const resolvedOptions =
    typeof options === "string" || options == null
      ? { tenantId: options }
      : options

  const base = joinBaseAndPath(accountPortalUrl, ACCOUNT_PORTAL_PATHS.BILLING)
  const params = new URLSearchParams()

  if (resolvedOptions?.tenantId) {
    params.set("tenantId", resolvedOptions.tenantId)
  }
  if (resolvedOptions?.purchasePrepaidAiCredits) {
    params.set("purchasePrepaidAiCredits", "1")
  }

  const query = params.toString()
  return query ? `${base}?${query}` : base
}

export const accountPortalUpgradeUrl = (
  accountPortalUrl?: string | null,
  tenantId?: string | null
) => {
  if (tenantId) {
    const tenantPath = joinBaseAndPath(
      accountPortalUrl,
      ACCOUNT_PORTAL_PATHS.TENANTS
    )
    const encodedTenantId = encodeURIComponent(tenantId)
    return `${tenantPath}?managePlansTenantId=${encodedTenantId}`
  }

  return joinBaseAndPath(accountPortalUrl, ACCOUNT_PORTAL_PATHS.UPGRADE)
}

export const builderWorkspacesUrl = (builderBaseUrl?: string | null) =>
  joinBaseAndPath(builderBaseUrl, BUILDER_URLS.WORKSPACES)

export const builderSettingsEmailUrl = (builderBaseUrl?: string | null) =>
  joinBaseAndPath(builderBaseUrl, BUILDER_URLS.SETTINGS_EMAIL)

export const builderSettingsAuthUrl = (builderBaseUrl?: string | null) =>
  joinBaseAndPath(builderBaseUrl, BUILDER_URLS.SETTINGS_AUTH)

export const builderSettingsPeopleUsersUrl = (builderBaseUrl?: string | null) =>
  joinBaseAndPath(builderBaseUrl, BUILDER_URLS.SETTINGS_PEOPLE_USERS)

export const builderAppsUrl = (builderBaseUrl?: string | null) =>
  joinBaseAndPath(builderBaseUrl, BUILDER_URLS.APPS)

export const getDefaultPostLoginPath = (user?: UserBuilderInfo) =>
  hasBuilderPermissions(user) ? BUILDER_URLS.ROOT : BUILDER_URLS.APPS

const BUILDER_ONLY_PATH_PREFIXES = [
  `${BUILDER_URLS.ROOT}/workspace`,
  `${BUILDER_URLS.ROOT}/onboarding`,
  `${BUILDER_URLS.ROOT}/get-started`,
]

export const isBuilderOnlyReturnPath = (path: string) => {
  const normalized = trimTrailingSlash(path) || BUILDER_URLS.ROOT
  if (normalized === BUILDER_URLS.ROOT) {
    return true
  }
  return BUILDER_ONLY_PATH_PREFIXES.some(prefix =>
    normalized.startsWith(prefix)
  )
}

export const resolvePostLoginReturnPath = (
  user: UserBuilderInfo | undefined,
  returnUrl: string
) => {
  if (!hasBuilderPermissions(user) && isBuilderOnlyReturnPath(returnUrl)) {
    return BUILDER_URLS.APPS
  }
  return returnUrl
}

export const resolveUnauthenticatedReturnPath = (pathname: string) => {
  const normalized = trimTrailingSlash(pathname) || BUILDER_URLS.ROOT
  if (normalized === BUILDER_URLS.ROOT) {
    return BUILDER_URLS.APPS
  }
  return pathname
}

export const appChatUrl = (appUrl: string) =>
  `/app-chat${normalizeAppUrl(appUrl)}`

export const appAgentUrl = (appUrl: string, agentId: string) =>
  `${normalizeAppUrl(appUrl)}/agent/${encodeURIComponent(agentId)}`

export const agentChatUrl = (appUrl: string, agentId: string) =>
  appChatUrl(appAgentUrl(appUrl, agentId))

export const urlHelpers = {
  accountPortalAccountUrl,
  accountPortalBillingUrl,
  accountPortalUpgradeUrl,
  builderWorkspacesUrl,
  builderSettingsEmailUrl,
  builderSettingsAuthUrl,
  builderSettingsPeopleUsersUrl,
  builderAppsUrl,
  getDefaultPostLoginPath,
  isBuilderOnlyReturnPath,
  resolvePostLoginReturnPath,
  resolveUnauthenticatedReturnPath,
  appChatUrl,
  appAgentUrl,
  agentChatUrl,
}

export default urlHelpers
