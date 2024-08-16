import { AutomationResults, LoopStepType } from "@budibase/types"

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

export interface AutomationContext extends AutomationResults {
  steps: any[]
  env?: Record<string, string>
  trigger: any
}
