import {
  Automation,
  AutomationMetadata,
  AutomationStatus,
  AutomationStoppedReason,
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

export type AutomationJob = Job<AutomationData>

export type DidNotTriggerResponse = {
  outputs: {
    success: false
    status: AutomationStatus.STOPPED
  }
  message: AutomationStoppedReason.TRIGGER_FILTER_NOT_MET
}
