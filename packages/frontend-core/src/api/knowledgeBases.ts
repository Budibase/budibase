import {
  CreateKnowledgeBaseRequest,
  FetchSharePointSitesResponse,
  FetchKnowledgeBaseFilesResponse,
  KnowledgeBase,
  KnowledgeBaseType,
  KnowledgeBaseFileUploadResponse,
  KnowledgeBaseListResponse,
  ManagedFileSearchKnowledgeBase,
  SyncKnowledgeBaseResponse,
  UpdateKnowledgeBaseRequest,
  VectorKnowledgeBase,
} from "@budibase/types"
import { BaseAPIClient } from "./types"
import { utils } from "@budibase/shared-core"

export interface KnowledgeBaseEndpoints {
  fetch: () => Promise<KnowledgeBaseListResponse>
  create: (config: CreateKnowledgeBaseRequest) => Promise<KnowledgeBase>
  update: (config: UpdateKnowledgeBaseRequest) => Promise<KnowledgeBase>
  delete: (id: string) => Promise<{ deleted: true }>
  sync: (knowledgeBaseId: string) => Promise<SyncKnowledgeBaseResponse>
  fetchSharePointSites: (
    knowledgeBaseId: string
  ) => Promise<FetchSharePointSitesResponse>
  fetchFiles: (
    knowledgeBaseId: string
  ) => Promise<FetchKnowledgeBaseFilesResponse>
  uploadFile: (
    knowledgeBaseId: string,
    file: File
  ) => Promise<KnowledgeBaseFileUploadResponse>
  deleteFile: (
    knowledgeBaseId: string,
    fileId: string
  ) => Promise<{ deleted: true }>
}

export const buildKnowledgeBaseEndpoints = (
  API: BaseAPIClient
): KnowledgeBaseEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/knowledge-base",
    })
  },

  create: async config => {
    const { type } = config
    switch (type) {
      case KnowledgeBaseType.LOCAL:
        return await API.post<VectorKnowledgeBase, KnowledgeBase>({
          url: "/api/knowledge-base",
          body: config,
        })
      case KnowledgeBaseType.SHAREPOINT:
      case KnowledgeBaseType.GOOGLE_DRIVE:
      case KnowledgeBaseType.CONFLUENCE:
        return await API.post<ManagedFileSearchKnowledgeBase, KnowledgeBase>({
          url: "/api/knowledge-base",
          body: config,
        })
      default:
        throw utils.unreachable(type)
    }
  },

  update: async config => {
    const { type } = config
    switch (type) {
      case KnowledgeBaseType.LOCAL:
        return await API.put<VectorKnowledgeBase, KnowledgeBase>({
          url: "/api/knowledge-base",
          body: config,
        })
      case KnowledgeBaseType.SHAREPOINT:
      case KnowledgeBaseType.GOOGLE_DRIVE:
      case KnowledgeBaseType.CONFLUENCE:
        return await API.put<ManagedFileSearchKnowledgeBase, KnowledgeBase>({
          url: "/api/knowledge-base",
          body: config,
        })
      default:
        throw utils.unreachable(type)
    }
  },

  delete: async id => {
    return await API.delete({
      url: `/api/knowledge-base/${id}`,
    })
  },

  fetchFiles: async knowledgeBaseId => {
    return await API.get({
      url: `/api/knowledge-base/${knowledgeBaseId}/files`,
    })
  },

  sync: async knowledgeBaseId => {
    return await API.post<null, SyncKnowledgeBaseResponse>({
      url: `/api/knowledge-base/${knowledgeBaseId}/sync`,
    })
  },

  fetchSharePointSites: async knowledgeBaseId => {
    return await API.get({
      url: `/api/knowledge-base/${knowledgeBaseId}/sharepoint/sites`,
    })
  },

  uploadFile: async (knowledgeBaseId, file) => {
    const formData = new FormData()
    formData.append("file", file)
    return await API.post<FormData, KnowledgeBaseFileUploadResponse>({
      url: `/api/knowledge-base/${knowledgeBaseId}/files`,
      body: formData,
      json: false,
    })
  },

  deleteFile: async (knowledgeBaseId, fileId) => {
    return await API.delete({
      url: `/api/knowledge-base/${knowledgeBaseId}/files/${fileId}`,
    })
  },
})
