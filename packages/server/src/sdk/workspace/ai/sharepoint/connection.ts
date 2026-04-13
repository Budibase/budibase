import { HTTPError } from "@budibase/backend-core"
import type {
  AgentKnowledgeSourceConnection,
  AgentKnowledgeSourceType,
  KnowledgeSourceOption,
} from "@budibase/types"
import {
  deleteKnowledgeSourceConnection,
  getKnowledgeSourceConnection,
  hasKnowledgeSourceConnection,
  upsertKnowledgeSourceConnection,
} from "../knowledgeSources"

interface SharePointConnectionCacheRecord {
  tenantId: string
  tokenEndpoint: string
  accessToken: string
  refreshToken: string
  tokenType?: string
  expiresAt?: number
  clientId: string
  clientSecret: string
}

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const SHAREPOINT_API_BASE_URL = new URL(SHAREPOINT_API_BASE)

const trimString = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

export const isAllowedSharePointNextLink = (value: string): boolean => {
  try {
    const nextUrl = new URL(value)
    return (
      nextUrl.protocol === SHAREPOINT_API_BASE_URL.protocol &&
      nextUrl.hostname === SHAREPOINT_API_BASE_URL.hostname &&
      nextUrl.port === SHAREPOINT_API_BASE_URL.port &&
      (nextUrl.pathname === SHAREPOINT_API_BASE_URL.pathname ||
        nextUrl.pathname.startsWith(`${SHAREPOINT_API_BASE_URL.pathname}/`))
    )
  } catch {
    return false
  }
}

export const sharePointConnectionCacheKey = (scope: string, scopeId: string) =>
  `sharepoint:${scope}:${scopeId}:connection`

const SHAREPOINT_SOURCE_TYPE = "sharepoint"

interface SharePointConnectionDoc extends AgentKnowledgeSourceConnection {
  sourceType: AgentKnowledgeSourceType.SHAREPOINT
}

const persistConnection = async (
  connectionKey: string,
  connection: SharePointConnectionCacheRecord
) => {
  await upsertKnowledgeSourceConnection<SharePointConnectionDoc>(
    SHAREPOINT_SOURCE_TYPE,
    connectionKey,
    {
      tenantId: connection.tenantId,
      tokenEndpoint: connection.tokenEndpoint,
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      tokenType: connection.tokenType,
      expiresAt: connection.expiresAt,
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
    }
  )
}

const mapPersistedToCacheRecord = (
  doc: SharePointConnectionDoc
): SharePointConnectionCacheRecord => {
  return {
    tenantId: doc.tenantId,
    tokenEndpoint: doc.tokenEndpoint,
    accessToken: doc.accessToken,
    refreshToken: doc.refreshToken,
    tokenType: doc.tokenType,
    expiresAt: doc.expiresAt,
    clientId: doc.clientId,
    clientSecret: doc.clientSecret,
  }
}

const readPersistedConnection = async (
  connectionKey: string
): Promise<SharePointConnectionCacheRecord | undefined> => {
  const doc = await getKnowledgeSourceConnection<SharePointConnectionDoc>(
    SHAREPOINT_SOURCE_TYPE,
    connectionKey
  )
  if (!doc?.refreshToken) {
    return
  }
  return mapPersistedToCacheRecord(doc)
}

const readConnection = async (
  connectionKey: string
): Promise<SharePointConnectionCacheRecord> => {
  const persistedConnection = await readPersistedConnection(connectionKey)
  if (persistedConnection?.refreshToken) {
    return persistedConnection
  }
  throw new HTTPError(
    "SharePoint is not connected. Connect SharePoint and try again.",
    400
  )
}

const refreshConnection = async (
  connectionKey: string,
  connection: SharePointConnectionCacheRecord
): Promise<SharePointConnectionCacheRecord> => {
  const response = await fetch(connection.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: connection.clientId,
      client_secret: connection.clientSecret,
      grant_type: "refresh_token",
      refresh_token: connection.refreshToken,
    }),
  })
  const payload = await response.json()
  if (!response.ok) {
    console.error("Failed to refresh SharePoint OAuth credentials", {
      status: response.status,
      error: payload?.error,
      hasDescription: !!payload?.error_description,
    })
    throw new HTTPError("Failed to refresh SharePoint OAuth credentials", 400)
  }

  const expiresIn = Number(payload?.expires_in || 0)
  const updated: SharePointConnectionCacheRecord = {
    ...connection,
    accessToken: payload?.access_token || connection.accessToken,
    refreshToken: payload?.refresh_token || connection.refreshToken,
    tokenType: payload?.token_type || connection.tokenType || "Bearer",
    expiresAt: Date.now() + Math.max(expiresIn - 60, 0) * 1000,
  }
  await persistConnection(connectionKey, updated)
  return updated
}

export const getSharePointBearerToken = async (
  connectionKey: string
): Promise<string> => {
  let connection = await readConnection(connectionKey)
  const expiresAt = Number(connection.expiresAt || 0)
  if (!connection.accessToken || expiresAt <= Date.now()) {
    connection = await refreshConnection(connectionKey, connection)
  }
  const tokenType = connection.tokenType?.trim() || "Bearer"
  return `${tokenType} ${connection.accessToken}`
}

export const clearSharePointConnection = async (connectionKey: string) => {
  await deleteKnowledgeSourceConnection(SHAREPOINT_SOURCE_TYPE, connectionKey)
}

export const hasSharePointConnection = async (connectionKey: string) => {
  return hasKnowledgeSourceConnection(SHAREPOINT_SOURCE_TYPE, connectionKey)
}

export const fetchSharePointSitesByBearerToken = async (
  bearerToken: string
): Promise<KnowledgeSourceOption[]> => {
  const sitesById = new Map<string, KnowledgeSourceOption>()
  let currentPath = "/sites"
  let currentQuery = "search=*&$top=200&$select=id,name,webUrl"

  while (currentPath) {
    const response = await fetch(
      `${SHAREPOINT_API_BASE}${currentPath}?${currentQuery}`,
      {
        headers: {
          Authorization: bearerToken,
        },
      }
    )
    if (!response.ok) {
      console.error("Failed to fetch SharePoint sites", {
        status: response.status,
      })
      throw new HTTPError(
        response.status === 401 || response.status === 403
          ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
          : `Failed to fetch SharePoint sites (${response.status})`,
        400
      )
    }

    const payload = (await response.json()) as {
      value?: KnowledgeSourceOption[]
      "@odata.nextLink"?: string
    }

    for (const site of Array.isArray(payload?.value) ? payload.value : []) {
      const id = trimString(site.id)
      if (!id) {
        continue
      }
      sitesById.set(id, {
        id,
        name: trimString(site.name) || undefined,
        webUrl: trimString(site.webUrl) || undefined,
      })
    }

    const nextLink = trimString(payload?.["@odata.nextLink"])
    if (!nextLink) {
      break
    }
    if (!isAllowedSharePointNextLink(nextLink)) {
      throw new HTTPError("Invalid SharePoint pagination URL", 400)
    }

    const nextUrl = new URL(nextLink)
    currentPath = nextUrl.pathname.replace("/v1.0", "") || ""
    currentQuery = nextUrl.search.startsWith("?")
      ? nextUrl.search.slice(1)
      : nextUrl.search
  }

  return Array.from(sitesById.values())
}

export const fetchSharePointSitesByConnection = async (
  connectionKey: string
): Promise<KnowledgeSourceOption[]> => {
  const bearerToken = await getSharePointBearerToken(connectionKey)
  return fetchSharePointSitesByBearerToken(bearerToken)
}
