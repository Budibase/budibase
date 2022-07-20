import { Automation, AutomationResults, AutomationStep } from "@budibase/types"

export enum LoopStepTypes {
  ARRAY = "Array",
  STRING = "String",
}

export interface LoopStep extends AutomationStep {
  inputs: {
    option: LoopStepTypes
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

export interface AutomationEvent {
  data: {
    automation: Automation
    event: any
  }
}

export interface AutomationContext extends AutomationResults {
  steps: any[]
  trigger: any
}
