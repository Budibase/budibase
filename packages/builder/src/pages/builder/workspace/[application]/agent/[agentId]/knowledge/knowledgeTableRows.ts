import { helpers } from "@budibase/shared-core"
import {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
  type KnowledgeSourceOption,
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
  files.filter(file => file.originFileId?.startsWith(`sharepoint:${siteId}:`))

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

export const getSharePointSelectedStatusCounts = (
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
        (file): file is KnowledgeBaseFile & { originFileId: string } =>
          !!file.originFileId
      )
      .map(file => [file.originFileId, file.status] as const)
  )

  let totalSelected = 0
  let synced = 0
  let failed = 0
  let processing = 0

  for (const entry of entries) {
    if (
      entry.status === AgentKnowledgeSourceSyncEntryStatus.EXCLUDED ||
      entry.status === AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED
    ) {
      continue
    }
    totalSelected++

    if (entry.status === AgentKnowledgeSourceSyncEntryStatus.FAILED) {
      failed++
      continue
    }

    const fileStatus = fileStatusByExternalSourceId.get(entry.originFileId)
    if (
      fileStatus == null ||
      fileStatus === KnowledgeBaseFileStatus.PROCESSING
    ) {
      processing++
      continue
    }
    if (fileStatus === KnowledgeBaseFileStatus.FAILED) {
      failed++
      continue
    }
    synced++
  }

  return { totalSelected, synced, failed, processing }
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
  selectedSiteIds,
  sharePointSites,
  sharePointSources,
  sharePointSyncRunsBySiteId,
  files,
  onDelete,
  onSync,
  onClick: onConfigure,
}: {
  selectedSiteIds: string[]
  sharePointSites: KnowledgeSourceOption[]
  sharePointSources: Array<{
    id: string
    config: { site?: { id: string; name?: string; webUrl?: string } }
  }>
  sharePointSyncRunsBySiteId: Record<string, KnowledgeSourceSyncRun>
  files: KnowledgeBaseFile[]
  onDelete: (siteId: string) => Promise<void>
  onSync: (sourceId: string) => Promise<void>
  onClick: (siteId: string) => Promise<void>
}): SharePointConnectionTableRow[] => {
  if (selectedSiteIds.length === 0) {
    return []
  }

  const optionById = new Map(sharePointSites.map(site => [site.id, site]))

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
      const selectedStatusCounts = getSharePointSelectedStatusCounts(
        getSharePointFilesForSite(files, siteId),
        run
      )
      if (!selectedStatusCounts) {
        return null
      }
      const total = selectedStatusCounts.totalSelected
      const completed =
        selectedStatusCounts.synced + selectedStatusCounts.failed
      const option = optionById.get(siteId)
      const siteDisplayName =
        site.name ||
        site.webUrl ||
        option?.name ||
        option?.webUrl ||
        "SharePoint site"
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
        syncedCount: selectedStatusCounts.synced,
        totalCount: total,
        failedCount: selectedStatusCounts.failed,
        processingCount: selectedStatusCounts.processing,
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
