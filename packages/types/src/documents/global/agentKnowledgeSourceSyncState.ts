import { AgentKnowledgeSourceType, Document } from "../../"

export enum AgentKnowledgeSourceSyncRunStatus {
  SUCCESS = "success",
  PARTIAL = "partial",
  FAILED = "failed",
}

export enum AgentKnowledgeSourceSyncEntryStatus {
  SYNCED = "synced",
  FAILED = "failed",
  SKIPPED_EXISTING = "skipped_existing",
  EXCLUDED = "excluded",
  UNSUPPORTED = "unsupported",
}

export interface AgentKnowledgeSourceSyncEntry {
  driveId: string
  itemId: string
  filename: string
  path: string
  externalSourceId: string
  mimetype?: string
  status: AgentKnowledgeSourceSyncEntryStatus
  errorMessage?: string
}

export interface AgentKnowledgeSourceSyncState extends Document {
  agentId: string
  sourceType: AgentKnowledgeSourceType
  sourceId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  unsupported: number
  totalDiscovered: number
  status: AgentKnowledgeSourceSyncRunStatus
  entries?: AgentKnowledgeSourceSyncEntry[]
}
