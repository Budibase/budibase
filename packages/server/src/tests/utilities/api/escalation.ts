import { EscalationRespondResult, EscalationResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class EscalationAPI extends TestAPI {
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
