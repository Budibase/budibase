import { helpers } from "@budibase/shared-core"
import {
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
  type SharePointKnowledgeSourceSnapshot,
} from "@budibase/types"
import type { OperationKnowledgeRejectedUpload } from "@/stores/portal/agents"
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

export type RejectedUpload = Omit<OperationKnowledgeRejectedUpload, "file">

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

const isFailedRow = (row: FileKnowledgeTableRow) =>
  row.status === KnowledgeBaseFileStatus.FAILED

export const toFileKnowledgeRows = ({
  files,
  pendingUploads = [],
  rejectedUploads = [],
  knowledgeSearchConfigured = false,
  onDelete,
  onRetry,
  onRetryRejected,
  onDismissRejected,
}: {
  files: KnowledgeBaseFile[]
  pendingUploads?: PendingUpload[]
  rejectedUploads?: RejectedUpload[]
  knowledgeSearchConfigured?: boolean
  onDelete?: (file: KnowledgeBaseFile) => Promise<void>
  onRetry?: (file: KnowledgeBaseFile) => Promise<void>
  onRetryRejected?: (tempId: string) => Promise<void>
  onDismissRejected?: (tempId: string) => void
}): FileKnowledgeTableRow[] => {
  const rows: FileKnowledgeTableRow[] = [
    ...pendingUploads.map(upload => ({
      kind: "file" as const,
      knowledgeSearchConfigured,
      _id: upload.tempId,
      filename: upload.filename,
      status: KnowledgeBaseFileStatus.PROCESSING,
      displayStatus: "Uploading",
      isUploading: true,
      canRetry: false,
      size: helpers.formatBytes(upload.size, " "),
      updatedAt: formatTimestamp(upload.createdAt),
      mimetype: upload.mimetype,
    })),
    ...rejectedUploads.map(upload => ({
      kind: "file" as const,
      knowledgeSearchConfigured,
      _id: upload.tempId,
      filename: upload.filename,
      status: KnowledgeBaseFileStatus.FAILED,
      displayStatus: readableStatus[KnowledgeBaseFileStatus.FAILED],
      isRejected: true,
      canRetry: upload.retryable,
      size: helpers.formatBytes(upload.size, " "),
      updatedAt: formatTimestamp(upload.createdAt),
      mimetype: upload.mimetype,
      errorMessage: upload.reason,
      onRetry: onRetryRejected
        ? () => onRetryRejected(upload.tempId)
        : undefined,
      onDismiss: onDismissRejected
        ? () => onDismissRejected(upload.tempId)
        : undefined,
    })),
    ...files.map(file => ({
      kind: "file" as const,
      knowledgeSearchConfigured,
      _id: file._id,
      filename: file.filename,
      status: file.status,
      displayStatus: formatFileStatus(file),
      canRetry: file.status === KnowledgeBaseFileStatus.FAILED,
      size: helpers.formatBytes(file.size, " "),
      updatedAt: formatTimestamp(
        file.processedAt || file.updatedAt || file.createdAt
      ),
      mimetype: file.mimetype,
      onDelete: onDelete ? () => onDelete(file) : undefined,
      onRetry: onRetry ? () => onRetry(file) : undefined,
      errorMessage: file.errorMessage,
    })),
  ]
  return rows.sort(
    (a, b) =>
      Number(isFailedRow(b)) - Number(isFailedRow(a)) ||
      a.filename.localeCompare(b.filename)
  )
}

export const getSharePointFilesForSite = (
  files: KnowledgeBaseFile[],
  siteId: string
) =>
  files.filter(
    file =>
      (file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_SITE ||
        file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT_LIST) &&
      file.source.siteId === siteId
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

const getSharePointSiteDisplayName = ({
  site,
  snapshot,
}: {
  site?: { id: string; name?: string; webUrl?: string }
  snapshot?: SharePointKnowledgeSourceSnapshot
}) => {
  const resolvedName =
    snapshot?.name || snapshot?.webUrl || site?.name || site?.webUrl
  if (resolvedName) {
    return resolvedName
  }
  return "Loading SharePoint site..."
}

type SharePointConnectionDisplayStatusInput = {
  isQueued: boolean
  isRunning: boolean
  hasCompletedSync: boolean
  hasFileData: boolean
  isEmpty: boolean
  synced: number
  failed: number
  total: number
}

const getSharePointConnectionDisplayStatus = ({
  isQueued,
  isRunning,
  hasCompletedSync,
  hasFileData,
  isEmpty,
  synced,
  failed,
  total,
}: SharePointConnectionDisplayStatusInput) => {
  if (isQueued) {
    return "Queued"
  }

  if (isRunning) {
    return "Syncing"
  }

  if (!hasCompletedSync && !hasFileData) {
    return "Processing"
  }

  if (isEmpty) {
    return "No content found"
  }

  const ready = `${synced}/${total} ready`
  return failed > 0 ? `${ready} · ${failed} failed` : ready
}

export const toSharePointConnectionRows = ({
  sharePointSources,
  sharePointSourceSnapshots,
  onDelete,
  onSync,
  knowledgeSearchConfigured = false,
}: {
  sharePointSources: Array<{
    id: string
    config: { site?: { id: string; name?: string; webUrl?: string } }
  }>
  sharePointSourceSnapshots: SharePointKnowledgeSourceSnapshot[]
  onDelete: (siteId: string) => Promise<void>
  onSync: (sourceId: string) => Promise<void>
  knowledgeSearchConfigured?: boolean
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
      const hasCompletedSync = !!snapshot?.lastRunAt
      const total = snapshot?.totalCount || 0
      const synced = snapshot?.syncedCount || 0
      const syncFailures = snapshot?.failedCount || 0
      const processing = snapshot?.processingCount || 0
      const isQueued =
        snapshot?.runStatus === AgentKnowledgeSourceSyncRunStatus.QUEUED
      const isRunning =
        snapshot?.runStatus === AgentKnowledgeSourceSyncRunStatus.RUNNING
      const isSyncing = isQueued || isRunning
      const hasFileData = total > 0
      const isEmpty = total === 0
      const siteDisplayName = getSharePointSiteDisplayName({ site, snapshot })
      const displayStatus = getSharePointConnectionDisplayStatus({
        isQueued,
        isRunning,
        hasCompletedSync,
        hasFileData,
        isEmpty,
        synced,
        failed: syncFailures,
        total,
      })
      const hasSynced = hasCompletedSync || hasFileData
      return {
        kind: "sharepoint_connection" as const,
        knowledgeSearchConfigured,
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
        isSyncing,
        runStatus: snapshot?.runStatus,
        errorMessage: snapshot?.errorMessage,
        onDelete: () => onDelete(siteId),
        onSync: () => onSync(source.id),
      }
    })
    .filter(s => s !== null)
    .sort((a, b) => a.filename.localeCompare(b.filename))
}
