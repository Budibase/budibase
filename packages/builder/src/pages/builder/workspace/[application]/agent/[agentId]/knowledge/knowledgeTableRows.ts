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

export const getSharePointLastSyncLabel = (
  snapshot?: SharePointKnowledgeSourceSnapshot
) => {
  const run = snapshot
  if (!run?.lastRunAt) {
    return "SharePoint"
  }
  return `Last sync at ${formatTimestamp(run.lastRunAt)} - SharePoint`
}

export const toSharePointConnectionRows = ({
  sharePointSourceSnapshots,
  onDelete,
  onSync,
  onClick: onConfigure,
}: {
  sharePointSourceSnapshots: SharePointKnowledgeSourceSnapshot[]
  onDelete: (siteId: string) => Promise<void>
  onSync: (sourceId: string) => Promise<void>
  onClick: (siteId: string) => Promise<void>
}): SharePointConnectionTableRow[] => {
  if (sharePointSourceSnapshots.length === 0) {
    return []
  }

  return sharePointSourceSnapshots
    .map(snapshot => {
      const hasSynced = !!snapshot.lastRunAt
      const completed = snapshot.syncedCount + snapshot.failedCount
      const siteDisplayName = snapshot.name || snapshot.webUrl || "SharePoint site"
      const displayStatus =
        snapshot.status === "empty"
          ? "No files found"
          : snapshot.status === "connecting" || snapshot.status === "syncing"
            ? "Processing"
            : `${completed}/${snapshot.totalCount} files`
      return {
        kind: "sharepoint_connection" as const,
        __clickable: true,
        _id: snapshot.siteId,
        sourceId: snapshot.sourceId,
        siteId: snapshot.siteId,
        filename: siteDisplayName,
        subtitle: getSharePointLastSyncLabel(snapshot),
        displayStatus,
        syncedCount: snapshot.syncedCount,
        totalCount: snapshot.totalCount,
        failedCount: snapshot.failedCount,
        processingCount: snapshot.processingCount,
        hasSynced,
        runStatus: snapshot.runStatus,
        onDelete: () => onDelete(snapshot.siteId),
        onSync: () => onSync(snapshot.sourceId),
        onConfigure: () => onConfigure(snapshot.siteId),
      }
    })
    .sort((a, b) => a.filename.localeCompare(b.filename))
}
