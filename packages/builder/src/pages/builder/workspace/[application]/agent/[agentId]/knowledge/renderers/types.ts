import {
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileStatus,
} from "@budibase/types"

export interface FileKnowledgeTableRow {
  kind: "file"
  __clickable?: boolean
  _id?: string
  filename: string
  status: KnowledgeBaseFileStatus
  displayStatus: string
  size: string
  updatedAt: string | number
  mimetype?: string
  isUploading?: boolean
  onDelete?: () => Promise<void>
  errorMessage?: string
}

export interface SharePointConnectionTableRow {
  kind: "sharepoint_connection"
  __clickable: boolean
  _id: string
  sourceId: string
  siteId: string
  filename: string
  subtitle: string
  displayStatus: string
  syncedCount: number
  totalCount: number
  failedCount: number
  processingCount: number
  hasSynced: boolean
  runStatus?: AgentKnowledgeSourceSyncRunStatus
  onDelete: () => Promise<void>
  onSync: () => Promise<void>
}

export type KnowledgeTableRow =
  | FileKnowledgeTableRow
  | SharePointConnectionTableRow
