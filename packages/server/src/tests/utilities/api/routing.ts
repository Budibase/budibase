import {
  FetchClientScreenRoutingResponse,
  FetchScreenRoutingResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class RoutingAPI extends TestAPI {
  client = async (
    expectations?: Expectations
  ): Promise<FetchClientScreenRoutingResponse> => {
    return await this._get<FetchClientScreenRoutingResponse>(
      `/api/routing/client`,
      { expectations }
    )
  }

  fetchAll = async (
    expectations?: Expectations
  ): Promise<FetchScreenRoutingResponse> => {
    return await this._get<FetchScreenRoutingResponse>(`/api/routing`, {
      expectations,
    })
  }
}
