import {
  GetWebSearchConfigResponse,
  SaveWebSearchConfigRequest,
  SaveWebSearchConfigResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WebSearchConfigEndpoints {
  getWebSearchConfig: () => Promise<GetWebSearchConfigResponse>
  saveWebSearchConfig: (
    config: SaveWebSearchConfigRequest
  ) => Promise<SaveWebSearchConfigResponse>
  deleteWebSearchConfig: () => Promise<void>
}

export const buildWebSearchConfigEndpoints = (
  API: BaseAPIClient
): WebSearchConfigEndpoints => ({
  getWebSearchConfig: async () => {
    return await API.get({
      url: `/api/agent/websearch/config`,
    })
  },

  saveWebSearchConfig: async config => {
    return await API.post({
      url: `/api/agent/websearch/config`,
      body: config,
    })
  },

  deleteWebSearchConfig: async () => {
    return await API.delete({
      url: `/api/agent/websearch/config`,
    })
  },
})
