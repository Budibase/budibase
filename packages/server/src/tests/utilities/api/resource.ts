import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ResourceAPI extends TestAPI {
  analyse = async (
    request: ResourceAnalysisRequest,
    expectations?: Expectations
  ): Promise<{ body: ResourceAnalysisResponse }> => {
    const result = await this._post<ResourceAnalysisResponse>(
      `/api/resources/analyse`,
      {
        expectations,
        body: request,
      }
    )
    return { body: result }
  }
}
