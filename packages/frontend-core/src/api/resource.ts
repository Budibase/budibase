import {
  DuplicateResourcePreviewResponse,
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  ResourceUsageResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  searchForUsage: () => Promise<ResourceUsageResponse>
  duplicateResourceToWorkspace: (
    request: DuplicateResourceToWorkspaceRequest
  ) => Promise<DuplicateResourceToWorkspaceResponse>
  previewDuplicateResourceToWorkspace: (
    request: DuplicateResourceToWorkspaceRequest
  ) => Promise<{ body: DuplicateResourcePreviewResponse }>
}

export const buildResourceEndpoints = (
  API: BaseAPIClient
): ResourceEndpoints => ({
  searchForUsage: async () => {
    return await API.get<ResourceUsageResponse>({
      url: `/api/resources/usage`,
    })
  },

  duplicateResourceToWorkspace: async (
    request: DuplicateResourceToWorkspaceRequest
  ) => {
    return await API.post<
      DuplicateResourceToWorkspaceRequest,
      DuplicateResourceToWorkspaceResponse
    >({
      url: `/api/resources/duplicate`,
      body: request,
    })
  },

  previewDuplicateResourceToWorkspace: async (
    request: DuplicateResourceToWorkspaceRequest
  ): Promise<{ body: DuplicateResourcePreviewResponse }> => {
    const result = await API.post<
      DuplicateResourceToWorkspaceRequest,
      DuplicateResourcePreviewResponse
    >({
      url: `/api/resources/duplicate/preview`,

      body: request,
    })
    return { body: result }
  },
})
