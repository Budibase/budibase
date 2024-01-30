import { AutomationResults, AutomationStep } from "@budibase/types"

export enum LoopStepType {
  ARRAY = "Array",
  STRING = "String",
}

export interface LoopStep extends AutomationStep {
  inputs: LoopInput
}

export interface LoopInput {
  option: LoopStepType
  binding?: string[] | string | number[]
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
