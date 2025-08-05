import {
  Automation,
  AutomationMetadata,
  Row,
  UserBindings,
} from "../../documents"
import { Job } from "bull"

export interface AutomationDataEvent {
  appId?: string
  metadata?: AutomationMetadata
  automation?: Automation
  timeout?: number
  row?: Row
  oldRow?: Row
  user?: UserBindings
  timestamp?: number
  fields?: Record<string, any>
}

export interface AutomationData {
  event: AutomationDataEvent
  automation: Automation
}

export interface AutomationRowEvent {
  appId: string
  row: Row
  oldRow: Row
}

// Simplified storage - just store up to N results
export const DEFAULT_MAX_STORED_RESULTS = 100

export type AutomationJob = Job<AutomationData>
