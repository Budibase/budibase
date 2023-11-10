import { AutomationResults, AutomationStep } from "@budibase/types"

export enum LoopStepType {
  ARRAY = "Array",
  STRING = "String",
}

export interface LoopStep extends AutomationStep {
  inputs: {
    option: LoopStepType
    [key: string]: any
  }
}

export interface LoopInput {
  binding: string[] | string
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
