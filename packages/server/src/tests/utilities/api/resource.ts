import {
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  DuplicateResourcePreviewResponse,
  ResourceUsageRequest,
  ResourceUsageResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ResourceAPI extends TestAPI {
  searchForUsage = async (
    request: ResourceUsageRequest,
    expectations?: Expectations
  ): Promise<{ body: ResourceUsageResponse }> => {
    const result = await this._post<ResourceUsageResponse>(
      `/api/resources/usage`,
      {
        expectations,
        body: request,
      }
    )
    return { body: result }
  }

  duplicateResourceToWorkspace = async (
    request: DuplicateResourceToWorkspaceRequest & { resourceId: string },
    expectations?: Expectations
  ): Promise<{ body: DuplicateResourceToWorkspaceResponse }> => {
    const { resourceId: id, ...body } = request
    const result = await this._post<DuplicateResourceToWorkspaceResponse>(
      `/api/resources/${id}/duplicate`,
      {
        expectations,
        body,
      }
    )
    return { body: result }
  }

  previewDuplicateResourceToWorkspace = async (
    request: DuplicateResourceToWorkspaceRequest & { resourceId: string },
    expectations?: Expectations
  ): Promise<{ body: DuplicateResourcePreviewResponse }> => {
    const { resourceId: id, ...body } = request
    const result = await this._post<DuplicateResourcePreviewResponse>(
      `/api/resources/${id}/duplicate/preview`,
      {
        expectations,
        body,
      }
    )
    return { body: result }
  }
}
