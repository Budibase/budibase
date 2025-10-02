import {
  DuplicateResourcePreviewResponse,
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  ResourceUsageResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ResourceAPI extends TestAPI {
  searchForUsage = async (
    expectations?: Expectations
  ): Promise<{ body: ResourceUsageResponse }> => {
    const result = await this._get<ResourceUsageResponse>(
      `/api/resources/usage`,
      {
        expectations,
      }
    )
    return { body: result }
  }

  duplicateResourceToWorkspace = async (
    request: DuplicateResourceToWorkspaceRequest,
    expectations?: Expectations
  ): Promise<{ body: DuplicateResourceToWorkspaceResponse }> => {
    const result = await this._post<DuplicateResourceToWorkspaceResponse>(
      `/api/resources/duplicate`,
      {
        expectations,
        body: request,
      }
    )
    return { body: result }
  }

  previewDuplicateResourceToWorkspace = async (
    request: DuplicateResourceToWorkspaceRequest,
    expectations?: Expectations
  ): Promise<{ body: DuplicateResourcePreviewResponse }> => {
    const result = await this._post<DuplicateResourcePreviewResponse>(
      `/api/resources/duplicate/preview`,
      {
        expectations,
        body: request,
      }
    )
    return { body: result }
  }
}
