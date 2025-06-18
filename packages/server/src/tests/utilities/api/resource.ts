import { ResourceUsageRequest, ResourceUsageResponse } from "@budibase/types"
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
}
