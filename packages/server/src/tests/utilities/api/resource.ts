import {
  ResourceAnalysisRequest,
  ResourceAnalysisResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ResourceAPI extends TestAPI {
  analyze = async (
    request: ResourceAnalysisRequest,
    expectations?: Expectations
  ): Promise<{ body: ResourceAnalysisResponse }> => {
    const result = await this._post<ResourceAnalysisResponse>(
      `/api/resources/analyze`,
      {
        expectations,
        body: request,
      }
    )
    return { body: result }
  }
}
