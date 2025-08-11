import {
  AutomationStepResult,
  AutomationStepResultOutputs,
  AutomationTriggerResultOutputs,
  LoopStepType,
  UserBindings,
} from "@budibase/types"

export interface LoopInput {
  option: LoopStepType
  binding?: string[] | string | number[]
  iterations?: string
  failure?: any
}

export interface TriggerOutput {
  metadata?: any
  appId?: string
  timestamp?: number
}

export interface AutomationContext {
  trigger: AutomationTriggerResultOutputs
  steps: Record<
    string,
    AutomationStepResultOutputs | AutomationTriggerResultOutputs
  >
  stepsByName: Record<string, AutomationStepResultOutputs>
  stepsById: Record<string, AutomationStepResultOutputs>
  env?: Record<string, string>
  user?: UserBindings
  settings?: {
    url?: string
    logo?: string
    company?: string
  }
  loop?: { currentItem: any }
  _stepIndex: number
  _error: boolean
  _stepResults: AutomationStepResult[]
}
