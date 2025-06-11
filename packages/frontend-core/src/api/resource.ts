import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  searchForUsage: (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => Promise<ResourceAnalysisResponse>
}

export const buildResourceEndpoints = (
  API: BaseAPIClient
): ResourceEndpoints => ({
  searchForUsage: async (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => {
    return await API.post<ResourceAnalysisRequest, ResourceAnalysisResponse>({
      url: `/api/resources/usage`,
      body,
    })
  },
})
