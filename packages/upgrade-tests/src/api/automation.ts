import { Automation } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class AutomationAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(appId?: string): Promise<Automation[]> {
    const endpoint = appId 
      ? `/api/applications/${appId}/automations`
      : `/api/automations`
    
    const response = await this.client.get(endpoint)
    return response.data.automations || response.data
  }

  async test(automationId: string, inputs?: any): Promise<{ success: boolean; response?: any }> {
    try {
      const response = await this.client.post(`/api/automations/${automationId}/test`, {
        inputs: inputs || {}
      })
      return {
        success: true,
        response: response.data
      }
    } catch (error) {
      return {
        success: false,
        response: error
      }
    }
  }
}