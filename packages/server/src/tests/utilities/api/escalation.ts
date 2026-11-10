import {
  EscalationRespondResult,
  EscalationResponse,
  RespondToEscalationRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class EscalationAPI extends TestAPI {
  respond = async (
    escalationId: string,
    body: RespondToEscalationRequest,
    opts: { headers?: Record<string, string>; expectations?: Expectations } = {}
  ) => {
    return await this._post<EscalationRespondResult>(
      `/api/escalations/${escalationId}/respond`,
      {
        body,
        headers: opts.headers,
        expectations: { status: 200, ...opts.expectations },
      }
    )
  }

  resolve = async (
    escalationId: string,
    response: EscalationResponse,
    expectations?: Expectations
  ) => {
    return await this._post<EscalationRespondResult>(
      `/api/escalations/${escalationId}/resolve`,
      {
        body: { response },
        expectations: { status: 200, ...expectations },
      }
    )
  }

  cancel = async (escalationId: string, expectations?: Expectations) => {
    return await this._post<{ message: string }>(
      `/api/escalations/${escalationId}/cancel`,
      {
        expectations: { status: 200, ...expectations },
      }
    )
  }
}
