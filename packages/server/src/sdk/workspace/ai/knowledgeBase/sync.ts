import { HTTPError } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import {
  type Datasource,
  type FetchSharePointSitesResponse,
  KnowledgeBaseType,
  type ManagedKnowledgeBaseFileReference,
  type ManagedFileSearchKnowledgeBase,
  type RestQueryFields,
  RestAuthType,
  type RestConfig,
  type SharePointSiteReference,
  SourceName,
  type SyncKnowledgeBaseResponse,
} from "@budibase/types"
import { getIntegration } from "../../../../integrations"
import sdk from "../../../index"
import { find, update } from "./crud"

const DEFAULT_SYNC_LIMIT = 50
const DEFAULT_SHAREPOINT_BASE_URL = "https://graph.microsoft.com/v1.0"
const DEFAULT_GOOGLE_DRIVE_BASE_URL = "https://www.googleapis.com/drive/v3"

interface ConnectorSyncConfig {
  path: string
  queryString?: string
}

const readScopeString = (
  knowledgeBase: ManagedFileSearchKnowledgeBase,
  key: string
) => {
  const value = knowledgeBase.scope?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

const getConnectorSyncConfig = (
  knowledgeBase: ManagedFileSearchKnowledgeBase
): ConnectorSyncConfig => {
  const siteId = readScopeString(knowledgeBase, "siteId")
  const scopePath = readScopeString(knowledgeBase, "path")
  const scopeQuery = readScopeString(knowledgeBase, "queryString")

  if (scopePath) {
    return { path: scopePath, queryString: scopeQuery }
  }

  switch (knowledgeBase.type) {
    case KnowledgeBaseType.SHAREPOINT:
      if (siteId) {
        return {
          path: `/sites/${siteId}/drive/root/children`,
          queryString: `$top=${DEFAULT_SYNC_LIMIT}`,
        }
      }
      return {
        path: "/sites",
        queryString: `$search=*&$top=${DEFAULT_SYNC_LIMIT}`,
      }
    case KnowledgeBaseType.GOOGLE_DRIVE:
      return {
        path: "/files",
        queryString: `pageSize=${DEFAULT_SYNC_LIMIT}&fields=files(id,name,mimeType,modifiedTime,webViewLink)`,
      }
    case KnowledgeBaseType.CONFLUENCE:
      return {
        path: "/wiki/api/v2/pages",
        queryString: `limit=${DEFAULT_SYNC_LIMIT}`,
      }
    default:
      throw utils.unreachable(knowledgeBase.type)
  }
}

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://")

const resolveBaseUrl = (
  knowledgeBase: ManagedFileSearchKnowledgeBase,
  datasourceConfig: RestConfig
) => {
  const configuredUrl = datasourceConfig.url?.trim()
  if (configuredUrl) {
    return configuredUrl
  }

  switch (knowledgeBase.type) {
    case KnowledgeBaseType.SHAREPOINT:
      return DEFAULT_SHAREPOINT_BASE_URL
    case KnowledgeBaseType.GOOGLE_DRIVE:
      return DEFAULT_GOOGLE_DRIVE_BASE_URL
    case KnowledgeBaseType.CONFLUENCE:
      return undefined
    default:
      return undefined
  }
}

const extractRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) {
    return data as Record<string, unknown>[]
  }
  if (!data || typeof data !== "object") {
    return []
  }

  const record = data as Record<string, unknown>
  if (Array.isArray(record.files)) {
    return record.files as Record<string, unknown>[]
  }
  if (Array.isArray(record.value)) {
    return record.value as Record<string, unknown>[]
  }
  if (Array.isArray(record.results)) {
    return record.results as Record<string, unknown>[]
  }
  return []
}

const readString = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === "string" ? value : undefined
}

const readRecord = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : undefined
}

const normalizeConnectorFiles = (
  rows: Record<string, unknown>[]
): ManagedKnowledgeBaseFileReference[] => {
  const files = rows
    .map(row => {
      const id =
        `${readString(row, "id") || readString(row, "_id") || readString(row, "key") || ""}`.trim()
      const name =
        `${readString(row, "name") || readString(row, "displayName") || readString(row, "title") || ""}`.trim()
      if (!id || !name) {
        return undefined
      }

      const fileRecord = readRecord(row, "file")
      const linksRecord = readRecord(row, "_links")

      return {
        id,
        name,
        url:
          readString(row, "webUrl") ||
          readString(row, "webViewLink") ||
          readString(linksRecord || {}, "base") ||
          readString(row, "url"),
        mimeType:
          readString(row, "mimeType") ||
          readString(fileRecord || {}, "mimeType"),
        modifiedAt:
          readString(row, "lastModifiedDateTime") ||
          readString(row, "modifiedTime") ||
          readString(row, "modifiedAt"),
      }
    })
    .filter((file): file is ManagedKnowledgeBaseFileReference => !!file)

  return files.slice(0, DEFAULT_SYNC_LIMIT)
}

const normalizeSharePointSites = (
  rows: Record<string, unknown>[]
): SharePointSiteReference[] => {
  const sites = rows
    .map(row => {
      const id = `${readString(row, "id") || ""}`.trim()
      const name =
        `${readString(row, "displayName") || readString(row, "name") || ""}`.trim()
      if (!id || !name) {
        return undefined
      }
      return {
        id,
        name,
        webUrl: readString(row, "webUrl"),
      }
    })
    .filter((site): site is SharePointSiteReference => !!site)

  return sites.slice(0, DEFAULT_SYNC_LIMIT)
}

const fetchDatasource = async (id: string): Promise<Datasource> => {
  try {
    return await sdk.datasources.get(id, { enriched: true })
  } catch (error) {
    throw new HTTPError("Connection not found for knowledge base", 404)
  }
}

const fetchConnectorFiles = async (
  knowledgeBase: ManagedFileSearchKnowledgeBase,
  datasource: Datasource
): Promise<ManagedKnowledgeBaseFileReference[]> => {
  if (datasource.source !== SourceName.REST) {
    throw new HTTPError(
      "Knowledge base connection must be a REST datasource",
      400
    )
  }

  const integration = await getIntegration(SourceName.REST)
  const datasourceConfig = (datasource.config || {}) as RestConfig
  const { path, queryString } = getConnectorSyncConfig(knowledgeBase)
  const baseUrl = resolveBaseUrl(knowledgeBase, datasourceConfig)

  if (!baseUrl && !isAbsoluteUrl(path)) {
    throw new HTTPError(
      "Connector sync needs a base URL on the selected connection (or an absolute scope.path)",
      400
    )
  }

  const restConfig: RestConfig = {
    ...datasourceConfig,
    ...(baseUrl ? { url: baseUrl } : {}),
  }
  const rest = new integration(restConfig)

  if (!rest.read) {
    throw new HTTPError("REST datasource does not support read operations", 400)
  }

  const authConfig = datasourceConfig.authConfigs?.[0]
  const query: RestQueryFields = {
    path,
    queryString,
    authConfigId: authConfig?._id,
    authConfigType: authConfig?.type as RestAuthType | undefined,
  }
  let response
  try {
    response = await rest.read(query)
  } catch (error: any) {
    throw new HTTPError(
      `Connector sync request failed: ${error?.message || "unknown error"}`,
      400
    )
  }

  return normalizeConnectorFiles(extractRows(response?.data))
}

const assertSharePointKnowledgeBase = (
  knowledgeBase: ManagedFileSearchKnowledgeBase
) => {
  if (knowledgeBase.type !== KnowledgeBaseType.SHAREPOINT) {
    throw new HTTPError(
      "Only SharePoint knowledge bases support site selection",
      400
    )
  }
}

export const fetchSharePointSites = async (
  id: string
): Promise<FetchSharePointSitesResponse> => {
  const knowledgeBase = await find(id)
  if (!knowledgeBase) {
    throw new HTTPError("Knowledge base not found", 404)
  }
  if (knowledgeBase.type === KnowledgeBaseType.LOCAL) {
    throw new HTTPError(
      "Only connector knowledge bases support site selection",
      400
    )
  }
  assertSharePointKnowledgeBase(knowledgeBase)

  const datasource = await fetchDatasource(knowledgeBase.connectionId)
  if (datasource.source !== SourceName.REST) {
    throw new HTTPError(
      "Knowledge base connection must be a REST datasource",
      400
    )
  }

  const integration = await getIntegration(SourceName.REST)
  const datasourceConfig = (datasource.config || {}) as RestConfig
  const restConfig: RestConfig = {
    ...datasourceConfig,
    url: datasourceConfig.url?.trim() || DEFAULT_SHAREPOINT_BASE_URL,
  }
  const rest = new integration(restConfig)

  if (!rest.read) {
    throw new HTTPError("REST datasource does not support read operations", 400)
  }

  const authConfig = datasourceConfig.authConfigs?.[0]
  const query: RestQueryFields = {
    path: "/sites",
    authConfigId: authConfig?._id,
    authConfigType: authConfig?.type as RestAuthType | undefined,
  }

  let response
  try {
    response = await rest.read(query)
  } catch (error: any) {
    throw new HTTPError(
      `Could not fetch SharePoint sites: ${error?.message || "unknown error"}`,
      400
    )
  }

  return {
    knowledgeBaseId: id,
    sites: normalizeSharePointSites(extractRows(response?.data)),
  }
}

export const sync = async (id: string): Promise<SyncKnowledgeBaseResponse> => {
  const knowledgeBase = await find(id)
  if (!knowledgeBase) {
    throw new HTTPError("Knowledge base not found", 404)
  }

  switch (knowledgeBase.type) {
    case KnowledgeBaseType.LOCAL:
      throw new HTTPError(
        "Sync is only available for connector knowledge bases",
        400
      )
    case KnowledgeBaseType.SHAREPOINT:
    case KnowledgeBaseType.GOOGLE_DRIVE:
    case KnowledgeBaseType.CONFLUENCE: {
      const datasource = await fetchDatasource(knowledgeBase.connectionId)
      const files = await fetchConnectorFiles(knowledgeBase, datasource)
      const syncedAt = new Date().toISOString()

      await update({
        ...knowledgeBase,
        managedRetrievalIndexId:
          knowledgeBase.managedRetrievalIndexId ||
          `${knowledgeBase._id}:${syncedAt}`,
      })

      return {
        knowledgeBaseId: id,
        knowledgeBaseType: knowledgeBase.type,
        files,
        fetchedAt: syncedAt,
      }
    }
    default:
      throw utils.unreachable(knowledgeBase)
  }
}
