import {
  context,
  docIds,
  events,
  HTTPError,
  locks,
} from "@budibase/backend-core"
import { matchesConfiguredPatterns } from "@budibase/shared-core"
import {
  type Agent,
  type AgentOperation,
  type AgentKnowledgeSourceFilterConfig,
  type AgentKnowledgeSourceSyncState,
  AgentKnowledgeSourceSyncRunStatus,
  LockName,
  LockType,
  DocumentType,
  type FetchAgentKnowledgeSourceEntriesResponse,
  isKnowledgeFileSupported,
  type KnowledgeBaseFile,
  type SharePointKnowledgeBaseFileSource,
  type KnowledgeSourceEntry,
  type KnowledgeSourceSyncRun,
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
import { findOperationIdForKnowledgeSource } from "../../../agents/knowledgeConfig"
import {
  deleteFileForOperation,
  ensureKnowledgeBaseForOperation,
  listFilesForOperation,
} from "../../files"
import env from "../../../../../../environment"

export interface SharePointSyncResult {
  agentId: string
  synced: number
  failed: number
  alreadySynced: number
  deleted: number
  unsupported: number
  totalDiscovered: number
}

export class SharePointSyncTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`SharePoint sync timed out after ${timeoutMs} milliseconds`)
    this.name = "SharePointSyncTimeoutError"
  }
}

const isSharePointSyncTimeoutError = (
  error: unknown
): error is SharePointSyncTimeoutError =>
  error instanceof Error && error.name === "SharePointSyncTimeoutError"

const throwIfSyncAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw signal.reason instanceof Error
      ? signal.reason
      : new Error("SharePoint sync aborted")
  }
}

export const getSharePointFileDedupKey = ({
  siteId,
  driveId,
  itemId,
}: {
  siteId: string
  driveId: string
  itemId: string
}) => `${siteId}:${driveId}:${itemId}`

const getOperationOrThrow = (
  agent: Agent,
  operationId: string
): AgentOperation => {
  const operation = agent.operations?.find(
    operation => operation.id === operationId
  )
  if (!operation) {
    throw new HTTPError("Operation not found for this agent", 404)
  }
  return operation
}

const getSharePointSourcesForOperation = (agent: Agent, operationId: string) =>
  (getOperationOrThrow(agent, operationId).knowledgeSources || []).filter(
    source => source.type === "sharepoint"
  )

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
  unsupported,
  totalDiscovered,
}: {
  agentId: string
  sourceId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  unsupported: number
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
    lastStartedAt: existing?.lastStartedAt || lastRunAt,
    errorMessage: undefined,
    synced,
    failed,
    skipped,
    unsupported,
    totalDiscovered,
    status: getSharePointSyncRunStatus(synced, failed),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
}

export const updateSharePointSyncRunStatus = async ({
  agentId,
  sourceId,
  status,
  errorMessage,
}: {
  agentId: string
  sourceId: string
  status: AgentKnowledgeSourceSyncRunStatus
  errorMessage?: string
}) => {
  const db = context.getWorkspaceDB()
  const stateId = docIds.generateAgentKnowledgeSourceSyncStateID(
    agentId,
    sourceId
  )
  const existing = await db.tryGet<AgentKnowledgeSourceSyncState>(stateId)
  if (
    status === AgentKnowledgeSourceSyncRunStatus.QUEUED &&
    existing?.status === AgentKnowledgeSourceSyncRunStatus.RUNNING
  ) {
    return
  }
  const now = new Date().toISOString()
  await db.put({
    ...existing,
    _id: stateId,
    agentId,
    sourceId,
    lastStartedAt:
      status === AgentKnowledgeSourceSyncRunStatus.RUNNING
        ? now
        : existing?.lastStartedAt,
    lastRunAt:
      status === AgentKnowledgeSourceSyncRunStatus.FAILED
        ? now
        : existing?.lastRunAt,
    synced: existing?.synced || 0,
    failed:
      status === AgentKnowledgeSourceSyncRunStatus.FAILED
        ? Math.max(existing?.failed || 0, 1)
        : existing?.failed || 0,
    skipped: existing?.skipped || 0,
    unsupported: existing?.unsupported || 0,
    totalDiscovered: existing?.totalDiscovered || 0,
    status,
    errorMessage,
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

const isSharePointKnowledgeBaseFile = (
  file: KnowledgeBaseFile,
  sourceId: string,
  siteId: string
): file is KnowledgeBaseFile & {
  _id: string
  source: SharePointKnowledgeBaseFileSource
} => {
  return (
    !!file._id &&
    file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT &&
    file.source.knowledgeSourceId === sourceId &&
    file.source.siteId === siteId
  )
}

type SharePointFileMetadataFingerprint = {
  etag?: string
  lastModifiedAt?: string
  remoteSize?: number
}

const hasSharePointFileMetadataChanged = ({
  local,
  remote,
}: {
  local: SharePointFileMetadataFingerprint
  remote: SharePointFileMetadataFingerprint
}) => {
  const {
    etag: localEtag,
    lastModifiedAt: localLastModifiedAt,
    remoteSize: localRemoteSize,
  } = local
  const {
    etag: remoteEtag,
    lastModifiedAt: remoteLastModifiedAt,
    remoteSize,
  } = remote

  if (localEtag && remoteEtag) {
    return localEtag !== remoteEtag
  }

  const hasLocalMetadata =
    localEtag !== undefined ||
    localLastModifiedAt !== undefined ||
    localRemoteSize !== undefined
  const hasRemoteMetadata =
    remoteEtag !== undefined ||
    remoteLastModifiedAt !== undefined ||
    remoteSize !== undefined
  if (!hasLocalMetadata) {
    return hasRemoteMetadata
  }

  const hasLocalFallbackMetadata =
    localLastModifiedAt !== undefined || localRemoteSize !== undefined
  if (!hasLocalFallbackMetadata) {
    return false
  }

  if (
    localLastModifiedAt !== undefined &&
    remoteLastModifiedAt !== undefined &&
    localLastModifiedAt !== remoteLastModifiedAt
  ) {
    return true
  }

  if (
    localRemoteSize !== undefined &&
    remoteSize !== undefined &&
    localRemoteSize !== remoteSize
  ) {
    return true
  }

  return false
}

export const fetchAllSharePointEntriesForOperation = async (
  agentId: string,
  operationId: string,
  siteId: string
): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const source = getSharePointSourcesForOperation(agent, operationId).find(
    source => source.config.site.id === siteId
  )
  if (!source) {
    throw new HTTPError(
      "SharePoint site is not connected for this operation",
      404
    )
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
      lastStartedAt: doc.lastStartedAt,
      errorMessage: doc.errorMessage,
      synced: doc.synced,
      failed: doc.failed,
      skipped: doc.skipped,
      unsupported: doc.unsupported,
      totalDiscovered: doc.totalDiscovered,
      status: doc.status,
    }))

  return { runs }
}

export const getSharePointSourceIdPrefixForOperation = (operationId: string) =>
  `sharepoint_site_${operationId.replace(/[^a-zA-Z0-9_-]/g, "_")}_`

export const deleteKnowledgeSourceSyncStateForOperation = async (
  agentId: string,
  operationId: string
) => {
  const sourceIdPrefix = getSharePointSourceIdPrefixForOperation(operationId)
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
    .filter(doc => doc.sourceId?.startsWith(sourceIdPrefix))
    .map(doc => ({
      ...doc,
      _deleted: true,
    }))

  if (docsToDelete.length > 0) {
    await db.bulkDocs(docsToDelete)
  }
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

const runSharePointSourcesForOperation = async (
  agentId: string,
  operationId: string,
  sourceId: string,
  signal?: AbortSignal
): Promise<SharePointSyncResult> => {
  const lastRunAt = new Date().toISOString()
  const agent = await agentsSdk.getOrThrow(agentId)
  const sharepointSources = getSharePointSourcesForOperation(agent, operationId)
  if (sharepointSources.length === 0) {
    throw new HTTPError("SharePoint is not connected for this operation", 400)
  }

  const knowledgeSource = getSharePointSourcesForOperation(
    agent,
    operationId
  ).find(source => source.id === sourceId)
  const site = knowledgeSource?.config.site
  const sourceDatasourceId = knowledgeSource?.config.datasourceId
  const sourceAuthConfigId = knowledgeSource?.config.authConfigId
  if (!site) {
    throw new HTTPError(
      "Specified SharePoint site is not connected for this operation",
      400
    )
  }

  const siteId = site.id
  const sourceFilters = knowledgeSource?.config.filters

  console.log("Starting SharePoint sync for agent", {
    agentId,
    sourceId: sourceId,
    siteId,
    runAt: lastRunAt,
    sourceFilters,
  })
  throwIfSyncAborted(signal)

  if (!sourceDatasourceId || !sourceAuthConfigId) {
    throw new HTTPError("SharePoint is not connected for this workspace", 400)
  }
  const bearerToken = await getSharePointBearerToken(
    sourceDatasourceId,
    sourceAuthConfigId
  )
  const knowledgeBase = await ensureKnowledgeBaseForOperation(
    agentId,
    operationId
  )
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
      etag?: string
      lastModifiedAt?: string
      remoteSize?: number
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
      etag: file.source.etag,
      lastModifiedAt: file.source.lastModifiedAt,
      remoteSize: file.source.remoteSize,
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
  let deadlineExceeded = false
  let phase = "preparing"

  const existingSourceFiles = existingFiles.filter(file =>
    isSharePointKnowledgeBaseFile(file, sourceId, siteId)
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
      filteredOutFileIds.map(fileId =>
        deleteFileForOperation(agentId, operationId, fileId)
      )
    )
    deleted = deleteResults.filter(
      result => result.status === "fulfilled"
    ).length
    deleteFailed = deleteResults.length - deleted
  }

  const existingSourceExternalIdsByFileId = new Map<string, string>()
  for (const file of existingSourceFiles) {
    const fileId = file._id
    if (!fileId) {
      continue
    }
    existingSourceExternalIdsByFileId.set(
      fileId,
      getSharePointFileDedupKey({
        siteId,
        driveId: file.source.driveId,
        itemId: file.source.itemId,
      })
    )
  }

  const discoveredExternalIds = new Set<string>()

  try {
    phase = "listing_drives"
    const driveIds = await listSharePointDrives(bearerToken, siteId, signal)
    console.log("Fetched SharePoint drives for site", {
      agentId,
      siteId,
      driveCount: driveIds.length,
    })
    for (const driveId of driveIds) {
      throwIfSyncAborted(signal)
      phase = "listing_files"
      const files = await collectSharePointFilesRecursive(
        bearerToken,
        driveId,
        undefined,
        "",
        signal
      )

      totalDiscovered += files.length
      for (const file of files) {
        throwIfSyncAborted(signal)
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
        discoveredExternalIds.add(externalSourceId)
        if (existingExternalIds.has(externalSourceId)) {
          const existingEntry =
            existingSharePointFilesByExternalId.get(externalSourceId)
          const hasMetadataChanged = hasSharePointFileMetadataChanged({
            local: {
              etag: existingEntry?.etag,
              lastModifiedAt: existingEntry?.lastModifiedAt,
              remoteSize: existingEntry?.remoteSize,
            },
            remote: {
              etag: file.etag,
              lastModifiedAt: file.lastModifiedAt,
              remoteSize: file.remoteSize,
            },
          })
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
          }

          if (!hasMetadataChanged) {
            skipped++
            alreadySynced++

            continue
          }

          const isOwnedByCurrentSource =
            existingEntry?.knowledgeSourceId === sourceId

          if (existingEntry?.fileId && isOwnedByCurrentSource) {
            try {
              await deleteFileForOperation(
                agentId,
                operationId,
                existingEntry.fileId
              )
              deleted++
            } catch (error) {
              console.error(
                "Failed to delete stale SharePoint file before re-sync",
                {
                  agentId,
                  siteId,
                  driveId,
                  itemId: file.itemId,
                  error,
                }
              )
              deleteFailed++
              failed++
              continue
            }
          }

          if (!isOwnedByCurrentSource) {
            skipped++
            alreadySynced++

            continue
          }

          existingExternalIds.delete(externalSourceId)
        }

        try {
          phase = "downloading_file"
          const buffer = await downloadSharePointFileBuffer(
            bearerToken,
            driveId,
            file.itemId,
            signal
          )

          throwIfSyncAborted(signal)
          phase = "uploading_file"
          await knowledgeBaseSdk.uploadKnowledgeBaseFile({
            knowledgeBaseId,
            source: {
              type: KnowledgeBaseFileSourceType.SHAREPOINT,
              knowledgeSourceId: sourceId,
              siteId,
              driveId,
              itemId: file.itemId,
              path: file.path,
              externalId: `${siteId}:${driveId}:${file.itemId}`,
              etag: file.etag,
              lastModifiedAt: file.lastModifiedAt,
              remoteSize: file.remoteSize,
            },
            filename: file.filename,
            mimetype: file.mimetype,
            size: buffer.byteLength,
            buffer,
            uploadedBy: `sharepoint:${sourceId}`,
          })
          throwIfSyncAborted(signal)

          existingExternalIds.add(externalSourceId)
          synced++
        } catch (error) {
          if (isSharePointSyncTimeoutError(error)) {
            throw error
          }
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

    const staleFileIds = existingSourceFiles
      .map(file => file._id)
      .filter((fileId): fileId is string => !!fileId)
      .filter(fileId => !filteredOutFileIds.includes(fileId))
      .filter(fileId => {
        const externalId = existingSourceExternalIdsByFileId.get(fileId)
        return !!externalId && !discoveredExternalIds.has(externalId)
      })

    if (staleFileIds.length > 0) {
      phase = "deleting_stale_files"
      const staleDeleteResults = await Promise.allSettled(
        staleFileIds.map(fileId =>
          deleteFileForOperation(agentId, operationId, fileId)
        )
      )
      const staleDeleted = staleDeleteResults.filter(
        result => result.status === "fulfilled"
      ).length
      deleted += staleDeleted
      deleteFailed += staleDeleteResults.length - staleDeleted
    }
  } catch (error) {
    if (isSharePointSyncTimeoutError(error)) {
      deadlineExceeded = true
      console.error("SharePoint sync deadline exceeded", {
        agentId,
        siteId,
        sourceId,
        totalDiscovered,
        processed: synced + failed + skipped,
        remaining: Math.max(totalDiscovered - synced - failed - skipped, 0),
        phase,
        error,
      })
      throw error
    }
    console.error("Failed to sync SharePoint site for agent", {
      agentId,
      siteId,
      error,
    })
    failed++
  } finally {
    if (!deadlineExceeded) {
      await saveSharePointSyncRunState({
        agentId,
        sourceId,
        lastRunAt,
        synced,
        failed,
        skipped,
        unsupported,
        totalDiscovered,
      })
      const runStatus = getSharePointSyncRunStatus(synced, failed)
      events.ai.ragFileSharePointSync({
        agentId,
        siteId,
        sourceId,
        synced,
        failed,
        skipped,
        alreadySynced,
        retried,
        unsupported,
        filteredOut,
        deleted,
        deleteFailed,
        totalDiscovered,
        status: runStatus,
      })
      console.log("Completed SharePoint site sync for agent", {
        agentId,
        siteId,
        sourceId,
        status: runStatus,
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

export const syncSharePointSourcesForOperation = async (
  agentId: string,
  operationId: string,
  sourceId: string
): Promise<SharePointSyncResult> => {
  const abortController = new AbortController()
  const timeout = setTimeout(
    () =>
      abortController.abort(
        new SharePointSyncTimeoutError(env.SHAREPOINT_SYNC_TIMEOUT_MS)
      ),
    env.SHAREPOINT_SYNC_TIMEOUT_MS
  )
  try {
    const { result } = await locks.doWithLock(
      {
        name: LockName.AGENT_RAG_KNOWLEDGE_BASE,
        type: LockType.AUTO_EXTEND,
        resource: `${agentId}:${sourceId}:sharepoint_sync`,
      },
      async () =>
        await runSharePointSourcesForOperation(
          agentId,
          operationId,
          sourceId,
          abortController.signal
        )
    )
    return result
  } finally {
    clearTimeout(timeout)
  }
}

export const syncSharePointSourcesForAgent = async (
  agentId: string,
  sourceId: string
): Promise<SharePointSyncResult> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const operationId = findOperationIdForKnowledgeSource(agent, sourceId)
  if (!operationId) {
    throw new HTTPError(
      "Specified SharePoint site is not connected for this agent",
      400
    )
  }

  return await syncSharePointSourcesForOperation(agentId, operationId, sourceId)
}

export const deleteSharePointFilesForOperationSite = async (
  agentId: string,
  operationId: string,
  siteId: string
) => {
  const files = await listFilesForOperation(agentId, operationId)
  const fileIdsToDelete = files
    .filter(
      file =>
        file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT &&
        file.source.siteId === siteId
    )
    .map(file => file._id)
    .filter((fileId): fileId is string => !!fileId)
  const results = await Promise.allSettled(
    fileIdsToDelete.map(fileId =>
      deleteFileForOperation(agentId, operationId, fileId)
    )
  )
  const failed = results.filter(result => result.status === "rejected").length
  console.log("SharePoint file cleanup completed for site", {
    agentId,
    siteId,
    deleted: fileIdsToDelete.length - failed,
    failed,
  })
}
