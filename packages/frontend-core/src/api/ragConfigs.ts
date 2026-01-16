import {
  CreateRagConfigRequest,
  RagConfig,
  RagConfigListResponse,
  UpdateRagConfigRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RagConfigEndpoints {
  fetch: () => Promise<RagConfigListResponse>
  create: (config: CreateRagConfigRequest) => Promise<RagConfig>
  update: (config: UpdateRagConfigRequest) => Promise<RagConfig>
  delete: (id: string) => Promise<{ deleted: true }>
}

export const buildRagConfigEndpoints = (
  API: BaseAPIClient
): RagConfigEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/ragconfig",
    })
  },

  create: async config => {
    return await API.post({
      url: "/api/ragconfig",
      body: config,
    })
  },

  update: async config => {
    return await API.put({
      url: "/api/ragconfig",
      body: config,
    })
  },

  delete: async id => {
    return await API.delete({
      url: `/api/ragconfig/${id}`,
    })
  },
})
