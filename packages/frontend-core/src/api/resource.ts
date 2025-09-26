import {
  DuplicateResourcePreviewResponse,
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
  previewDuplicateResourceToWorkspace: (
    resourceId: string,
    request: DuplicateResourceToWorkspaceRequest
  ) => Promise<{ body: DuplicateResourcePreviewResponse }>
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

  previewDuplicateResourceToWorkspace: async (
    resourceId: string,
    request: DuplicateResourceToWorkspaceRequest
  ): Promise<{ body: DuplicateResourcePreviewResponse }> => {
    const result = await API.post<
      DuplicateResourceToWorkspaceRequest,
      DuplicateResourcePreviewResponse
    >({
      url: `/api/resources/${resourceId}/duplicate/preview`,

      body: request,
    })
    return { body: result }
  },
})
