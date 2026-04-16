import { helpers } from "@budibase/shared-core"
import {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
  type KnowledgeSourceSyncRun,
} from "@budibase/types"
import type {
  FileKnowledgeTableRow,
  SharePointConnectionTableRow,
} from "./renderers/types"

export interface PendingUpload {
  tempId: string
  filename: string
  size?: number
  mimetype?: string
  createdAt: string
}

export const formatTimestamp = (value?: string | number) => {
  if (value == null || value === "") {
    return "—"
  }
  try {
    return new Date(value).toLocaleString()
  } catch (error) {
    return value
  }
}

const readableStatus: Record<KnowledgeBaseFileStatus, string> = {
  [KnowledgeBaseFileStatus.PROCESSING]: "Processing",
  [KnowledgeBaseFileStatus.READY]: "Ready",
  [KnowledgeBaseFileStatus.FAILED]: "Failed",
}

const formatFileStatus = (file: KnowledgeBaseFile) =>
  readableStatus[file.status] || file.status

export const toFileTableRows = (
  list: KnowledgeBaseFile[],
  onDelete: (file: KnowledgeBaseFile) => Promise<void>,
  activePendingUploads?: PendingUpload[]
): FileKnowledgeTableRow[] => {
  return [
    ...(activePendingUploads || []).map(upload => ({
      kind: "file" as const,
      _id: upload.tempId,
      filename: upload.filename,
      status: KnowledgeBaseFileStatus.PROCESSING,
      displayStatus: "Uploading",
      isUploading: true,
      size: helpers.formatBytes(upload.size, " "),
      updatedAt: formatTimestamp(upload.createdAt),
      onDelete: undefined,
      errorMessage: undefined,
      mimetype: upload.mimetype,
    })),
    ...list.map(file => ({
      kind: "file" as const,
      _id: file._id,
      filename: file.filename,
      status: file.status,
      displayStatus: formatFileStatus(file),
      size: helpers.formatBytes(file.size, " "),
      updatedAt: formatTimestamp(
        file.processedAt || file.updatedAt || file.createdAt
      ),
      mimetype: file.mimetype,
      onDelete: () => onDelete(file),
      errorMessage: file.errorMessage,
    })),
  ].sort((a, b) => a.filename.localeCompare(b.filename))
}

type ReadOnlyFileKnowledgeTableRow = Omit<FileKnowledgeTableRow, "onDelete">

export const toReadOnlyFileTableRows = (
  list: KnowledgeBaseFile[]
): ReadOnlyFileKnowledgeTableRow[] =>
  toFileTableRows(list, async () => {}, undefined).map(
    ({ onDelete: _onDelete, ...row }) => row
  )

export const getSharePointFilesForSite = (
  files: KnowledgeBaseFile[],
  siteId: string
) =>
  files.filter(file =>
    file.externalSourceId?.startsWith(`sharepoint:${siteId}:`)
  )

export const getSharePointFileProcessingCounts = (
  files: KnowledgeBaseFile[],
  siteId: string
) => {
  const siteFiles = getSharePointFilesForSite(files, siteId)
  const ready = siteFiles.filter(
    file => file.status === KnowledgeBaseFileStatus.READY
  ).length
  const failed = siteFiles.filter(
    file => file.status === KnowledgeBaseFileStatus.FAILED
  ).length
  const processing = siteFiles.filter(
    file => file.status === KnowledgeBaseFileStatus.PROCESSING
  ).length
  return { ready, failed, processing }
}

export const getSharePointIncludedProgress = (
  files: KnowledgeBaseFile[],
  run?: KnowledgeSourceSyncRun
) => {
  const entries = run?.entries || []
  if (entries.length === 0) {
    return undefined
  }

  const fileStatusByExternalSourceId = new Map(
    files
      .filter(
        (
          file
        ): file is KnowledgeBaseFile & { externalSourceId: string } =>
          !!file.externalSourceId
      )
      .map(file => [file.externalSourceId, file.status] as const)
  )

  let totalSelected = 0
  let processed = 0

  for (const entry of entries) {
    if (entry.status === AgentKnowledgeSourceSyncEntryStatus.EXCLUDED) {
      continue
    }
    totalSelected++

    if (
      entry.status === AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED ||
      entry.status === AgentKnowledgeSourceSyncEntryStatus.SKIPPED_EXISTING ||
      entry.status === AgentKnowledgeSourceSyncEntryStatus.FAILED
    ) {
      processed++
      continue
    }

    if (entry.status === AgentKnowledgeSourceSyncEntryStatus.SYNCED) {
      const fileStatus = fileStatusByExternalSourceId.get(entry.externalSourceId)
      if (
        fileStatus != null &&
        fileStatus !== KnowledgeBaseFileStatus.PROCESSING
      ) {
        processed++
      }
    }
  }

  return { processed, totalSelected }
}

export const getSharePointLastSyncLabel = (
  runsBySiteId: Record<string, KnowledgeSourceSyncRun>,
  siteId: string
) => {
  const run = runsBySiteId[siteId]
  if (!run?.lastRunAt) {
    return "SharePoint"
  }
  return `Last sync at ${formatTimestamp(run.lastRunAt)} - SharePoint`
}

export const toSharePointConnectionRows = ({
  hasSharePointConnection,
  selectedSiteIds,
  sharePointSources,
  sharePointSyncRunsBySiteId,
  files,
  loadingSharePointSites,
  onDelete,
  onSync,
  onConfigure,
}: {
  hasSharePointConnection: boolean
  selectedSiteIds: string[]
  sharePointSources: Array<{
    id: string
    config: { site?: { id: string; name?: string; webUrl?: string } }
  }>
  sharePointSyncRunsBySiteId: Record<string, KnowledgeSourceSyncRun>
  files: KnowledgeBaseFile[]
  loadingSharePointSites: boolean
  onDelete: (siteId: string) => Promise<void>
  onSync: (sourceId: string) => Promise<void>
  onConfigure: (siteId: string) => Promise<void>
}): SharePointConnectionTableRow[] => {
  if (!hasSharePointConnection) {
    return []
  }

  return selectedSiteIds
    .map(siteId => {
      const source = sharePointSources.find(
        source => source.config.site?.id === siteId
      )
      const site = source?.config.site
      if (!source || !site) {
        return null
      }
      const run = sharePointSyncRunsBySiteId[siteId]
      const hasSynced = !!run?.lastRunAt
      const { ready, failed, processing } = getSharePointFileProcessingCounts(
        files,
        siteId
      )
      const includedProgress = getSharePointIncludedProgress(
        getSharePointFilesForSite(files, siteId),
        run
      )
      const total =
        includedProgress?.totalSelected ??
        (run?.totalDiscovered || 0) - (run?.unsupported || 0)
      const completed =
        includedProgress?.processed ?? Math.min(ready + failed, total)
      const siteDisplayName =
        site.name ||
        site.webUrl ||
        (loadingSharePointSites
          ? "Loading SharePoint site..."
          : "SharePoint site")
      const displayStatus = !hasSynced
        ? "Processing"
        : total === 0
          ? "No files found"
          : `${completed}/${total} files`
      return {
        kind: "sharepoint_connection" as const,
        __clickable: true,
        _id: siteId,
        sourceId: source.id,
        siteId,
        filename: siteDisplayName,
        subtitle: getSharePointLastSyncLabel(
          sharePointSyncRunsBySiteId,
          siteId
        ),
        displayStatus,
        syncedCount: ready,
        totalCount: total,
        failedCount: failed,
        processingCount: processing,
        hasSynced,
        runStatus: run?.status,
        onDelete: () => onDelete(siteId),
        onSync: () => onSync(source.id),
        onConfigure: () => onConfigure(siteId),
      }
    })
    .filter(s => s !== null)
    .sort((a, b) => a.filename.localeCompare(b.filename))
}
