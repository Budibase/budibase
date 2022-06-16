import { Document } from "../document"

export interface Automation extends Document {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
  }
  appId: string
}

export interface AutomationStep {
  id: string
  stepId: string
}

export interface AutomationTrigger {
  id: string
  stepId: string
}
