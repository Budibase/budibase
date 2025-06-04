import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  analyse: (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => Promise<ResourceAnalysisResponse>
}

export const buildResourceEndpoints = (
  API: BaseAPIClient
): ResourceEndpoints => ({
  analyse: async (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => {
    return await API.post<ResourceAnalysisRequest, ResourceAnalysisResponse>({
      url: `/api/resource/analyse`,
      body,
    })
  },
})
