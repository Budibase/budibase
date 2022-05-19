export interface Automation {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
  }
}

export interface AutomationStep {}

export interface AutomationTrigger {}
