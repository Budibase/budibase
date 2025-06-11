import { ResourceUsageRequest, ResourceUsageResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  searchForUsage: (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => Promise<ResourceUsageResponse>
}

export const buildResourceEndpoints = (
  API: BaseAPIClient
): ResourceEndpoints => ({
  searchForUsage: async (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => {
    return await API.post<ResourceUsageRequest, ResourceUsageResponse>({
      url: `/api/resources/usage`,
      body,
    })
  },
})
