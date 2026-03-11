import { KnowledgeBase, KnowledgeBaseFile } from "../../../documents"

export type KnowledgeBaseListResponse = KnowledgeBase[]
export type CreateKnowledgeBaseRequest = Omit<
  KnowledgeBase,
  "_id" | "_rev" | "_deleted"
>
export type UpdateKnowledgeBaseRequest = KnowledgeBase

export interface FetchKnowledgeBaseFilesResponse {
  files: KnowledgeBaseFile[]
}

export interface KnowledgeBaseFileUploadResponse {
  file: KnowledgeBaseFile
}
