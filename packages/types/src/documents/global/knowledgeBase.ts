import { Document } from "../.."

export enum KnowledgeBaseType {
  GEMINI = "gemini",
}

export interface GeminiKnowledgeBase extends Document {
  name: string
  type: KnowledgeBaseType.GEMINI
  config: {
    googleFileStoreId: string
  }
}

export type KnowledgeBase = GeminiKnowledgeBase

export enum KnowledgeBaseFileStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export interface KnowledgeBaseFile extends Document {
  knowledgeSourceId: string
  filename: string
  mimetype?: string
  size?: number
  originFileId?: string
  objectStoreKey: string
  retrievalFileId: string
  status: KnowledgeBaseFileStatus
  uploadedBy: string
  errorMessage?: string
  processedAt?: string
}
