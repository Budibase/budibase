import { context, docIds, HTTPError, locks } from "@budibase/backend-core"
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
  isKnowledgeFileSupported,
  type KnowledgeSourceEntry,
  type KnowledgeSourceSyncRun,
  type SyncAgentKnowledgeSourcesResponse,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import {
  agents as agentsSdk,
  knowledgeBase as knowledgeBaseSdk,
} from "../../.."
import {
  collectSharePointFilesRecursive,
  downloadSharePointFileBuffer,
  getSharePointBearerToken,
  listSharePointDrives,
} from "../../../knowledgeSources/sharepoint"
import {
  deleteFileForAgent,
  ensureKnowledgeBaseForAgent,
  listFilesForAgent,
} from "../../files"

export const getSharePointFileDedupKey = ({
  siteId,
  driveId,
  itemId,
}: {
  siteId: string
  driveId: string
  itemId: string
}) => `${siteId}:${driveId}:${itemId}`

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
  sourceId,
  lastRunAt,
  synced,
  failed,
  skipped,
  totalDiscovered,
}: {
  agentId: string
  sourceId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  totalDiscovered: number
}) => {
  const db = context.getWorkspaceDB()
  const stateId = docIds.generateAgentKnowledgeSourceSyncStateID(
    agentId,
    sourceId
  )
  const existing = await db.tryGet<AgentKnowledgeSourceSyncState>(stateId)
  const now = new Date().toISOString()
  await db.put({
    ...existing,
    _id: stateId,
    agentId,
    sourceId: sourceId,
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

const isSupportedSharePointFile = (file: {
  filename: string
  mimetype?: string
}) => {
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

export const fetchAllSharePointEntriesForAgent = async (
  agentId: string,
  siteId: string
): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const source = getSharePointSources(agent).find(
    source => source.config.site.id === siteId
  )
  if (!source) {
    throw new HTTPError("SharePoint site is not connected for this agent", 404)
  }

  const { datasourceId, authConfigId } = source.config
  if (!datasourceId || !authConfigId) {
    throw new HTTPError("SharePoint is not connected for this workspace", 400)
  }
  const bearerToken = await getSharePointBearerToken(datasourceId, authConfigId)
  const driveIds = await listSharePointDrives(bearerToken, siteId)
  const entries: KnowledgeSourceEntry[] = []

  for (const driveId of driveIds) {
    const files = await collectSharePointFilesRecursive(bearerToken, driveId)
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
): Promise<{ runs: KnowledgeSourceSyncRun[] }> => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<AgentKnowledgeSourceSyncState>(
    docIds.getDocParams(
      DocumentType.AGENT_KNOWLEDGE_SOURCE_SYNC_STATE,
      `${agentId}_`,
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
      `${agentId}_`,
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
  const sourceDatasourceId = agent.knowledgeSources?.find(
    s => s.id === sourceId
  )?.config.datasourceId
  const sourceAuthConfigId = agent.knowledgeSources?.find(
    s => s.id === sourceId
  )?.config.authConfigId
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

  if (!sourceDatasourceId || !sourceAuthConfigId) {
    throw new HTTPError("SharePoint is not connected for this workspace", 400)
  }
  const bearerToken = await getSharePointBearerToken(
    sourceDatasourceId,
    sourceAuthConfigId
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
    const driveIds = await listSharePointDrives(bearerToken, siteId)
    console.log("Fetched SharePoint drives for site", {
      agentId,
      siteId,
      driveCount: driveIds.length,
    })
    for (const driveId of driveIds) {
      const files = await collectSharePointFilesRecursive(bearerToken, driveId)

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
          const buffer = await downloadSharePointFileBuffer(
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
      sourceId,
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
