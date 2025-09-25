import {
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  ResourceUsageRequest,
  ResourceUsageResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  searchForUsage: (body: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) => Promise<ResourceUsageResponse>
  duplicateResourceToWorkspace: (
    resourceId: string,
    request: DuplicateResourceToWorkspaceRequest
  ) => Promise<DuplicateResourceToWorkspaceResponse>
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

  duplicateResourceToWorkspace: async (
    resourceId: string,
    request: DuplicateResourceToWorkspaceRequest
  ) => {
    return await API.post<
      DuplicateResourceToWorkspaceRequest,
      DuplicateResourceToWorkspaceResponse
    >({
      url: `/api/resources/${resourceId}/duplicate`,
      body: request,
    })
  },
})
