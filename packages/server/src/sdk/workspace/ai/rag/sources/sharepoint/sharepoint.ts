import {
  context,
  docIds,
  events,
  HTTPError,
  locks,
} from "@budibase/backend-core"
import { createHash } from "crypto"
import {
  getSharePointListFilterPath,
  matchesConfiguredPatterns,
} from "@budibase/shared-core"
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
  type SharePointListKnowledgeBaseFileSource,
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
  fetchSharePointListDocument,
  getSharePointBearerToken,
  listSharePointDrives,
  listSharePointLists,
  MAX_SHAREPOINT_GENERATED_LIST_SIZE_BYTES,
} from "../../../knowledgeSources/sharepoint"
import { findOperationIdForKnowledgeSource } from "../../../agents/knowledgeConfig"
import {
  deleteFileForOperation,
  ensureKnowledgeBaseForOperation,
  listFilesForOperation,
} from "../../files"
import env from "../../../../../../environment"

const BYTES_IN_MB = 1024 * 1024
const MAX_SHAREPOINT_KNOWLEDGE_FILE_SIZE_BYTES = 100 * BYTES_IN_MB

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

const waitForSyncOrAbort = async <T>(
  promise: Promise<T>,
  signal?: AbortSignal
): Promise<T> => {
  throwIfSyncAborted(signal)

  if (!signal) {
    return await promise
  }

  return await new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      reject(
        signal.reason instanceof Error
          ? signal.reason
          : new Error("SharePoint sync aborted")
      )
    }

    signal.addEventListener("abort", onAbort, { once: true })

    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort))
  })
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
  errorMessage,
}: {
  agentId: string
  sourceId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  unsupported: number
  totalDiscovered: number
  errorMessage?: string
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
    errorMessage,
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

const isOversizedSharePointFile = (file: { remoteSize?: number }) =>
  file.remoteSize !== undefined &&
  file.remoteSize > MAX_SHAREPOINT_KNOWLEDGE_FILE_SIZE_BYTES

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
  filters?: AgentKnowledgeSourceFilterConfig,
  relativePath?: string
) => {
  const { patterns } = normalizeSourceFilters(filters)

  if (!patterns?.length) {
    return true
  }
  return (
    matchesConfiguredPatterns(path, patterns) ||
    (!!relativePath && matchesConfiguredPatterns(relativePath, patterns))
  )
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
    file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_SITE &&
    file.source.knowledgeSourceId === sourceId &&
    file.source.siteId === siteId
  )
}

const isSharePointListKnowledgeBaseFile = (
  file: KnowledgeBaseFile,
  sourceId: string,
  siteId: string
): file is KnowledgeBaseFile & {
  _id: string
  source: SharePointListKnowledgeBaseFileSource
} =>
  !!file._id &&
  file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_LIST &&
  file.source.knowledgeSourceId === sourceId &&
  file.source.siteId === siteId

const getSharePointListContentHash = (buffer: Buffer) =>
  createHash("sha256")
    .update(buffer as Uint8Array<ArrayBuffer>)
    .digest("hex")

const getSharePointListFilename = (
  siteName: string | undefined,
  listName: string,
  listId: string
) => {
  const readableName = [siteName, listName]
    .filter(Boolean)
    .join(" - ")
    .replace(/[^a-zA-Z0-9 _.-]/g, "_")
    .trim()
  return `${readableName || "SharePoint list"} (${listId.slice(-8)}).csv`
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
  const drives = await listSharePointDrives(bearerToken, siteId)
  const entries: KnowledgeSourceEntry[] = []

  for (const drive of drives) {
    entries.push({
      id: drive.id,
      name: drive.name,
      path: drive.name,
      type: "folder",
    })
    const files = await collectSharePointFilesRecursive(bearerToken, drive.id)
    for (const file of files) {
      const path = file.path
      if (!path) {
        continue
      }
      entries.push({
        id: `${file.driveId}:${file.itemId}`,
        name: file.filename || path.split("/").pop() || path,
        path: `${drive.name}/${path}`,
        type: "file",
      })
    }
  }

  const lists = await listSharePointLists(bearerToken, siteId)
  for (const list of lists) {
    entries.push({
      id: list.id,
      name: list.name,
      path: list.name,
      type: "list",
      webUrl: list.webUrl,
    })
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
      file.source?.type !== KnowledgeBaseFileSourceType.SHAREPOINT_SITE
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
  const existingSourceLists = existingFiles.filter(file =>
    isSharePointListKnowledgeBaseFile(file, sourceId, siteId)
  )
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
  const discoveredListIds = new Set<string>()
  const syncErrors: string[] = []

  try {
    phase = "listing_drives"
    const drives = await listSharePointDrives(bearerToken, siteId, signal)
    console.log("Fetched SharePoint drives for site", {
      agentId,
      siteId,
      driveCount: drives.length,
    })
    for (const drive of drives) {
      const driveId = drive.id
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
        const qualifiedPath = `${drive.name}/${file.path}`
        if (
          !isSharePointPathIncludedByFilters(
            qualifiedPath,
            sourceFilters,
            file.path
          )
        ) {
          skipped++
          filteredOut++
          continue
        }
        if (isOversizedSharePointFile(file)) {
          skipped++
          unsupported++
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

          if (buffer.byteLength > MAX_SHAREPOINT_KNOWLEDGE_FILE_SIZE_BYTES) {
            skipped++
            unsupported++
            continue
          }

          throwIfSyncAborted(signal)
          phase = "uploading_file"
          await waitForSyncOrAbort(
            knowledgeBaseSdk.uploadKnowledgeBaseFile({
              knowledgeBaseId,
              source: {
                type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
                knowledgeSourceId: sourceId,
                siteId,
                driveId,
                itemId: file.itemId,
                path: qualifiedPath,
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
            }),
            signal
          )
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

    const lists = await listSharePointLists(bearerToken, siteId)
    totalDiscovered += lists.length
    const existingListsById = new Map(
      existingSourceLists.map(file => [file.source.listId, file])
    )

    for (const list of lists) {
      discoveredListIds.add(list.id)
      const existingListFile = existingListsById.get(list.id)
      if (
        !isSharePointPathIncludedByFilters(
          getSharePointListFilterPath(list.id),
          sourceFilters
        )
      ) {
        skipped++
        filteredOut++
        if (existingListFile?._id) {
          try {
            await deleteFileForOperation(
              agentId,
              operationId,
              existingListFile._id
            )
            deleted++
          } catch (error) {
            deleteFailed++
            failed++
            syncErrors.push(`Failed to remove deselected list ${list.name}`)
          }
        }
        continue
      }

      try {
        const document = await fetchSharePointListDocument(
          bearerToken,
          siteId,
          list.id,
          MAX_SHAREPOINT_GENERATED_LIST_SIZE_BYTES
        )
        const contentHash = getSharePointListContentHash(document.buffer)

        if (
          existingListFile?.source.contentHash === contentHash &&
          existingListFile.status === KnowledgeBaseFileStatus.FAILED
        ) {
          await knowledgeBaseSdk.retryKnowledgeBaseFileIngestion(
            existingListFile._id
          )
          synced++
          retried++
          continue
        }
        if (existingListFile?.source.contentHash === contentHash) {
          skipped++
          alreadySynced++
          continue
        }

        if (
          document.buffer.byteLength > MAX_SHAREPOINT_GENERATED_LIST_SIZE_BYTES
        ) {
          failed++
          syncErrors.push(
            `SharePoint list ${list.name} exceeds the 100 MB knowledge file limit`
          )
          continue
        }

        const replacementFile = await knowledgeBaseSdk.uploadKnowledgeBaseFile({
          knowledgeBaseId,
          source: {
            type: KnowledgeBaseFileSourceType.SHAREPOINT_LIST,
            knowledgeSourceId: sourceId,
            siteId,
            listId: list.id,
            listName: list.name,
            webUrl: list.webUrl,
            contentHash,
            itemCount: document.itemCount,
          },
          filename: getSharePointListFilename(site.name, list.name, list.id),
          mimetype: "text/csv",
          size: document.buffer.byteLength,
          buffer: document.buffer,
          uploadedBy: `sharepoint:${sourceId}`,
        })

        if (existingListFile?._id) {
          if (!replacementFile._id) {
            throw new Error(
              `Replacement upload for SharePoint list ${list.name} did not return a file ID`
            )
          }

          try {
            await deleteFileForOperation(
              agentId,
              operationId,
              existingListFile._id
            )
            deleted++
          } catch (deleteError) {
            deleteFailed++
            const deleteMessage =
              deleteError instanceof Error
                ? deleteError.message
                : String(deleteError)

            try {
              await deleteFileForOperation(
                agentId,
                operationId,
                replacementFile._id
              )
              deleted++
            } catch (rollbackError) {
              deleteFailed++
              const rollbackMessage =
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError)
              throw new Error(
                `Failed to delete previous SharePoint list file ${existingListFile._id}: ${deleteMessage}; failed to roll back replacement file ${replacementFile._id}: ${rollbackMessage}`,
                { cause: deleteError }
              )
            }

            throw new Error(
              `Failed to delete previous SharePoint list file ${existingListFile._id}: ${deleteMessage}; replacement file ${replacementFile._id} was rolled back`,
              { cause: deleteError }
            )
          }
        }

        synced++
      } catch (error) {
        failed++
        const message = error instanceof Error ? error.message : String(error)
        syncErrors.push(
          `Failed to sync SharePoint list ${list.name}: ${message}`
        )
        console.error("Failed to sync SharePoint list for agent", {
          agentId,
          siteId,
          listId: list.id,
          error,
        })
      }
    }

    const staleListFileIds = existingSourceLists
      .filter(file => !discoveredListIds.has(file.source.listId))
      .map(file => file._id)
      .filter((fileId): fileId is string => !!fileId)
    if (staleListFileIds.length > 0) {
      const staleListDeleteResults = await Promise.allSettled(
        staleListFileIds.map(fileId =>
          deleteFileForOperation(agentId, operationId, fileId)
        )
      )
      const staleListsDeleted = staleListDeleteResults.filter(
        result => result.status === "fulfilled"
      ).length
      const staleListsDeleteFailed =
        staleListDeleteResults.length - staleListsDeleted
      deleted += staleListsDeleted
      deleteFailed += staleListsDeleteFailed
      failed += staleListsDeleteFailed
      syncErrors.push(
        ...staleListDeleteResults
          .map((result, index) => ({ result, fileId: staleListFileIds[index] }))
          .filter(
            (
              entry
            ): entry is {
              result: PromiseRejectedResult
              fileId: string
            } => entry.result.status === "rejected"
          )
          .map(({ result, fileId }) => {
            const message =
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason)
            return `Failed to delete stale SharePoint list file ${fileId}: ${message}`
          })
      )
    }

    const staleFileIds = existingSourceFiles
      .map(file => file._id)
      .filter((fileId): fileId is string => !!fileId)
      .filter(fileId => {
        const externalId = existingSourceExternalIdsByFileId.get(fileId)
        return !!externalId && !discoveredExternalIds.has(externalId)
      })

    if (staleFileIds.length > 0) {
      phase = "deleting_stale_files"
      const staleDeleteResults = await waitForSyncOrAbort(
        Promise.allSettled(
          staleFileIds.map(fileId =>
            deleteFileForOperation(agentId, operationId, fileId)
          )
        ),
        signal
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
        errorMessage:
          syncErrors.length > 0
            ? syncErrors.join("\n").slice(0, 4000)
            : undefined,
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
  const { result } = await locks.doWithLock(
    {
      name: LockName.AGENT_RAG_KNOWLEDGE_BASE,
      type: LockType.AUTO_EXTEND,
      resource: `${agentId}:${sourceId}:sharepoint_sync`,
    },
    async () => {
      const abortController = new AbortController()
      const timeout = setTimeout(
        () =>
          abortController.abort(
            new SharePointSyncTimeoutError(env.SHAREPOINT_SYNC_TIMEOUT_MS)
          ),
        env.SHAREPOINT_SYNC_TIMEOUT_MS
      )

      try {
        return await runSharePointSourcesForOperation(
          agentId,
          operationId,
          sourceId,
          abortController.signal
        )
      } finally {
        clearTimeout(timeout)
      }
    }
  )

  return result
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
        (file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_SITE ||
          file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_LIST) &&
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
