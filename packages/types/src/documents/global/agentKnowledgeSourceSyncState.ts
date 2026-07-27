import { Document } from "../../"

export enum AgentKnowledgeSourceSyncRunStatus {
  QUEUED = "queued",
  RUNNING = "running",
  SUCCESS = "success",
  PARTIAL = "partial",
  FAILED = "failed",
}

export interface AgentKnowledgeSourceSyncState extends Document {
  agentId: string
  sourceId: string
  lastRunAt?: string
  lastStartedAt?: string
  errorMessage?: string
  synced: number
  failed: number
  skipped: number
  unsupported: number
  totalDiscovered: number
  status: AgentKnowledgeSourceSyncRunStatus
}
