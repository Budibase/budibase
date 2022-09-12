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
  inputs: {
    [key: string]: any
  }
  schema: {
    inputs: {
      [key: string]: any
    }
  }
}

export interface AutomationTrigger {
  id: string
  stepId: string
  inputs: {
    [key: string]: any
  }
  cronJobId?: string
}

export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
  STOPPED = "stopped",
  STOPPED_ERROR = "stopped_error",
}

export interface AutomationResults {
  automationId?: string
  status?: AutomationStatus
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
