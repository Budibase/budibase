import { context, db, docIds, HTTPError, locks } from "@budibase/backend-core"
import { matchesConfiguredPatterns } from "@budibase/shared-core"
import {
  type Agent,
  type AgentKnowledgeSourceFilterConfig,
  type AgentKnowledgeSourceSyncState,
  AgentKnowledgeSourceSyncRunStatus,
  AgentKnowledgeSourceType,
  LockName,
  LockType,
  type AgentKnowledgeSource,
  DocumentType,
  type FetchAgentKnowledgeSourceEntriesResponse,
  type FetchAgentKnowledgeSourceOptionsResponse,
  isKnowledgeFileSupported,
  type KnowledgeSourceEntry,
  type SyncAgentKnowledgeSourcesResponse,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { agents as agentsSdk, knowledgeBase as knowledgeBaseSdk } from ".."
import {
  fetchSharePointSitesByConnection,
  getSharePointBearerToken,
  hasSharePointConnection,
  isAllowedSharePointNextLink,
  sharePointConnectionCacheKey,
} from "../sharepoint"
import {
  deleteFileForAgent,
  ensureKnowledgeBaseForAgent,
  listFilesForAgent,
} from "./files"

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

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const SHAREPOINT_SOURCE_TYPE = "sharepoint"

export const getSharePointFileDedupKey = ({
  siteId,
  driveId,
  itemId,
}: {
  siteId: string
  driveId: string
  itemId: string
}) => `${siteId}:${driveId}:${itemId}`

export const getSharePointWorkspaceConnectionKey = (workspaceId: string) =>
  sharePointConnectionCacheKey("connection", db.getProdWorkspaceID(workspaceId))

const getSharePointCurrentWorkspaceConnectionKey = () =>
  getSharePointWorkspaceConnectionKey(context.getOrThrowWorkspaceId())

export const hasSharePointWorkspaceConnection = async (): Promise<boolean> => {
  return hasSharePointConnection(getSharePointCurrentWorkspaceConnectionKey())
}

const getSharePointSources = (agent: Agent): AgentKnowledgeSource[] => {
  return (agent.knowledgeSources || []).filter(
    source => source.type === AgentKnowledgeSourceType.SHAREPOINT
  )
}

const getSharePointSyncRunStatus = (
  synced: number,
  failed: number
): AgentKnowledgeSourceSyncRunStatus => {
  if (failed === 0) {
    return AgentKnowledgeSourceSyncRunStatus.SUCCESS
  }
  if (synced === 0) {
    return AgentKnowledgeSourceSyncRunStatus.FAILED
  }
  return AgentKnowledgeSourceSyncRunStatus.PARTIAL
}

const saveSharePointSyncRunState = async ({
  agentId,
  siteId,
  lastRunAt,
  synced,
  failed,
  skipped,
  totalDiscovered,
}: {
  agentId: string
  siteId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  totalDiscovered: number
}) => {
  const db = context.getWorkspaceDB()
  const stateId = docIds.generateAgentKnowledgeSourceSyncStateID(
    agentId,
    SHAREPOINT_SOURCE_TYPE,
    siteId
  )
  const existing = await db.tryGet<AgentKnowledgeSourceSyncState>(stateId)
  const now = new Date().toISOString()
  await db.put({
    ...existing,
    _id: stateId,
    agentId,
    sourceType: SHAREPOINT_SOURCE_TYPE,
    sourceId: siteId,
    lastRunAt,
    synced,
    failed,
    skipped,
    totalDiscovered,
    status: getSharePointSyncRunStatus(synced, failed),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
}

const listDrives = async (
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

const listDriveItems = async (
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

interface SharePointFileRef {
  driveId: string
  itemId: string
  filename: string
  path: string
  mimetype?: string
}

const isSupportedSharePointFile = (file: SharePointFileRef) => {
  return isKnowledgeFileSupported({
    filename: file.filename,
    mimetype: file.mimetype,
  })
}

const normalizeSourceFilters = (
  filters?: AgentKnowledgeSourceFilterConfig
): { patterns?: string[] } => {
  const normalize = (patterns?: string[]) => {
    if (!patterns) {
      return undefined
    }
    const normalized = Array.from(
      new Set(patterns.map(pattern => pattern.trim()).filter(Boolean))
    )
    return normalized.length > 0 ? normalized : undefined
  }

  return { patterns: normalize(filters?.patterns) }
}

const isSharePointPathIncludedByFilters = (
  path: string,
  filters?: AgentKnowledgeSourceFilterConfig
) => {
  const { patterns } = normalizeSourceFilters(filters)

  if (!patterns?.length) {
    return true
  }
  return matchesConfiguredPatterns(path, patterns)
}

const collectFilesRecursive = async (
  bearerToken: string,
  driveId: string,
  folderId?: string,
  parentPath = ""
): Promise<SharePointFileRef[]> => {
  const items = await listDriveItems(bearerToken, driveId, folderId)
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
        ...(await collectFilesRecursive(bearerToken, driveId, itemId, nextPath))
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

const downloadFileBuffer = async (
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

export const fetchSharePointSitesForAgent = async (
  agentId: string
): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const { runs } = await fetchKnowledgeSourceSyncStateForAgent(agent._id!)
  if (!(await hasSharePointWorkspaceConnection())) {
    return { options: [], runs }
  }

  return {
    options: await fetchSharePointSitesByConnection(
      getSharePointCurrentWorkspaceConnectionKey()
    ),
    runs,
  }
}

export const fetchAllSharePointEntriesForAgent = async (
  agentId: string,
  siteId: string
): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const source = getSharePointSources(agent).find(
    source => source.config.site?.id === siteId
  )
  if (!source) {
    throw new HTTPError("SharePoint site is not connected for this agent", 404)
  }

  const bearerToken = await getSharePointBearerToken(
    getSharePointCurrentWorkspaceConnectionKey()
  )
  const driveIds = await listDrives(bearerToken, siteId)
  const entries: KnowledgeSourceEntry[] = []

  for (const driveId of driveIds) {
    const files = await collectFilesRecursive(bearerToken, driveId)
    for (const file of files) {
      const path = file.path
      if (!path) {
        continue
      }
      entries.push({
        id: `${file.driveId}:${file.itemId}`,
        name: file.filename || path.split("/").pop() || path,
        path,
        type: "file",
      })
    }
  }

  entries.sort((a, b) => a.path.localeCompare(b.path))
  return { entries }
}

export const fetchKnowledgeSourceSyncStateForAgent = async (
  agentId: string
): Promise<{ runs: FetchAgentKnowledgeSourceOptionsResponse["runs"] }> => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<AgentKnowledgeSourceSyncState>(
    docIds.getDocParams(
      DocumentType.AGENT_KNOWLEDGE_SOURCE_SYNC_STATE,
      `${agentId}_${SHAREPOINT_SOURCE_TYPE}_`,
      { include_docs: true }
    )
  )

  const runs = result.rows
    .map(row => row.doc)
    .filter((doc): doc is AgentKnowledgeSourceSyncState => !!doc?.sourceId)
    .map(doc => ({
      sourceId: doc.sourceId,
      lastRunAt: doc.lastRunAt,
      synced: doc.synced,
      failed: doc.failed,
      skipped: doc.skipped,
      unsupported: doc.unsupported,
      totalDiscovered: doc.totalDiscovered,
      status: doc.status,
    }))

  return { runs }
}

export const deleteKnowledgeSourceSyncStateForAgent = async (
  agentId: string,
  sourceId?: string
) => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<AgentKnowledgeSourceSyncState>(
    docIds.getDocParams(
      DocumentType.AGENT_KNOWLEDGE_SOURCE_SYNC_STATE,
      `${agentId}_${SHAREPOINT_SOURCE_TYPE}_`,
      { include_docs: true }
    )
  )
  const docsToDelete = result.rows
    .map(row => row.doc)
    .filter(
      (doc): doc is AgentKnowledgeSourceSyncState => !!doc?._id && !!doc._rev
    )
    .filter(doc => !sourceId || sourceId === doc.sourceId)
    .map(doc => ({
      ...doc,
      _deleted: true,
    }))

  if (docsToDelete.length > 0) {
    await db.bulkDocs(docsToDelete)
  }
}

const runSharePointSourcesForAgent = async (
  agentId: string,
  sourceId: string
): Promise<SyncAgentKnowledgeSourcesResponse> => {
  const lastRunAt = new Date().toISOString()
  const agent = await agentsSdk.getOrThrow(agentId)
  const sharepointSources = getSharePointSources(agent)
  if (sharepointSources.length === 0) {
    throw new HTTPError("SharePoint is not connected for this agent", 400)
  }

  const site = agent.knowledgeSources?.find(s => s.id === sourceId)?.config.site
  if (!site) {
    throw new HTTPError(
      "Specified SharePoint site is not connected for this agent",
      400
    )
  }

  const siteId = site.id
  const sourceFilters = agent.knowledgeSources?.find(s => s.id === sourceId)
    ?.config.filters

  console.log("Starting SharePoint sync for agent", {
    agentId,
    sourceId: sourceId,
    siteId,
    runAt: lastRunAt,
    sourceFilters,
  })

  const bearerToken = await getSharePointBearerToken(
    getSharePointCurrentWorkspaceConnectionKey()
  )
  const knowledgeBase = await ensureKnowledgeBaseForAgent(agentId)
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new HTTPError("Failed to create agent file storage", 500)
  }

  const existingFiles =
    await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
  const existingSharePointFilesByExternalId = new Map<
    string,
    {
      fileId: string
      siteId: string
      knowledgeSourceId?: string
      status?: KnowledgeBaseFileStatus
    }
  >()
  for (const file of existingFiles) {
    const fileId = file._id
    if (
      !fileId ||
      file.source?.type !== KnowledgeBaseFileSourceType.SHAREPOINT
    ) {
      continue
    }
    const externalId = getSharePointFileDedupKey({
      siteId: file.source.siteId,
      driveId: file.source.driveId,
      itemId: file.source.itemId,
    })
    existingSharePointFilesByExternalId.set(externalId, {
      fileId,
      siteId: file.source.siteId,
      knowledgeSourceId: file.source.knowledgeSourceId,
      status: file.status,
    })
  }
  const existingExternalIds = new Set(
    existingSharePointFilesByExternalId.keys()
  )

  let synced = 0
  let failed = 0
  let skipped = 0
  let alreadySynced = 0
  let unsupported = 0
  let filteredOut = 0
  let retried = 0
  let totalDiscovered = 0
  let deleted = 0
  let deleteFailed = 0

  const existingSourceFiles = existingFiles.filter(
    file =>
      file._id &&
      file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT &&
      file.source.knowledgeSourceId === sourceId &&
      file.source.siteId === siteId
  )
  const filteredOutFileIds = existingSourceFiles
    .filter(file => {
      const candidatePath = file.source?.path || file.filename
      return !isSharePointPathIncludedByFilters(
        candidatePath || "",
        sourceFilters
      )
    })
    .map(file => file._id)
    .filter((fileId): fileId is string => !!fileId)
  if (filteredOutFileIds.length > 0) {
    const deleteResults = await Promise.allSettled(
      filteredOutFileIds.map(fileId => deleteFileForAgent(agentId, fileId))
    )
    deleted = deleteResults.filter(
      result => result.status === "fulfilled"
    ).length
    deleteFailed = deleteResults.length - deleted
  }

  try {
    const driveIds = await listDrives(bearerToken, siteId)
    console.log("Fetched SharePoint drives for site", {
      agentId,
      siteId,
      driveCount: driveIds.length,
    })
    for (const driveId of driveIds) {
      const files = await collectFilesRecursive(bearerToken, driveId)

      totalDiscovered += files.length
      for (const file of files) {
        if (!isSharePointPathIncludedByFilters(file.path, sourceFilters)) {
          skipped++
          filteredOut++
          continue
        }
        if (!isSupportedSharePointFile(file)) {
          skipped++

          unsupported++

          continue
        }
        const externalSourceId = getSharePointFileDedupKey({
          siteId,
          driveId,
          itemId: file.itemId,
        })
        if (existingExternalIds.has(externalSourceId)) {
          const existingEntry =
            existingSharePointFilesByExternalId.get(externalSourceId)
          const shouldRetryFailedIngestion =
            existingEntry?.status === KnowledgeBaseFileStatus.FAILED &&
            existingEntry.siteId === siteId &&
            existingEntry.knowledgeSourceId === sourceId

          if (shouldRetryFailedIngestion && existingEntry?.fileId) {
            try {
              await knowledgeBaseSdk.retryKnowledgeBaseFileIngestion(
                existingEntry.fileId
              )
              synced++
              retried++
            } catch (error) {
              console.error(
                "Failed to retry SharePoint file ingestion for agent",
                {
                  agentId,
                  siteId,
                  driveId,
                  itemId: file.itemId,
                  error,
                }
              )
              failed++
            }
            continue
          } else {
            skipped++
            alreadySynced++

            continue
          }
        }

        try {
          const buffer = await downloadFileBuffer(
            bearerToken,
            driveId,
            file.itemId
          )

          await knowledgeBaseSdk.uploadKnowledgeBaseFile({
            knowledgeBaseId,
            source: {
              type: KnowledgeBaseFileSourceType.SHAREPOINT,
              knowledgeSourceId: sourceId,
              siteId,
              driveId,
              itemId: file.itemId,
              path: file.path,
            },
            filename: file.filename,
            mimetype: file.mimetype,
            size: buffer.byteLength,
            buffer,
            uploadedBy: `sharepoint:${sourceId}`,
          })

          existingExternalIds.add(externalSourceId)
          synced++
        } catch (error) {
          console.error("Failed to sync SharePoint file for agent", {
            agentId,
            siteId,
            driveId,
            itemId: file.itemId,
            error,
          })
          failed++
        }
      }
    }
  } catch (error) {
    console.error("Failed to sync SharePoint site for agent", {
      agentId,
      siteId,
      error,
    })
    failed++
  } finally {
    await saveSharePointSyncRunState({
      agentId,
      siteId,
      lastRunAt,
      synced,
      failed,
      skipped,
      totalDiscovered,
    })
    console.log("Completed SharePoint site sync for agent", {
      agentId,
      siteId,
      synced,
      deleted,
      deleteFailed,
      failed,
      skipped,
      alreadySynced,
      retried,
      filteredOut,
      unsupported,
      totalDiscovered,
    })
  }

  return {
    agentId,
    synced,
    failed,
    alreadySynced,
    deleted,
    unsupported,
    totalDiscovered,
  }
}

export const syncSharePointSourcesForAgent = async (
  agentId: string,
  sourceId: string
): Promise<SyncAgentKnowledgeSourcesResponse> => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.AGENT_RAG_KNOWLEDGE_BASE,
      type: LockType.AUTO_EXTEND,
      resource: `${agentId}:${sourceId}:sharepoint_sync`,
    },
    async () => await runSharePointSourcesForAgent(agentId, sourceId)
  )

  return result
}

export const deleteSharePointFilesForAgentSite = async (
  agentId: string,
  siteId: string
) => {
  const files = await listFilesForAgent(agentId)
  const fileIdsToDelete = files
    .filter(
      file =>
        file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT &&
        file.source.siteId === siteId
    )
    .map(file => file._id)
    .filter((fileId): fileId is string => !!fileId)

  const results = await Promise.allSettled(
    fileIdsToDelete.map(fileId => deleteFileForAgent(agentId, fileId))
  )
  const failed = results.filter(result => result.status === "rejected").length
  console.log("SharePoint file cleanup completed for site", {
    agentId,
    siteId,
    deleted: fileIdsToDelete.length - failed,
    failed,
  })
}
