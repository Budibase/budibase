import { Automation, FetchAutomationResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class AutomationAPI extends TestAPI {
  get = async (
    automationId: string,
    expectations?: Expectations
  ): Promise<Automation> => {
    const result = await this._get<Automation>(
      `/api/automations/${automationId}`,
      {
        expectations,
      }
    )
    return result
  }

  fetch = async (
    expectations?: Expectations
  ): Promise<FetchAutomationResponse> => {
    return await this._get<FetchAutomationResponse>(`/api/automations`, {
      expectations,
    })
  }

  post = async (
    body: Automation,
    expectations?: Expectations
  ): Promise<Automation> => {
    const result = await this._post<Automation>(`/api/automations`, {
      body,
      expectations,
    })
    return result
  }
}
