import { Document } from "./document"

export interface Automation extends Document {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
  }
}

export interface AutomationStep {}

export interface AutomationTrigger {}
