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
  const SEARCH_PAGE_SIZE = 25
  const MAX_SEARCH_PAGES = 50

  interface GraphSearchResponse {
    value?: Array<{
      hitsContainers?: Array<{
        hits?: Array<{
          resource?: {
            id?: string
            name?: string
            displayName?: string
            webUrl?: string
          }
        }>
        moreResultsAvailable?: boolean
      }>
    }>
  }

  const fetchSearchPage = async (from: number) => {
    const response = await fetch(`${SHAREPOINT_API_BASE}/search/query`, {
      method: "POST",
      headers: {
        Authorization: bearerToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            entityTypes: ["site"],
            query: {
              queryString: "*",
            },
            fields: ["id", "displayName", "name", "webUrl"],
            from,
            size: SEARCH_PAGE_SIZE,
          },
        ],
      }),
    })
    if (!response.ok) {
      console.error("Failed to fetch SharePoint sites", {
        status: response.status,
      })
      let message = `Failed to fetch SharePoint sites (${response.status})`
      if (response.status === 401 || response.status === 403) {
        message =
          "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
      }
      throw new HTTPError(message, 400)
    }
    const json: GraphSearchResponse = await response.json()
    return json
  }

  let from = 0
  for (let page = 0; page < MAX_SEARCH_PAGES; page++) {
    const payload = await fetchSearchPage(from)
    const requestResults = Array.isArray(payload?.value) ? payload.value : []

    let hitsCount = 0
    let hasMoreResults = false

    for (const requestResult of requestResults) {
      const containers = Array.isArray(requestResult?.hitsContainers)
        ? requestResult.hitsContainers
        : []
      for (const container of containers) {
        const hits = Array.isArray(container?.hits) ? container.hits : []
        hitsCount += hits.length
        if (container?.moreResultsAvailable) {
          hasMoreResults = true
        }
        for (const hit of hits) {
          const resource = hit?.resource
          if (!resource) {
            continue
          }

          const id = resource?.id
          if (!id) {
            continue
          }
          sitesById.set(id, {
            id,
            name: resource.displayName || resource.name,
            webUrl: resource.webUrl,
          })
        }
      }
    }

    if (!hasMoreResults || hitsCount === 0) {
      break
    }
    from += SEARCH_PAGE_SIZE
  }

  return Array.from(sitesById.values())
}

export const fetchSharePointSitesByConnection = async (
  connectionKey: string
): Promise<KnowledgeSourceOption[]> => {
  const bearerToken = await getSharePointBearerToken(connectionKey)
  return fetchSharePointSitesByBearerToken(bearerToken)
}
