import {
  CreateKnowledgeBaseRequest,
  FetchKnowledgeBaseFilesResponse,
  KnowledgeBase,
  KnowledgeBaseFileUploadResponse,
  KnowledgeBaseListResponse,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface KnowledgeBaseEndpoints {
  fetch: () => Promise<KnowledgeBaseListResponse>
  create: (config: CreateKnowledgeBaseRequest) => Promise<KnowledgeBase>
  update: (config: UpdateKnowledgeBaseRequest) => Promise<KnowledgeBase>
  delete: (id: string) => Promise<{ deleted: true }>
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
    return await API.post({
      url: "/api/knowledge-base",
      body: config,
    })
  },

  update: async config => {
    return await API.put({
      url: "/api/knowledge-base",
      body: config,
    })
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
