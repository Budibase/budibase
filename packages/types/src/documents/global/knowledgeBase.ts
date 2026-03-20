import { Document } from "../.."

export enum RetrievalBackend {
  BUDIBASE_VECTOR = "budibase_vector",
  MANAGED_FILE_SEARCH = "managed_file_search",
}

export enum ManagedRetrievalProvider {
  GOOGLE_FILE_SEARCH = "google_file_search",
}

export interface VectorKnowledgeBase extends Document {
  name: string
  retrievalBackend: RetrievalBackend.BUDIBASE_VECTOR
  embeddingModel: string
  vectorDb: string
  managedRetrievalProvider?: never
  managedRetrievalIndexId?: never
}

export interface ManagedFileSearchKnowledgeBase extends Document {
  name: string
  retrievalBackend: RetrievalBackend.MANAGED_FILE_SEARCH
  managedRetrievalProvider: ManagedRetrievalProvider
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
