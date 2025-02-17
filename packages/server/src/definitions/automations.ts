import {
  AutomationStepResult,
  AutomationStepResultOutputs,
  AutomationTriggerResult,
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
  steps: [AutomationTriggerResultOutputs, ...AutomationStepResultOutputs[]]
  stepsById: Record<string, AutomationStepResultOutputs>
  stepsByName: Record<string, AutomationStepResultOutputs>
  env?: Record<string, string>
  user?: UserBindings
  settings?: {
    url?: string
    logo?: string
    company?: string
  }
  loop?: { currentItem: any }
}
