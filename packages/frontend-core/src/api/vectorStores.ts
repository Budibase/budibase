import {
  CreateVectorDbRequest,
  UpdateVectorDbRequest,
  VectorDb,
  VectorDbListResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface VectorStoreEndpoints {
  fetch: () => Promise<VectorDbListResponse>
  create: (config: CreateVectorDbRequest) => Promise<VectorDb>
  update: (config: UpdateVectorDbRequest) => Promise<VectorDb>
  delete: (id: string) => Promise<{ deleted: true }>
}

export const buildVectorStoreEndpoints = (
  API: BaseAPIClient
): VectorStoreEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/vector-store",
    })
  },

  create: async config => {
    return await API.post({
      url: "/api/vector-store",
      body: config,
    })
  },

  update: async config => {
    return await API.put({
      url: "/api/vector-store",
      body: config,
    })
  },

  delete: async id => {
    return await API.delete({
      url: `/api/vector-store/${id}`,
    })
  },
})
