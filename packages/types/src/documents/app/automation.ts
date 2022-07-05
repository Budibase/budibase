import { Document } from "../document"

export interface Automation extends Document {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
  }
  appId: string
  name: string
}

export interface AutomationStep {
  id: string
  stepId: string
}

export interface AutomationTrigger {
  id: string
  stepId: string
}

export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
  STOPPED = "stopped",
}

export interface AutomationResults {
  automationId: string
  status: string
  trigger?: any
  steps: {
    stepId: string
    inputs: {
      [key: string]: any
    }
    outputs: {
      [key: string]: any
    }
  }[]
}

export interface AutomationLog extends AutomationResults, Document {
  automationName: string
  _rev?: string
}

export interface AutomationLogPage {
  data: AutomationLog[]
  hasNextPage: boolean
  nextPage?: string
}
