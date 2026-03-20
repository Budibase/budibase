import { Document } from "../.."

export enum KnowledgeSourceProvider {
  UPLOAD_FILES = "upload_files",
  GOOGLE_DRIVE = "google_drive",
  SHAREPOINT = "sharepoint",
  CONFLUENCE = "confluence",
}

export enum KnowledgeSourceSyncStatus {
  IDLE = "idle",
  RUNNING = "running",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export interface KnowledgeSource extends Document {
  knowledgeBaseId: string
  name: string
  provider: KnowledgeSourceProvider
  scope?: Record<string, unknown>
  auth?: {
    oauth2ConfigId?: string
    externalConnectionId?: string
  }
  sync?: {
    enabled?: boolean
    intervalHours?: number
    lastRunAt?: string
    lastSuccessAt?: string
    lastStatus?: KnowledgeSourceSyncStatus
    lastError?: string
  }
}
