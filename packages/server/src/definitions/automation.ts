export interface AutomationResults {
  automationId: string
  status: string
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
