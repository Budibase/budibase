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

export enum KnowledgeBaseFileSourceType {
  SHAREPOINT = "sharepoint",
  SHAREPOINT_LIST = "sharepoint_list",
}

export interface SharePointKnowledgeBaseFileSource {
  type: KnowledgeBaseFileSourceType.SHAREPOINT
  knowledgeSourceId: string
  siteId: string
  driveId: string
  itemId: string
  path: string
  externalId?: string
  etag?: string
  lastModifiedAt?: string
  remoteSize?: number
}

export interface SharePointListKnowledgeBaseFileSource {
  type: KnowledgeBaseFileSourceType.SHAREPOINT_LIST
  knowledgeSourceId: string
  siteId: string
  listId: string
  listName: string
  webUrl?: string
  contentHash: string
  itemCount: number
}

export type KnowledgeBaseFileSource =
  | SharePointKnowledgeBaseFileSource
  | SharePointListKnowledgeBaseFileSource

export interface KnowledgeBaseFile extends Document {
  knowledgeBaseId: string
  source?: KnowledgeBaseFileSource
  filename: string
  mimetype?: string
  size?: number
  objectStoreKey: string
  ragSourceId?: string
  status: KnowledgeBaseFileStatus
  uploadedBy: string
  errorMessage?: string
  processedAt?: string
}
