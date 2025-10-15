import {
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  ResourceDependenciesResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ResourceEndpoints {
  getResourcesInfo: () => Promise<ResourceDependenciesResponse>
  duplicateResourceToWorkspace: (
    request: DuplicateResourceToWorkspaceRequest
  ) => Promise<DuplicateResourceToWorkspaceResponse>
}

export const buildResourceEndpoints = (
  API: BaseAPIClient
): ResourceEndpoints => ({
  getResourcesInfo: async () => {
    return await API.get<ResourceDependenciesResponse>({
      url: `/api/resources`,
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
})
