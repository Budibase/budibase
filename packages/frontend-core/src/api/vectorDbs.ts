import {
  CreateVectorDbRequest,
  UpdateVectorDbRequest,
  VectorDb,
  VectorDbListResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface VectorDbEndpoints {
  fetch: () => Promise<VectorDbListResponse>
  create: (config: CreateVectorDbRequest) => Promise<VectorDb>
  update: (config: UpdateVectorDbRequest) => Promise<VectorDb>
  delete: (id: string) => Promise<{ deleted: true }>
}

export const buildVectorDbEndpoints = (
  API: BaseAPIClient
): VectorDbEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/vectordb",
    })
  },

  create: async config => {
    return await API.post({
      url: "/api/vectordb",
      body: config,
    })
  },

  update: async config => {
    return await API.put({
      url: "/api/vectordb",
      body: config,
    })
  },

  delete: async id => {
    return await API.delete({
      url: `/api/vectordb/${id}`,
    })
  },
})
