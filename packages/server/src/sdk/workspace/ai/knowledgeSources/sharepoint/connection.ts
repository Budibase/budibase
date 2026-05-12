import { HTTPError } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import {
  Datasource,
  KnowledgeSourceOption,
  OAuth2RestAuthConfig,
  isOAuth2ClientCredentialsAuthConfig,
} from "@budibase/types"
import sdk from "../../../.."

type OAuth2RestAuthConfigWithTokenCache = OAuth2RestAuthConfig & {
  accessToken?: string
  tokenType?: string
  expiresAt?: number
}

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const SHAREPOINT_API_BASE_URL = new URL(SHAREPOINT_API_BASE)
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504])
const RETRY_DELAYS_MS = [500, 1500, 3000]

const parseRetryAfterMs = (value: string | null): number | undefined => {
  if (!value) {
    return
  }

  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000
  }

  const dateMs = Date.parse(value)
  if (Number.isNaN(dateMs)) {
    return
  }

  return Math.max(0, dateMs - Date.now())
}

const requestWithRetries = async (
  operation: string,
  request: () => Promise<Response>
): Promise<Response> => {
  let attempt = 0

  while (true) {
    try {
      const response = await request()
      if (
        response.ok ||
        !RETRYABLE_STATUS_CODES.has(response.status) ||
        attempt >= RETRY_DELAYS_MS.length
      ) {
        return response
      }

      const retryAfterMs = parseRetryAfterMs(
        response.headers.get("Retry-After")
      )
      const delayMs = retryAfterMs ?? RETRY_DELAYS_MS[attempt]
      console.log("Retrying SharePoint Graph request after failure", {
        operation,
        attempt: attempt + 1,
        status: response.status,
        delayMs,
      })
      await helpers.wait(delayMs)
    } catch (error) {
      if (!(error instanceof Error) || attempt >= RETRY_DELAYS_MS.length) {
        throw error
      }

      const delayMs = RETRY_DELAYS_MS[attempt]
      console.log("Retrying SharePoint Graph request after network error", {
        operation,
        attempt: attempt + 1,
        delayMs,
        errorName: error.name,
      })
      await helpers.wait(delayMs)
    }

    attempt++
  }
}

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

const readConnection = async (
  datasourceId: string,
  authConfigId: string
): Promise<OAuth2RestAuthConfigWithTokenCache> => {
  let datasource: Datasource
  try {
    datasource = await sdk.datasources.get(datasourceId)
  } catch {
    throw new HTTPError("SharePoint auth config not found.", 400)
  }
  const authConfigs = datasource.config?.authConfigs as
    | OAuth2RestAuthConfigWithTokenCache[]
    | undefined
  const authConfig = authConfigs?.find(config => config._id === authConfigId)
  if (!authConfig) {
    throw new HTTPError("SharePoint auth config not found.", 400)
  }
  if (!isOAuth2ClientCredentialsAuthConfig(authConfig)) {
    throw new HTTPError(
      "SharePoint requires an OAuth2 client credentials auth config.",
      400
    )
  }
  if (!authConfig.url || !authConfig.clientId) {
    throw new HTTPError(
      "OAuth2 auth config is missing token URL or client ID.",
      400
    )
  }
  return authConfig
}

export const getSharePointBearerToken = async (
  datasourceId: string,
  authConfigId: string
): Promise<string> => {
  const connection = await readConnection(datasourceId, authConfigId)
  return sdk.oauth2.getTokenFromConfig(`${datasourceId}:${authConfigId}`, {
    url: connection.url,
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
    method: connection.method,
    grantType: connection.grantType,
    scope: connection.scope,
    audience: connection.audience,
  })
}

const fetchSharePointSitesByAppToken = async (
  bearerToken: string
): Promise<KnowledgeSourceOption[]> => {
  const sitesById = new Map<string, KnowledgeSourceOption>()
  let nextLink = `${SHAREPOINT_API_BASE}/sites?search=*&$top=200&$select=id,displayName,name,webUrl`

  const fetchSitesPage = async (url: string) => {
    const response = await requestWithRetries("fetchSharePointSites", () =>
      fetch(url, {
        headers: {
          Authorization: bearerToken,
        },
      })
    )
    if (!response.ok) {
      let errorCode = ""
      let errorDescription = ""
      try {
        const payload = (await response.json()) as {
          error?: { code?: string; message?: string }
        }
        errorCode = payload?.error?.code || ""
        errorDescription = payload?.error?.message || ""
      } catch {
        // noop
      }
      console.error("Failed to fetch SharePoint sites (app token)", {
        status: response.status,
        errorCode,
        hasErrorDescription: !!errorDescription,
      })
      let errorMessage = `Failed to fetch SharePoint sites (${response.status})`
      if (response.status === 401) {
        errorMessage =
          "Authentication failed with Microsoft Graph. Verify SharePoint application credentials and try again."
      } else if (response.status === 403) {
        errorMessage =
          "Access denied by Microsoft Graph. Ensure SharePoint application permissions are granted."
      } else if (response.status === 400 && errorDescription) {
        errorMessage = `Microsoft Graph rejected the SharePoint search request: ${errorDescription}`
      }
      throw new HTTPError(errorMessage, 400)
    }
    return (await response.json()) as {
      value?: Array<{
        id?: string
        displayName?: string
        name?: string
        webUrl?: string
      }>
      "@odata.nextLink"?: string
    }
  }

  for (let page = 0; nextLink && page < 50; page++) {
    const payload = await fetchSitesPage(nextLink)
    for (const site of payload.value || []) {
      if (!site?.id) {
        continue
      }
      sitesById.set(site.id, {
        id: site.id,
        name: site.displayName || site.name,
        webUrl: site.webUrl,
      })
    }

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
  if (nextLink) {
    console.warn(
      "Stopped fetching SharePoint sites due to reaching maximum page limit",
      {
        lastNextLink: nextLink,
      }
    )
  }

  return Array.from(sitesById.values()).sort((a, b) =>
    (a.name || a.id).localeCompare(b.name || b.id)
  )
}

export const fetchSharePointSitesByDatasourceAuthConfig = async (
  datasourceId: string,
  authConfigId: string
): Promise<KnowledgeSourceOption[]> => {
  await readConnection(datasourceId, authConfigId)
  const bearerToken = await getSharePointBearerToken(datasourceId, authConfigId)
  return fetchSharePointSitesByAppToken(bearerToken)
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
  eTag?: string
  lastModifiedDateTime?: string
  size?: number
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
  etag?: string
  lastModifiedAt?: string
  remoteSize?: number
}

export const listSharePointDrives = async (
  bearerToken: string,
  siteId: string
): Promise<string[]> => {
  const response = await requestWithRetries("listSharePointDrives", () =>
    fetch(
      `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(
        siteId
      )}/drives?$top=200&$select=id`,
      {
        headers: {
          Authorization: bearerToken,
        },
      }
    )
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
    ? `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/children?$top=200&$select=id,name,eTag,lastModifiedDateTime,size,file,folder`
    : `${SHAREPOINT_API_BASE}/drives/${driveId}/root/children?$top=200&$select=id,name,eTag,lastModifiedDateTime,size,file,folder`

  const items: SharePointDriveItem[] = []
  let nextLink = initialPath

  while (nextLink) {
    const response = await requestWithRetries("listSharePointDriveItems", () =>
      fetch(nextLink, {
        headers: {
          Authorization: bearerToken,
        },
      })
    )
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
      etag: item.eTag || undefined,
      lastModifiedAt: item.lastModifiedDateTime || undefined,
      remoteSize: item.size,
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
