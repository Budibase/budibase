import { LoopStepType, UserBindings } from "@budibase/types"

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
  trigger: any
  steps: any[]
  stepsById: Record<string, any>
  stepsByName: Record<string, any>
  env?: Record<string, string>
  user?: UserBindings
  settings?: {
    url?: string
    logo?: string
    company?: string
  }
  loop?: { currentItem: any }
}
