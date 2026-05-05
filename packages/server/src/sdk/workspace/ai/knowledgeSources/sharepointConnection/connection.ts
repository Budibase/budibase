import { HTTPError } from "@budibase/backend-core"
import {
  AgentKnowledgeSourceConnection,
  AgentKnowledgeSourceType,
  KnowledgeSourceOption,
} from "@budibase/types"
import {
  getKnowledgeSourceConnection,
  updateKnowledgeSourceConnection,
} from ".."

type SharePointConnectionRecord = Pick<
  AgentKnowledgeSourceConnection,
  | "account"
  | "tokenEndpoint"
  | "accessToken"
  | "refreshToken"
  | "tokenType"
  | "expiresAt"
  | "clientId"
  | "clientSecret"
>

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

interface SharePointConnectionDoc extends AgentKnowledgeSourceConnection {
  sourceType: AgentKnowledgeSourceType.SHAREPOINT
}

const mapPersistedToCacheRecord = (
  doc: SharePointConnectionDoc
): SharePointConnectionRecord => {
  return {
    account: doc.account || "unknown",
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
  connectionId: string
): Promise<SharePointConnectionDoc | undefined> => {
  const doc =
    await getKnowledgeSourceConnection<SharePointConnectionDoc>(connectionId)
  if (doc?.sourceType !== AgentKnowledgeSourceType.SHAREPOINT) {
    return
  }
  if (!doc?.refreshToken) {
    return
  }
  return doc
}

const readConnection = async (
  connectionId: string
): Promise<SharePointConnectionRecord> => {
  const persistedConnection = await readPersistedConnection(connectionId)
  if (persistedConnection?.refreshToken) {
    return mapPersistedToCacheRecord(persistedConnection)
  }
  throw new HTTPError(
    "SharePoint is not connected. Connect SharePoint and try again.",
    400
  )
}

const refreshConnection = async (
  connectionId: string,
  connection: SharePointConnectionRecord
): Promise<SharePointConnectionRecord> => {
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
  const updated: SharePointConnectionRecord = {
    ...connection,
    accessToken: payload?.access_token || connection.accessToken,
    refreshToken: payload?.refresh_token || connection.refreshToken,
    tokenType: payload?.token_type || connection.tokenType || "Bearer",
    expiresAt: Date.now() + Math.max(expiresIn - 60, 0) * 1000,
  }

  const saved = await updateKnowledgeSourceConnection<SharePointConnectionDoc>(
    connectionId,
    {
      tokenEndpoint: updated.tokenEndpoint,
      accessToken: updated.accessToken,
      refreshToken: updated.refreshToken,
      tokenType: updated.tokenType,
      expiresAt: updated.expiresAt,
      clientId: updated.clientId,
      clientSecret: updated.clientSecret,
    }
  )

  if (!saved?._id) {
    throw new HTTPError("SharePoint connection is missing", 400)
  }

  return updated
}

export const getSharePointBearerToken = async (
  connectionId: string
): Promise<string> => {
  let connection = await readConnection(connectionId)
  const expiresAt = Number(connection.expiresAt || 0)
  if (!connection.accessToken || expiresAt <= Date.now()) {
    connection = await refreshConnection(connectionId, connection)
  }
  const tokenType = connection.tokenType?.trim() || "Bearer"
  return `${tokenType} ${connection.accessToken}`
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

  return Array.from(sitesById.values()).sort((a, b) =>
    (a.name || a.id).localeCompare(b.name || b.id)
  )
}

export const fetchSharePointSitesByConnection = async (
  connectionId: string
): Promise<KnowledgeSourceOption[]> => {
  const bearerToken = await getSharePointBearerToken(connectionId)
  return fetchSharePointSitesByBearerToken(bearerToken)
}

interface SharePointDrive {
  id?: string
}

interface SharePointDriveListResponse {
  value?: SharePointDrive[]
}

interface SharePointDriveItem {
  id?: string
  name?: string
  file?: {
    mimeType?: string
  }
  folder?: Record<string, unknown>
}

interface SharePointDriveItemsResponse {
  value?: SharePointDriveItem[]
  "@odata.nextLink"?: string
}

interface SharePointFileRef {
  driveId: string
  itemId: string
  filename: string
  path: string
  mimetype?: string
}

export const listSharePointDrives = async (
  bearerToken: string,
  siteId: string
): Promise<string[]> => {
  const response = await fetch(
    `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(
      siteId
    )}/drives?$top=200&$select=id`,
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  )
  if (!response.ok) {
    console.error("Failed to list SharePoint drives", {
      status: response.status,
      siteId,
    })
    throw new HTTPError(
      response.status === 401 || response.status === 403
        ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
        : `Failed to list SharePoint drives (${response.status})`,
      400
    )
  }
  const payload = (await response.json()) as SharePointDriveListResponse
  return (payload.value || []).map(drive => drive.id || "").filter(Boolean)
}

const listSharePointDriveItems = async (
  bearerToken: string,
  driveId: string,
  itemId?: string
): Promise<SharePointDriveItem[]> => {
  const initialPath = itemId
    ? `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/children?$top=200&$select=id,name,file,folder`
    : `${SHAREPOINT_API_BASE}/drives/${driveId}/root/children?$top=200&$select=id,name,file,folder`

  const items: SharePointDriveItem[] = []
  let nextLink = initialPath

  while (nextLink) {
    const response = await fetch(nextLink, {
      headers: {
        Authorization: bearerToken,
      },
    })
    if (!response.ok) {
      console.error("Failed to list SharePoint drive items", {
        status: response.status,
        driveId,
        hasItemId: !!itemId,
      })
      throw new HTTPError(
        response.status === 401 || response.status === 403
          ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
          : `Failed to list SharePoint drive items (${response.status})`,
        400
      )
    }

    const payload = (await response.json()) as SharePointDriveItemsResponse
    items.push(...(Array.isArray(payload.value) ? payload.value : []))
    const nextPageLink = payload?.["@odata.nextLink"]
    if (!nextPageLink) {
      nextLink = ""
      continue
    }

    if (!isAllowedSharePointNextLink(nextPageLink)) {
      throw new HTTPError("Invalid SharePoint pagination URL", 400)
    }
    nextLink = nextPageLink
  }

  return items
}

export const collectSharePointFilesRecursive = async (
  bearerToken: string,
  driveId: string,
  folderId?: string,
  parentPath = ""
): Promise<SharePointFileRef[]> => {
  const items = await listSharePointDriveItems(bearerToken, driveId, folderId)
  const files: SharePointFileRef[] = []

  for (const item of items) {
    const itemId = item.id
    const name = item.name
    if (!itemId || !name) {
      continue
    }

    if (item.folder) {
      const nextPath = parentPath ? `${parentPath}/${name}` : name
      files.push(
        ...(await collectSharePointFilesRecursive(
          bearerToken,
          driveId,
          itemId,
          nextPath
        ))
      )
      continue
    }

    if (!item.file) {
      continue
    }

    files.push({
      driveId,
      itemId,
      filename: name,
      path: parentPath ? `${parentPath}/${name}` : name,
      mimetype: item.file.mimeType || undefined,
    })
  }

  return files
}

export const downloadSharePointFileBuffer = async (
  bearerToken: string,
  driveId: string,
  itemId: string
) => {
  const response = await fetch(
    `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/content`,
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  )
  if (!response.ok) {
    console.error("Failed to download SharePoint file", {
      status: response.status,
      driveId,
      itemId,
    })
    throw new HTTPError(
      response.status === 401 || response.status === 403
        ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
        : `Failed to download SharePoint file (${response.status})`,
      400
    )
  }
  return Buffer.from(await response.arrayBuffer())
}
