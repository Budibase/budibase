import { AgentKnowledgeSourceType, Document } from "../../"

export enum AgentKnowledgeSourceSyncRunStatus {
  SUCCESS = "success",
  PARTIAL = "partial",
  FAILED = "failed",
}

export enum AgentKnowledgeSourceSyncEntryStatus {
  SYNCED = "synced",
  FAILED = "failed",
  EXCLUDED = "excluded",
  UNSUPPORTED = "unsupported",
}

export interface AgentKnowledgeSourceSyncEntry {
  path: string
  externalSourceId: string
  status: AgentKnowledgeSourceSyncEntryStatus
  errorMessage?: string
}

export interface AgentKnowledgeSourceSyncState extends Document {
  agentId: string
  sourceType: AgentKnowledgeSourceType
  sourceId: string
  lastRunAt: string
  status: AgentKnowledgeSourceSyncRunStatus
  entries?: AgentKnowledgeSourceSyncEntry[]
}
