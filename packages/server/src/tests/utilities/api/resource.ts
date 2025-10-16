import {
  DuplicateResourceToWorkspaceRequest,
  DuplicateResourceToWorkspaceResponse,
  ResourceDependenciesResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ResourceAPI extends TestAPI {
  getResourceDependencies = async (
    expectations?: Expectations
  ): Promise<{ body: ResourceDependenciesResponse }> => {
    const result = await this._get<ResourceDependenciesResponse>(
      `/api/resources`,
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
}
