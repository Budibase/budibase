export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
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

export interface AutomationLog extends AutomationResults {
  createdAt: string
  _id: string
  _rev: string
}

export interface AutomationLogPage {
  data: AutomationLog[]
  hasNextPage: boolean
  nextPage?: string
}
