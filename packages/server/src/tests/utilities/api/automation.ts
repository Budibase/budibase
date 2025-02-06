import {
  Automation,
  CreateAutomationResponse,
  DeleteAutomationResponse,
  FetchAutomationResponse,
  GetAutomationActionDefinitionsResponse,
  GetAutomationStepDefinitionsResponse,
  GetAutomationTriggerDefinitionsResponse,
  TestAutomationRequest,
  TestAutomationResponse,
  TriggerAutomationRequest,
  TriggerAutomationResponse,
  UpdateAutomationRequest,
  UpdateAutomationResponse,
} from "@budibase/types"
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

  getActions = async (
    expectations?: Expectations
  ): Promise<GetAutomationActionDefinitionsResponse> => {
    return await this._get<GetAutomationActionDefinitionsResponse>(
      `/api/automations/actions/list`,
      {
        expectations,
      }
    )
  }

  getTriggers = async (
    expectations?: Expectations
  ): Promise<GetAutomationTriggerDefinitionsResponse> => {
    return await this._get<GetAutomationTriggerDefinitionsResponse>(
      `/api/automations/triggers/list`,
      {
        expectations,
      }
    )
  }

  getDefinitions = async (
    expectations?: Expectations
  ): Promise<GetAutomationStepDefinitionsResponse> => {
    return await this._get<GetAutomationStepDefinitionsResponse>(
      `/api/automations/definitions/list`,
      {
        expectations,
      }
    )
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
  ): Promise<CreateAutomationResponse> => {
    const result = await this._post<CreateAutomationResponse>(
      `/api/automations`,
      {
        body,
        expectations,
      }
    )
    return result
  }

  test = async (
    id: string,
    body: TestAutomationRequest,
    expectations?: Expectations
  ): Promise<TestAutomationResponse> => {
    return await this._post<TestAutomationResponse>(
      `/api/automations/${id}/test`,
      {
        body,
        expectations,
      }
    )
  }

  trigger = async (
    id: string,
    body: TriggerAutomationRequest,
    expectations?: Expectations
  ): Promise<TriggerAutomationResponse> => {
    return await this._post<TriggerAutomationResponse>(
      `/api/automations/${id}/trigger`,
      {
        expectations,
        body,
      }
    )
  }

  update = async (
    body: UpdateAutomationRequest,
    expectations?: Expectations
  ): Promise<UpdateAutomationResponse> => {
    return await this._put<UpdateAutomationResponse>(`/api/automations`, {
      body,
      expectations,
    })
  }

  delete = async (
    automation: Automation,
    expectations?: Expectations
  ): Promise<DeleteAutomationResponse> => {
    return await this._delete<DeleteAutomationResponse>(
      `/api/automations/${automation._id!}/${automation._rev!}`,
      {
        expectations,
      }
    )
  }
}
