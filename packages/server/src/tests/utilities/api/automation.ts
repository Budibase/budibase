import { Automation } from "@budibase/types"
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
