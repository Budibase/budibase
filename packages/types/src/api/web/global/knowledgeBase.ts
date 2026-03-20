import {
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseType,
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

export interface ManagedKnowledgeBaseFileReference {
  id: string
  name: string
  url?: string
  mimeType?: string
  modifiedAt?: string
}

export interface SharePointSiteReference {
  id: string
  name: string
  webUrl?: string
}

export interface SyncKnowledgeBaseResponse {
  knowledgeBaseId: string
  knowledgeBaseType:
    | KnowledgeBaseType.SHAREPOINT
    | KnowledgeBaseType.GOOGLE_DRIVE
    | KnowledgeBaseType.CONFLUENCE
  files: ManagedKnowledgeBaseFileReference[]
  fetchedAt: string
}

export interface FetchSharePointSitesResponse {
  knowledgeBaseId: string
  sites: SharePointSiteReference[]
}
