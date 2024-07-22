import { DocumentDestroyResponse } from "@budibase/nano"
import { Automation } from "../../documents"

export interface DeleteAutomationResponse extends DocumentDestroyResponse {}

export interface AutomationBuilderData {
  displayName: string
  triggerInfo?: {
    type: string
    table: {
      id: string
      name: string
    }
    rowAction: {
      id: string
      name: string
    }
  }
}

export interface FetchAutomationResponse {
  automations: Automation[]
  builderData?: Record<string, AutomationBuilderData> // The key will be the automationId
}
