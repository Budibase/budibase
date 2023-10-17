import { Automation, AutomationMetadata } from "../../documents"
import { Job } from "bull"

export interface AutomationDataEvent {
  appId?: string
  metadata?: AutomationMetadata
  automation?: Automation
  timeout?: number
}

export interface AutomationData {
  event: AutomationDataEvent
  automation: Automation
}

export type AutomationJob = Job<AutomationData>
