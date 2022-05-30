export interface AutomationCreatedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationTriggerUpdatedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationDeletedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationTestedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationStepCreatedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  stepId: string
  stepType: string
}

export interface AutomationStepDeletedEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  stepId: string
  stepType: string
}

export interface AutomationsRunEvent {
  count: number
}
