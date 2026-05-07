import { encryption, HTTPError } from "@budibase/backend-core"
import {
  Datasource,
  KnowledgeSourceOption,
  OAuth2RestAuthConfig,
  isOAuth2ClientCredentialsAuthConfig,
  isOAuth2DelegatedAuthConfig,
  OAuth2GrantType,
} from "@budibase/types"
import sdk from "../../../.."
import {
  getSharePointCredential,
  saveSharePointCredential,
} from "./credentials"

enum SharePointConnectionAuthType {
  DELEGATED_OAUTH = "delegated_oauth",
  CLIENT_CREDENTIALS = "client_credentials",
}
type OAuth2RestAuthConfigWithTokenCache = OAuth2RestAuthConfig & {
  refreshToken?: string
}

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const SHAREPOINT_API_BASE_URL = new URL(SHAREPOINT_API_BASE)
const decryptSecretOrPlaintext = (value: string) => {
  try {
    return encryption.decrypt(value)
  } catch {
    return value
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
  if (
    !isOAuth2ClientCredentialsAuthConfig(authConfig) &&
    !isOAuth2DelegatedAuthConfig(authConfig)
  ) {
    throw new HTTPError("SharePoint requires an OAuth2 auth config.", 400)
  }
  if (!authConfig.url || !authConfig.clientId) {
    throw new HTTPError(
      "OAuth2 auth config is missing token URL or client ID.",
      400
    )
  }
  return authConfig
}

const getRefreshBody = (connection: OAuth2RestAuthConfigWithTokenCache) => {
  if (
    connection.authType === "delegated_oauth" &&
    connection.grantType === OAuth2GrantType.AUTHORIZATION_CODE
  ) {
    return new URLSearchParams({
      client_id: connection.clientId,
      client_secret: decryptSecretOrPlaintext(connection.clientSecret),
      grant_type: "refresh_token",
      refresh_token: decryptSecretOrPlaintext(connection.refreshToken!),
      ...(connection.scope ? { scope: connection.scope } : {}),
    })
  }

  return new URLSearchParams({
    client_id: connection.clientId,
    client_secret: decryptSecretOrPlaintext(connection.clientSecret),
    grant_type: "client_credentials",
    ...(connection.scope ? { scope: connection.scope } : {}),
  })
}

const refreshConnection = async (
  datasourceId: string,
  authConfigId: string,
  connection: OAuth2RestAuthConfigWithTokenCache,
  credential: {
    accessToken?: string
    refreshToken?: string
    tokenType?: string
    expiresAt?: number
  }
): Promise<OAuth2RestAuthConfigWithTokenCache> => {
  if (isOAuth2DelegatedAuthConfig(connection) && !credential.refreshToken) {
    throw new HTTPError("OAuth2 auth config is missing refresh token.", 400)
  }
  const response = await fetch(connection.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: getRefreshBody({ ...connection, ...credential }),
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
  const nextCredential = {
    accessToken: payload?.access_token || credential.accessToken,
    refreshToken: payload?.refresh_token || credential.refreshToken,
    tokenType: payload?.token_type || credential.tokenType || "Bearer",
    expiresAt: Date.now() + Math.max(expiresIn - 60, 0) * 1000,
  }
  await saveSharePointCredential({
    datasourceId,
    authConfigId,
    ...nextCredential,
  })
  return connection
}

export const getSharePointBearerToken = async (
  datasourceId: string,
  authConfigId: string
): Promise<string> => {
  const connection = await readConnection(datasourceId, authConfigId)
  let credential = await getSharePointCredential(datasourceId, authConfigId)
  const expiresAt = Number(credential?.expiresAt || 0)
  const needsRefresh = !credential?.accessToken || expiresAt <= Date.now()
  if (needsRefresh) {
    await refreshConnection(datasourceId, authConfigId, connection, {
      accessToken: credential?.accessToken,
      refreshToken: credential?.refreshToken,
      tokenType: credential?.tokenType,
      expiresAt: credential?.expiresAt,
    })
    credential = await getSharePointCredential(datasourceId, authConfigId)
  }
  const tokenType = credential?.tokenType?.trim() || "Bearer"
  return `${tokenType} ${credential?.accessToken}`
}

const fetchSharePointSitesByAppToken = async (
  bearerToken: string,
  authType: SharePointConnectionAuthType
): Promise<KnowledgeSourceOption[]> => {
  const sitesById = new Map<string, KnowledgeSourceOption>()
  let nextLink = `${SHAREPOINT_API_BASE}/sites?search=*&$top=200&$select=id,displayName,name,webUrl`

  for (let page = 0; nextLink && page < 50; page++) {
    const response = await fetch(nextLink, {
      headers: {
        Authorization: bearerToken,
      },
    })
    if (!response.ok) {
      console.error("Failed to fetch SharePoint sites (app token)", {
        status: response.status,
        authType,
      })
      let errorMessage = `Failed to fetch SharePoint sites (${response.status})`
      if (response.status === 401) {
        if (authType === SharePointConnectionAuthType.DELEGATED_OAUTH) {
          errorMessage =
            "Authentication failed with Microsoft Graph. Reconnect SharePoint and try again."
        } else {
          errorMessage =
            "Authentication failed with Microsoft Graph. Verify SharePoint application credentials and try again."
        }
      } else if (response.status === 403) {
        if (authType === SharePointConnectionAuthType.DELEGATED_OAUTH) {
          errorMessage =
            "Access denied by Microsoft Graph. Ensure delegated SharePoint permissions are granted."
        } else {
          errorMessage =
            "Access denied by Microsoft Graph. Ensure SharePoint application permissions are granted."
        }
      }
      throw new HTTPError(errorMessage, 400)
    }

    const payload = (await response.json()) as {
      value?: Array<{
        id?: string
        displayName?: string
        name?: string
        webUrl?: string
      }>
      "@odata.nextLink"?: string
    }

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
  const connection = await readConnection(datasourceId, authConfigId)
  const bearerToken = await getSharePointBearerToken(datasourceId, authConfigId)
  return fetchSharePointSitesByAppToken(
    bearerToken,
    isOAuth2DelegatedAuthConfig(connection)
      ? SharePointConnectionAuthType.DELEGATED_OAUTH
      : SharePointConnectionAuthType.CLIENT_CREDENTIALS
  )
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
