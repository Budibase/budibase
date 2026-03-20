import {
  KnowledgeBase,
  KnowledgeBaseFile,
  ManagedFileSearchKnowledgeBase,
  VectorKnowledgeBase,
} from "../../../documents"

export type KnowledgeBaseListResponse = KnowledgeBase[]
export type CreateKnowledgeBaseRequest =
  | Omit<VectorKnowledgeBase, "_id" | "_rev" | "_deleted">
  | Omit<ManagedFileSearchKnowledgeBase, "_id" | "_rev" | "_deleted">
export type UpdateKnowledgeBaseRequest =
  | VectorKnowledgeBase
  | ManagedFileSearchKnowledgeBase

export interface FetchKnowledgeBaseFilesResponse {
  files: KnowledgeBaseFile[]
}

export interface KnowledgeBaseFileUploadResponse {
  file: KnowledgeBaseFile
}
