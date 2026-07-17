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
export const MAX_SHAREPOINT_GENERATED_LIST_SIZE_BYTES = 100 * 1024 * 1024

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw signal.reason instanceof Error
      ? signal.reason
      : new Error("SharePoint request aborted")
  }
}

const waitForRetry = async (delayMs: number, signal?: AbortSignal) => {
  throwIfAborted(signal)
  if (!signal) {
    await helpers.wait(delayMs)
    return
  }
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timeout)
      reject(
        signal.reason instanceof Error
          ? signal.reason
          : new Error("SharePoint request aborted")
      )
    }
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", abort)
      resolve()
    }, delayMs)
    signal.addEventListener("abort", abort, { once: true })
    if (signal.aborted) {
      abort()
    }
  })
}

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

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error == null || !("status" in error)) {
    return
  }

  const status = (error as { status?: unknown }).status
  return typeof status === "number" ? status : undefined
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error == null || !("message" in error)) {
    return
  }

  const message = (error as { message?: unknown }).message
  return typeof message === "string" && message.trim().length > 0
    ? message
    : undefined
}

const requestWithRetries = async (
  operation: string,
  request: () => Promise<Response>,
  signal?: AbortSignal
): Promise<Response> => {
  let attempt = 0

  while (true) {
    try {
      throwIfAborted(signal)
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
      await waitForRetry(delayMs, signal)
    } catch (error) {
      throwIfAborted(signal)
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
      await waitForRetry(delayMs, signal)
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
        throw new HTTPError(errorMessage, 401)
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
  try {
    const bearerToken = await getSharePointBearerToken(
      datasourceId,
      authConfigId
    )
    return await fetchSharePointSitesByAppToken(bearerToken)
  } catch (error) {
    if (getErrorStatus(error) !== 401) {
      throw error
    }

    await sdk.oauth2.cleanStoredTokensForAuthConfig(authConfigId, datasourceId)
    try {
      const bearerToken = await getSharePointBearerToken(
        datasourceId,
        authConfigId
      )
      return await fetchSharePointSitesByAppToken(bearerToken)
    } catch (retryError) {
      if (getErrorStatus(retryError) === 401) {
        throw new HTTPError(
          getErrorMessage(retryError) ||
            "Authentication failed with Microsoft Graph. Verify SharePoint application credentials and try again.",
          400
        )
      }
      throw retryError
    }
  }
}

interface SharePointDrive {
  id?: string
}

export interface SharePointListRef {
  id: string
  name: string
  webUrl?: string
}

interface SharePointListResponse {
  value?: Array<{
    id?: string
    displayName?: string
    name?: string
    webUrl?: string
    list?: {
      hidden?: boolean
      template?: string
    }
  }>
  "@odata.nextLink"?: string
}

interface SharePointColumn {
  name: string
  displayName: string
}

interface SharePointColumnResponse {
  value?: Array<{
    name?: string
    displayName?: string
    hidden?: boolean
  }>
  "@odata.nextLink"?: string
}

interface SharePointListItem {
  id?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  webUrl?: string
  fields?: Record<string, unknown>
}

interface SharePointListItemsResponse {
  value?: SharePointListItem[]
  "@odata.nextLink"?: string
}

export interface SharePointListDocument {
  buffer: Buffer
  itemCount: number
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
  siteId: string,
  signal?: AbortSignal
): Promise<string[]> => {
  const response = await requestWithRetries(
    "listSharePointDrives",
    () =>
      fetch(
        `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(
          siteId
        )}/drives?$top=200&$select=id`,
        {
          signal,
          headers: {
            Authorization: bearerToken,
          },
        }
      ),
    signal
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

const fetchSharePointCollection = async <
  T extends { "@odata.nextLink"?: string },
>(
  operation: string,
  initialUrl: string,
  bearerToken: string
): Promise<T[]> => {
  const pages: T[] = []
  let nextLink = initialUrl

  while (nextLink) {
    const response = await requestWithRetries(operation, () =>
      fetch(nextLink, {
        headers: { Authorization: bearerToken },
      })
    )
    if (!response.ok) {
      throw new HTTPError(
        response.status === 401 || response.status === 403
          ? "Access denied by Microsoft Graph. Ensure SharePoint read permissions are granted."
          : `Failed to fetch SharePoint list data (${response.status})`,
        400
      )
    }

    const page = (await response.json()) as T
    pages.push(page)
    const nextPageLink = page["@odata.nextLink"]
    if (!nextPageLink) {
      nextLink = ""
    } else if (!isAllowedSharePointNextLink(nextPageLink)) {
      throw new HTTPError("Invalid SharePoint pagination URL", 400)
    } else {
      nextLink = nextPageLink
    }
  }

  return pages
}

export const listSharePointLists = async (
  bearerToken: string,
  siteId: string
): Promise<SharePointListRef[]> => {
  const pages = await fetchSharePointCollection<SharePointListResponse>(
    "listSharePointLists",
    `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(siteId)}/lists?$top=200&$select=id,displayName,name,webUrl,list`,
    bearerToken
  )

  return pages
    .flatMap(page => page.value || [])
    .filter(list =>
      Boolean(
        list.id &&
          !list.list?.hidden &&
          list.list?.template !== "documentLibrary"
      )
    )
    .map(list => ({
      id: list.id!,
      name: list.displayName || list.name || list.id!,
      webUrl: list.webUrl,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const stableStringify = (value: unknown): string => {
  if (value == null) {
    return ""
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(item => stableStringifyValue(item)))
  }
  if (typeof value === "object") {
    return JSON.stringify(stableStringifyValue(value))
  }
  return String(value)
}

const stableStringifyValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stableStringifyValue)
  }
  if (typeof value === "object" && value != null) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nestedValue]) => [key, stableStringifyValue(nestedValue)])
    )
  }
  return value
}

const escapeCsvCell = (value: unknown) => {
  const normalized = stableStringify(value)
  const neutralized = /^[=+\-@\t\r]/.test(normalized)
    ? `'${normalized}`
    : normalized
  return /[",\r\n]/.test(neutralized)
    ? `"${neutralized.replace(/"/g, '""')}"`
    : neutralized
}

const buildCsvRow = (row: unknown[]) => row.map(escapeCsvCell).join(",")

const getUniqueColumnLabels = (columns: SharePointColumn[]) => {
  const reserved = new Set([
    "SharePoint Item ID",
    "Created",
    "Modified",
    "Web URL",
  ])
  return columns.map(column => {
    let label = column.displayName
    let suffix = 2
    while (reserved.has(label)) {
      label = `${column.displayName} ${suffix++}`
    }
    reserved.add(label)
    return { ...column, displayName: label }
  })
}

export const fetchSharePointListDocument = async (
  bearerToken: string,
  siteId: string,
  listId: string,
  maxSizeBytes = MAX_SHAREPOINT_GENERATED_LIST_SIZE_BYTES
): Promise<SharePointListDocument> => {
  const columnPages = await fetchSharePointCollection<SharePointColumnResponse>(
    "listSharePointColumns",
    `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(siteId)}/lists/${encodeURIComponent(listId)}/columns?$top=200&$select=name,displayName,hidden`,
    bearerToken
  )

  const columns = getUniqueColumnLabels(
    columnPages
      .flatMap(page => page.value || [])
      .filter(
        (column): column is { name: string; displayName: string } =>
          !!column.name && !!column.displayName && !column.hidden
      )
      .map(column => ({
        name: column.name,
        displayName: column.displayName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  )

  const chunks: Uint8Array<ArrayBuffer>[] = []
  let totalBytes = 0
  let itemCount = 0
  let isFirstRow = true

  const appendCsvRow = (row: unknown[]) => {
    const line = `${isFirstRow ? "" : "\n"}${buildCsvRow(row)}`
    const chunk = Buffer.from(line, "utf8")
    const nextTotalBytes = totalBytes + chunk.byteLength
    if (nextTotalBytes > maxSizeBytes) {
      throw new HTTPError(
        "Generated SharePoint list CSV exceeds the 100 MB knowledge file limit",
        400
      )
    }
    chunks.push(chunk as Uint8Array<ArrayBuffer>)
    totalBytes = nextTotalBytes
    isFirstRow = false
  }

  appendCsvRow([
    "SharePoint Item ID",
    "Created",
    "Modified",
    "Web URL",
    ...columns.map(column => column.displayName),
  ])

  let nextLink = `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(siteId)}/lists/${encodeURIComponent(listId)}/items?$top=200&$expand=fields`

  while (nextLink) {
    const response = await requestWithRetries("listSharePointItems", () =>
      fetch(nextLink, {
        headers: { Authorization: bearerToken },
      })
    )
    if (!response.ok) {
      throw new HTTPError(
        response.status === 401 || response.status === 403
          ? "Access denied by Microsoft Graph. Ensure SharePoint read permissions are granted."
          : `Failed to fetch SharePoint list data (${response.status})`,
        400
      )
    }

    const page = (await response.json()) as SharePointListItemsResponse
    for (const item of page.value || []) {
      if (!item.id) {
        continue
      }
      appendCsvRow([
        item.id,
        item.createdDateTime,
        item.lastModifiedDateTime,
        item.webUrl,
        ...columns.map(column => item.fields?.[column.name]),
      ])
      itemCount++
    }

    const nextPageLink = page["@odata.nextLink"]
    if (!nextPageLink) {
      nextLink = ""
    } else if (!isAllowedSharePointNextLink(nextPageLink)) {
      throw new HTTPError("Invalid SharePoint pagination URL", 400)
    } else {
      nextLink = nextPageLink
    }
  }

  return { buffer: Buffer.concat(chunks, totalBytes), itemCount }
}

const listSharePointDriveItems = async (
  bearerToken: string,
  driveId: string,
  itemId?: string,
  signal?: AbortSignal
): Promise<SharePointDriveItem[]> => {
  const initialPath = itemId
    ? `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/children?$top=200&$select=id,name,eTag,lastModifiedDateTime,size,file,folder`
    : `${SHAREPOINT_API_BASE}/drives/${driveId}/root/children?$top=200&$select=id,name,eTag,lastModifiedDateTime,size,file,folder`

  const items: SharePointDriveItem[] = []
  let nextLink = initialPath

  while (nextLink) {
    const response = await requestWithRetries(
      "listSharePointDriveItems",
      () =>
        fetch(nextLink, {
          signal,
          headers: {
            Authorization: bearerToken,
          },
        }),
      signal
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
  parentPath = "",
  signal?: AbortSignal
): Promise<SharePointFileRef[]> => {
  const items = await listSharePointDriveItems(
    bearerToken,
    driveId,
    folderId,
    signal
  )
  const files: SharePointFileRef[] = []

  for (const item of items) {
    throwIfAborted(signal)
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
          nextPath,
          signal
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
  itemId: string,
  signal?: AbortSignal
) => {
  const response = await fetch(
    `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/content`,
    {
      signal,
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
