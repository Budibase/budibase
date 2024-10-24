import { DocumentDestroyResponse } from "@budibase/nano"
import { Automation } from "../../documents"

export interface DeleteAutomationResponse extends DocumentDestroyResponse {}

export interface FetchAutomationResponse {
  automations: Automation[]
}
