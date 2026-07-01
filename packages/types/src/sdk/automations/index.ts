import {
  Automation,
  AutomationMetadata,
  AutomationStepResult,
  Row,
  UserBindings,
} from "../../documents"
import { Job } from "bull"

export interface AutomationResumeContext {
  // Ordered step results from the suspended run - restored into the orchestrator
  // context so that bindings like {{ steps.stepName.x }} resolve correctly.
  stepResults: AutomationStepResult[]
  state: Record<string, any>
}

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
  // Carries suspended state for resumed automations - restored into context
  // before executeSteps runs so prior bindings remain available.
  resumeContext?: AutomationResumeContext
}

export interface AutomationData {
  event: AutomationDataEvent
  automation: Automation
  // Set server-side on resume to skip the quota increment
  isResume?: boolean
}

export interface AutomationRowEvent {
  appId: string
  row: Row
  oldRow: Row
}

export type AutomationJob = Job<AutomationData>
