import { helpers } from "@budibase/shared-core"
import {
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
  type SharePointKnowledgeSourceSnapshot,
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
  files.filter(
    file => file.source?.type === "sharepoint" && file.source.siteId === siteId
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

export const getSharePointLastSyncLabel = (lastRunAt?: string) => {
  if (!lastRunAt) {
    return "SharePoint"
  }
  return `Last sync at ${formatTimestamp(lastRunAt)} - SharePoint`
}

export const toSharePointConnectionRows = ({
  sharePointSources,
  sharePointSourceSnapshots,
  loadingSharePointSites,
  onDelete,
  onSync,
}: {
  sharePointSources: Array<{
    id: string
    config: { site?: { id: string; name?: string; webUrl?: string } }
  }>
  sharePointSourceSnapshots: SharePointKnowledgeSourceSnapshot[]
  loadingSharePointSites: boolean
  onDelete: (siteId: string) => Promise<void>
  onSync: (sourceId: string) => Promise<void>
}): SharePointConnectionTableRow[] => {
  if (sharePointSources.length === 0) {
    return []
  }

  return sharePointSources
    .map(source => {
      const site = source.config.site
      if (!site?.id) {
        return null
      }
      const siteId = site.id
      const snapshot = sharePointSourceSnapshots.find(
        s => s.sourceId === source.id
      )
      const hasSynced = !!snapshot?.lastRunAt
      const total = snapshot?.totalCount || 0
      const synced = snapshot?.syncedCount || 0
      const syncFailures = snapshot?.failedCount || 0
      const processing = snapshot?.processingCount || 0
      const completed = Math.min(synced + syncFailures, total)
      const siteDisplayName =
        snapshot?.name ||
        snapshot?.webUrl ||
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
        __clickable: hasSynced,
        _id: siteId,
        sourceId: source.id,
        siteId,
        filename: siteDisplayName,
        subtitle: getSharePointLastSyncLabel(snapshot?.lastRunAt),
        displayStatus,
        syncedCount: synced,
        totalCount: total,
        failedCount: syncFailures,
        processingCount: processing,
        hasSynced,
        runStatus: snapshot?.runStatus,
        onDelete: () => onDelete(siteId),
        onSync: () => onSync(source.id),
      }
    })
    .filter(s => s !== null)
    .sort((a, b) => a.filename.localeCompare(b.filename))
}
