import {
  ClearAutomationLogRequest,
  ClearAutomationLogResponse,
  CreateAutomationRequest,
  CreateAutomationResponse,
  DeleteAutomationResponse,
  FetchAutomationResponse,
  GetAutomationStepDefinitionsResponse,
  SearchAutomationLogsRequest,
  SearchAutomationLogsResponse,
  TestAutomationRequest,
  TestAutomationResponse,
  TriggerAutomationRequest,
  TriggerAutomationResponse,
  UpdateAutomationRequest,
  UpdateAutomationResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AutomationEndpoints {
  getAutomations: () => Promise<FetchAutomationResponse>
  createAutomation: (
    automation: CreateAutomationRequest
  ) => Promise<CreateAutomationResponse>
  updateAutomation: (
    automation: UpdateAutomationRequest
  ) => Promise<UpdateAutomationResponse>
  deleteAutomation: (
    automationId: string,
    automationRev: string
  ) => Promise<DeleteAutomationResponse>
  clearAutomationLogErrors: (
    automationId: string,
    appId: string
  ) => Promise<ClearAutomationLogResponse>
  triggerAutomation: (
    automationId: string,
    fields: Record<string, any>,
    timeout: number
  ) => Promise<TriggerAutomationResponse>
  testAutomation: (
    automationdId: string,
    data: TestAutomationRequest
  ) => Promise<TestAutomationResponse>
  getAutomationDefinitions: () => Promise<GetAutomationStepDefinitionsResponse>
  getAutomationLogs: (
    options: SearchAutomationLogsRequest
  ) => Promise<SearchAutomationLogsResponse>
}

export const buildAutomationEndpoints = (
  API: BaseAPIClient
): AutomationEndpoints => ({
  /**
   * Executes an automation. Must have "App Action" trigger.
   * @param automationId the ID of the automation to trigger
   * @param fields the fields to trigger the automation with
   * @param timeout a timeout override
   */
  triggerAutomation: async (automationId, fields, timeout) => {
    return await API.post<TriggerAutomationRequest, TriggerAutomationResponse>({
      url: `/api/automations/${automationId}/trigger`,
      body: { fields, timeout },
    })
  },

  /**
   * Tests an automation with data.
   * @param automationId the ID of the automation to test
   * @param data the test data to run against the automation
   */
  testAutomation: async (automationId, data) => {
    return await API.post({
      url: `/api/automations/${automationId}/test`,
      body: data,
    })
  },

  /**
   * Gets a list of all automations.
   */
  getAutomations: async () => {
    return await API.get({
      url: "/api/automations",
    })
  },

  /**
   * Gets a list of all the definitions for blocks in automations.
   */
  getAutomationDefinitions: async () => {
    return await API.get({
      url: "/api/automations/definitions/list",
    })
  },

  /**
   * Creates an automation.
   * @param automation the automation to create
   */
  createAutomation: async automation => {
    return await API.post({
      url: "/api/automations",
      body: automation,
    })
  },

  /**
   * Updates an automation.
   * @param automation the automation to update
   */
  updateAutomation: async automation => {
    return await API.put({
      url: "/api/automations",
      body: automation,
    })
  },

  /**
   * Deletes an automation
   * @param automationId the ID of the automation to delete
   * @param automationRev the rev of the automation to delete
   */
  deleteAutomation: async (automationId, automationRev) => {
    return await API.delete({
      url: `/api/automations/${automationId}/${automationRev}`,
    })
  },

  /**
   * Get the logs for the app, or by automation ID.
   */
  getAutomationLogs: async data => {
    return await API.post({
      url: "/api/automations/logs/search",
      body: data,
    })
  },

  /**
   * Clears automation log errors (which are creating notification) for
   * automation or the app.
   * @param automationId optional - the ID of the automation to clear errors for.
   * @param appId The app ID to clear errors for.
   */
  clearAutomationLogErrors: async (automationId, appId) => {
    return await API.delete<
      ClearAutomationLogRequest,
      ClearAutomationLogResponse
    >({
      url: "/api/automations/logs",
      body: {
        appId,
        automationId,
      },
    })
  },
})
