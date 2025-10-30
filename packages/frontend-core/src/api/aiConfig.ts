import {
  AIConfigListResponse,
  CustomAIProviderConfig,
  CreateAIConfigRequest,
  UpdateAIConfigRequest,
} from "@budibase/types"

import { BaseAPIClient } from "./types"

export interface AIConfigEndpoints {
  fetch: () => Promise<AIConfigListResponse>
  create: (config: CreateAIConfigRequest) => Promise<CustomAIProviderConfig>
  update: (config: UpdateAIConfigRequest) => Promise<CustomAIProviderConfig>
  delete: (id: string) => Promise<{ deleted: true }>
}

export const buildAIConfigEndpoints = (
  API: BaseAPIClient
): AIConfigEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: `/api/configs`,
    })
  },

  create: async config => {
    return await API.post({
      url: `/api/configs`,
      body: config,
    })
  },

  update: async config => {
    return await API.put({
      url: `/api/configs`,
      body: config,
    })
  },

  delete: async id => {
    return await API.delete({
      url: `/api/configs/${id}`,
    })
  },
})
