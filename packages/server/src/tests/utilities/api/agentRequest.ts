import {
  FetchAgentRequestsResponse,
  FetchRequestsResponse,
  FindRequestResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class AgentRequestAPI extends TestAPI {
  fetchForWorkspace = async (expectations?: Expectations) => {
    return await this._get<FetchAgentRequestsResponse>("/api/agent/requests", {
      expectations: { status: 200, ...expectations },
    })
  }

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
