import { HTTPError } from "@budibase/backend-core"
import {
  RestAuthType,
  SharePointKnowledgeBaseSource,
  SourceName,
  type Datasource,
  type RestConfig,
  type SyncKnowledgeBaseRequest,
  type SyncKnowledgeBaseResponse,
} from "@budibase/types"
import { getIntegration } from "../../../../integrations"
import { RestIntegration } from "../../../../integrations/rest"
import sdk from "../../../index"
import { listKnowledgeBaseFiles } from "./files"
import { fetch as fetchKnowledgeBases, find, update } from "./crud"
import { uploadKnowledgeBaseFile } from "./uploads"

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const DEFAULT_PAGE_SIZE = 200

interface SharePointDriveItem {
  id?: string
  name?: string
  file?: {
    mimeType?: string
  }
  "@microsoft.graph.downloadUrl"?: string
}

interface SharePointDriveChildrenResponse {
  value?: SharePointDriveItem[]
}

const getDatasource = async (datasourceId: string): Promise<Datasource> => {
  try {
    return await sdk.datasources.get(datasourceId, { enriched: true })
  } catch {
    throw new HTTPError("Connection not found", 404)
  }
}

const listSharePointFiles = async (
  datasource: Datasource,
  siteId: string
): Promise<SharePointDriveItem[]> => {
  if (datasource.source !== SourceName.REST) {
    throw new HTTPError(
      "Knowledge base sync only supports REST connections",
      400
    )
  }

  const integration = await getIntegration(SourceName.REST)
  const datasourceConfig = (datasource.config || {}) as RestConfig
  const rest = new integration({
    ...datasourceConfig,
    url: datasourceConfig.url?.trim() || SHAREPOINT_API_BASE,
  }) as RestIntegration

  if (!rest.read) {
    throw new HTTPError("REST datasource does not support read operations", 400)
  }

  const authConfig = datasourceConfig.authConfigs?.[0]
  const query = {
    path: `/sites/${siteId}/drive/root/children`,
    queryString: `$top=${DEFAULT_PAGE_SIZE}&$select=id,name,file,etag,content.downloadUrl`,
    authConfigId: authConfig?._id,
    authConfigType: authConfig?.type as RestAuthType | undefined,
  }

  const response = await rest.read(query)
  const rows = (response?.data as SharePointDriveChildrenResponse)?.value
  return Array.isArray(rows) ? rows : []
}

export const sync = async ({
  knowledgeBaseId,
  datasourceId,
  siteId,
}: SyncKnowledgeBaseRequest & {
  knowledgeBaseId: string
}): Promise<SyncKnowledgeBaseResponse> => {
  const knowledgeBase = await find(knowledgeBaseId)
  if (!knowledgeBase) {
    throw new HTTPError("Knowledge base not found", 404)
  }

  const explicitDatasourceId = datasourceId?.trim()
  const explicitSiteId = siteId?.trim()
  if (!!explicitDatasourceId !== !!explicitSiteId) {
    throw new HTTPError(
      "datasourceId and siteId must be provided together",
      400
    )
  }

  const sources: SharePointKnowledgeBaseSource[] = explicitDatasourceId
    ? [{ datasourceId: explicitDatasourceId, siteId: explicitSiteId! }]
    : knowledgeBase.sharepointSources || []

  if (sources.length === 0) {
    return {
      knowledgeBaseId,
      synced: 0,
      failed: 0,
    }
  }

  const existingFiles = await listKnowledgeBaseFiles(knowledgeBaseId)
  const existingExternalSourceIds = new Set<string>(
    existingFiles
      .map(file => file.externalSourceId?.trim())
      .filter((id): id is string => !!id)
  )

  let synced = 0
  let failed = 0
  const now = new Date().toISOString()
  const sourceSyncResults = new Map<string, SharePointKnowledgeBaseSource>()

  for (const source of sources) {
    const currentDatasourceId = source.datasourceId?.trim()
    const currentSiteId = source.siteId?.trim()
    if (!currentDatasourceId || !currentSiteId) {
      continue
    }

    const sourceKey = `${currentDatasourceId}:${currentSiteId}`

    try {
      const datasource = await getDatasource(currentDatasourceId)
      const files = await listSharePointFiles(datasource, currentSiteId)

      for (const file of files) {
        const id = file.id?.trim()
        const name = file.name?.trim()
        const downloadUrl = file["@microsoft.graph.downloadUrl"]?.trim()

        if (!id || !name || !file.file) {
          continue
        }
        if (!downloadUrl) {
          console.log("Skipping SharePoint file without downloadUrl", {
            knowledgeBaseId,
            datasourceId: currentDatasourceId,
            siteId: currentSiteId,
            fileId: id,
          })
          failed++
          continue
        }

        const externalSourceId = `sharepoint:${currentDatasourceId}:${currentSiteId}:${id}`
        if (existingExternalSourceIds.has(externalSourceId)) {
          continue
        }

        try {
          await uploadKnowledgeBaseFile({
            knowledgeBaseId,
            filename: name,
            mimetype: file.file.mimeType,
            sourceUrl: downloadUrl,
            uploadedBy: "system",
            externalSourceId,
            persistInObjectStore: false,
          })
          existingExternalSourceIds.add(externalSourceId)
          synced++
        } catch (error) {
          console.log("Failed to sync SharePoint knowledge base file", {
            knowledgeBaseId,
            datasourceId: currentDatasourceId,
            siteId: currentSiteId,
            fileId: id,
            error,
          })
          failed++
        }
      }

      sourceSyncResults.set(sourceKey, {
        ...source,
        datasourceId: currentDatasourceId,
        siteId: currentSiteId,
        lastSyncedAt: now,
        lastSyncStatus: "success",
        lastSyncError: undefined,
      })
    } catch (error: any) {
      console.log("Failed to sync SharePoint source", {
        knowledgeBaseId,
        datasourceId: currentDatasourceId,
        siteId: currentSiteId,
        error,
      })
      failed++
      sourceSyncResults.set(sourceKey, {
        ...source,
        datasourceId: currentDatasourceId,
        siteId: currentSiteId,
        lastSyncedAt: now,
        lastSyncStatus: "failed",
        lastSyncError: error?.message || "Unknown error",
      })
    }
  }

  if (!explicitDatasourceId && knowledgeBase._id && knowledgeBase._rev) {
    const persistedSources = (knowledgeBase.sharepointSources || []).map(
      source => {
        const sourceKey = `${source.datasourceId}:${source.siteId}`
        return sourceSyncResults.get(sourceKey) || source
      }
    )
    await update({
      ...knowledgeBase,
      sharepointSources: persistedSources,
    })
  }

  return {
    knowledgeBaseId,
    synced,
    failed,
  }
}

export const syncAllConfiguredSharePointKnowledgeBases = async () => {
  const knowledgeBases = await fetchKnowledgeBases()
  for (const knowledgeBase of knowledgeBases) {
    const knowledgeBaseId = knowledgeBase._id
    if (!knowledgeBaseId) {
      continue
    }
    if (!knowledgeBase.sharepointSources?.length) {
      continue
    }

    try {
      await sync({ knowledgeBaseId })
    } catch (error) {
      console.log("Failed to sync configured SharePoint knowledge base", {
        knowledgeBaseId,
        error,
      })
    }
  }
}
