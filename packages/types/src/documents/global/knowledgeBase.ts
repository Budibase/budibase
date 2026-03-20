import { Document } from "../.."

export enum KnowledgeBaseType {
  LOCAL = "local",
  SHAREPOINT = "sharepoint",
  GOOGLE_DRIVE = "google_drive",
  CONFLUENCE = "confluence",
}

export interface VectorKnowledgeBase extends Document {
  name: string
  type: KnowledgeBaseType.LOCAL
  embeddingModel: string
  vectorDb: string
  connectionId?: never
  scope?: never
  managedRetrievalIndexId?: never
}

export interface ManagedFileSearchKnowledgeBase extends Document {
  name: string
  type:
    | KnowledgeBaseType.SHAREPOINT
    | KnowledgeBaseType.GOOGLE_DRIVE
    | KnowledgeBaseType.CONFLUENCE
  connectionId: string
  scope?: Record<string, unknown>
  managedRetrievalIndexId?: string
  embeddingModel?: never
  vectorDb?: never
}

export type KnowledgeBase = VectorKnowledgeBase | ManagedFileSearchKnowledgeBase

export enum KnowledgeBaseFileStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export interface KnowledgeBaseFile extends Document {
  knowledgeBaseId: string
  filename: string
  mimetype?: string
  size?: number
  objectStoreKey: string
  ragSourceId: string
  status: KnowledgeBaseFileStatus
  chunkCount: number
  uploadedBy: string
  errorMessage?: string
  processedAt?: string
}
