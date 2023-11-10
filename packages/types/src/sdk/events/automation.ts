import { BaseEvent } from "./event"

export interface AutomationCreatedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  audited: {
    name: string
  }
}

export interface AutomationTriggerUpdatedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationDeletedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  audited: {
    name: string
  }
}

export interface AutomationTestedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
}

export interface AutomationStepCreatedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  stepId: string
  stepType: string
  audited: {
    name: string
  }
}

export interface AutomationStepDeletedEvent extends BaseEvent {
  appId: string
  automationId: string
  triggerId: string
  triggerType: string
  stepId: string
  stepType: string
  audited: {
    name: string
  }
}

export interface AutomationsRunEvent extends BaseEvent {
  count: number
}
