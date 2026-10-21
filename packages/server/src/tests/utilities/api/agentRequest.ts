import { FetchRequestsResponse, FindRequestResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class AgentRequestAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchRequestsResponse>("/api/requests", {
      expectations: { status: 200, ...expectations },
    })
  }

  find = async (requestId: string, expectations?: Expectations) => {
    return await this._get<FindRequestResponse>(`/api/requests/${requestId}`, {
      expectations: { status: 200, ...expectations },
    })
  }
}
